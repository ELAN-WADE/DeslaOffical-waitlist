// ==============================================================================
// DESLA ATELIER — SQLITE TO SUPABASE SERVERLESS MIGRATOR
// ==============================================================================
// Usage: node scripts/migrate-sqlite-to-supabase.mjs
// Description: Copies all existing waitlist members and outbox jobs from local
//              SQLite (data/delsla.db) into your live Supabase PostgreSQL database.
// ==============================================================================

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Load environment variables from .env.local or .env
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const f of envFiles) {
    const fullPath = path.join(projectRoot, f);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\n❌ ERROR: Supabase credentials missing!');
  console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local before running migration.');
  console.error('Example:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...\n');
  process.exit(1);
}

const sqlitePath = path.join(projectRoot, 'data', 'delsla.db');
if (!fs.existsSync(sqlitePath)) {
  console.error(`\n❌ ERROR: Local SQLite database not found at: ${sqlitePath}\n`);
  process.exit(1);
}

const db = new Database(sqlitePath, { readonly: true });

async function postgrest(endpoint, body) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[Supabase ${res.status}] ${err}`);
  }
}

async function run() {
  console.log('\n🚀 Starting Desla SQLite -> Supabase PostgreSQL Data Migration...');
  console.log(`📡 Connecting to Supabase: ${SUPABASE_URL}`);

  // 1. Fetch waitlist records
  const waitlistRows = db.prepare('SELECT * FROM waitlist ORDER BY queue_number ASC').all();
  console.log(`📦 Found ${waitlistRows.length} waitlist members in SQLite.`);

  if (waitlistRows.length > 0) {
    const formattedMembers = waitlistRows.map((r) => ({
      id: r.id,
      full_name: r.full_name,
      email: r.email.toLowerCase(),
      city: r.city || 'Lagos',
      role: r.role,
      skin_concern: r.skin_concern || null,
      creator_handle: r.creator_handle || null,
      creator_platform: r.creator_platform || null,
      distributor_business: r.distributor_business || null,
      distributor_volume: r.distributor_volume || null,
      partner_organization: r.partner_organization || null,
      partner_focus: r.partner_focus || null,
      queue_number: r.queue_number,
      referral_code: r.referral_code,
      status: r.status || 'confirmed',
      ip_address: r.ip_address || null,
      user_agent: r.user_agent || null,
      created_at: r.created_at || new Date().toISOString(),
      updated_at: r.updated_at || new Date().toISOString(),
    }));

    // Insert in batches of 50
    const chunkSize = 50;
    for (let i = 0; i < formattedMembers.length; i += chunkSize) {
      const chunk = formattedMembers.slice(i, i + chunkSize);
      await postgrest('waitlist', chunk);
      console.log(`  ✓ Migrated waitlist records ${i + 1} to ${Math.min(i + chunkSize, formattedMembers.length)}`);
    }
  }

  // 2. Fetch email_jobs
  const jobRows = db.prepare('SELECT * FROM email_jobs ORDER BY created_at ASC').all();
  console.log(`\n📬 Found ${jobRows.length} email outbox jobs in SQLite.`);

  if (jobRows.length > 0) {
    const formattedJobs = jobRows.map((j) => {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(j.payload_json);
      } catch (e) {
        parsedPayload = { raw: j.payload_json };
      }

      return {
        id: j.id,
        waitlist_id: j.waitlist_id,
        recipient_email: j.recipient_email,
        recipient_name: j.recipient_name,
        role: j.role,
        subject: j.subject,
        template_type: j.template_type,
        payload_json: parsedPayload,
        status: j.status || 'pending',
        attempts: j.attempts || 0,
        max_attempts: j.max_attempts || 3,
        last_error: j.last_error || null,
        sent_at: j.sent_at || null,
        created_at: j.created_at || new Date().toISOString(),
        updated_at: j.updated_at || new Date().toISOString(),
      };
    });

    const chunkSize = 50;
    for (let i = 0; i < formattedJobs.length; i += chunkSize) {
      const chunk = formattedJobs.slice(i, i + chunkSize);
      await postgrest('email_jobs', chunk);
      console.log(`  ✓ Migrated email jobs ${i + 1} to ${Math.min(i + chunkSize, formattedJobs.length)}`);
    }
  }

  // 3. Sync Postgres Queue Sequence
  const maxQueue = waitlistRows.reduce((max, r) => Math.max(max, r.queue_number || 0), 1420);
  console.log(`\n🔢 Synchronizing VIP Queue Sequence: Next queue will start at #${maxQueue + 1}...`);

  try {
    const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/set_queue_sequence`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_next_val: maxQueue + 1 }),
    });

    if (rpcRes.ok) {
      console.log(`  ✓ Sequence waitlist_queue_seq updated successfully!`);
    } else {
      console.log(`  ℹ Note: To align sequence manually in Supabase SQL editor: SELECT setval('waitlist_queue_seq', ${maxQueue + 1}, false);`);
    }
  } catch (e) {
    console.log(`  ℹ Note: To align sequence in Supabase SQL Editor run: SELECT setval('waitlist_queue_seq', ${maxQueue + 1}, false);`);
  }

  console.log('\n✨ MIGRATION COMPLETE! All records are live on Supabase.');
  console.log('You can verify the data in your Supabase Table Editor at https://supabase.com/dashboard\n');
}

run().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
