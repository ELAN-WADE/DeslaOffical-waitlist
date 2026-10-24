import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists (supports persistent volumes on Render & Railway)
function getDataDir(): string {
  const raw = process.env.DATA_DIR;
  if (raw && raw.trim()) {
    return path.isAbsolute(raw.trim()) ? raw.trim() : path.resolve(/*turbopackIgnore: true*/ process.cwd(), raw.trim());
  }
  return path.join(process.cwd(), 'data');
}

function getDatabasePath(): string {
  const raw = process.env.DATABASE_PATH;
  if (raw && raw.trim()) {
    return path.isAbsolute(raw.trim()) ? raw.trim() : path.resolve(/*turbopackIgnore: true*/ process.cwd(), raw.trim());
  }
  return path.join(getDataDir(), 'delsla.db');
}

declare global {
  // eslint-disable-next-line no-var
  var __delslaDb: Database.Database | undefined;
}

let cachedDb: Database.Database | null = null;

export function getDb(): Database.Database {
  if (global.__delslaDb) {
    return global.__delslaDb;
  }
  if (cachedDb) {
    return cachedDb;
  }

  const dataDir = getDataDir();
  if (!fs.existsSync(/*turbopackIgnore: true*/ dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (dirErr) {
      console.error('[DB] Error creating data directory:', dirErr);
    }
  }

  const dbPath = getDatabasePath();
  const db = new Database(dbPath);

  // High performance & concurrency settings
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000'); // 5s timeout to prevent SQLITE_BUSY under concurrent load

  // Initialize schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      city TEXT NOT NULL,
      role TEXT NOT NULL,
      skin_concern TEXT,
      creator_handle TEXT,
      creator_platform TEXT,
      distributor_business TEXT,
      distributor_volume TEXT,
      partner_organization TEXT,
      partner_focus TEXT,
      queue_number INTEGER NOT NULL UNIQUE,
      referral_code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'confirmed',
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
    CREATE INDEX IF NOT EXISTS idx_waitlist_role ON waitlist(role);
    CREATE INDEX IF NOT EXISTS idx_waitlist_queue ON waitlist(queue_number);
  `);

  // Safe additive migrations for existing databases
  try {
    db.exec(`ALTER TABLE waitlist ADD COLUMN partner_organization TEXT;`);
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE waitlist ADD COLUMN partner_focus TEXT;`);
  } catch (e) {}

  db.exec(`
    CREATE TABLE IF NOT EXISTS email_jobs (
      id TEXT PRIMARY KEY,
      waitlist_id TEXT NOT NULL REFERENCES waitlist(id) ON DELETE CASCADE,
      recipient_email TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      role TEXT NOT NULL,
      subject TEXT NOT NULL,
      template_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'sent', 'failed')),
      attempts INTEGER NOT NULL DEFAULT 0,
      max_attempts INTEGER NOT NULL DEFAULT 3,
      last_error TEXT,
      sent_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_email_jobs_status ON email_jobs(status);
    CREATE INDEX IF NOT EXISTS idx_email_jobs_waitlist_id ON email_jobs(waitlist_id);
  `);

  // Maintain singleton in both production and development to prevent database locking
  cachedDb = db;
  global.__delslaDb = db;

  return db;
}

export default getDb;
