import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const dbPath = path.join(rootDir, 'data', 'delsla.db');

if (!fs.existsSync(dbPath)) {
  console.log(`[Worker] Database not found at ${dbPath}. Please run the Next.js app first.`);
  process.exit(0);
}

const db = new Database(dbPath);
console.log('[Worker Daemon] Delsla Email Background Worker active. Polling pending jobs...');

async function runPoll() {
  const pending = db.prepare(`SELECT COUNT(*) as count FROM email_jobs WHERE status = 'pending'`).get();
  if (pending && pending.count > 0) {
    console.log(`[Worker Daemon] Found ${pending.count} pending jobs to process.`);
    // Trigger Next.js endpoint or process directly
    try {
      const response = await fetch('http://localhost:3000/api/worker/process-emails', { method: 'POST' });
      const data = await response.json();
      console.log('[Worker Daemon] Processed batch:', data);
    } catch (e) {
      console.log('[Worker Daemon] Note: Next dev server not reachable for webhook, will retry.');
    }
  }
}

setInterval(runPoll, 5000);
runPoll();
