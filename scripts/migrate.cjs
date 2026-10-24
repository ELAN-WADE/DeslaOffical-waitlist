const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'delsla.db'));

console.log('Current tables:');
const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table'").all();
for (const t of tables) {
  console.log(`--- ${t.name} ---`);
  console.log(t.sql);
}

// If waitlist has a CHECK constraint on role that excludes 'partner', we recreate the table preserving data
db.transaction(() => {
  // 1. Rename existing waitlist
  db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist_new (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      city TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('shopper', 'creator', 'distributor', 'partner')),
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
  `);

  // Copy data
  db.exec(`
    INSERT OR IGNORE INTO waitlist_new (
      id, full_name, email, city, role, skin_concern,
      creator_handle, creator_platform, distributor_business, distributor_volume,
      partner_organization, partner_focus, queue_number, referral_code,
      status, ip_address, user_agent, created_at, updated_at
    )
    SELECT 
      id, full_name, email, city, role, skin_concern,
      creator_handle, creator_platform, distributor_business, distributor_volume,
      partner_organization, partner_focus, queue_number, referral_code,
      status, ip_address, user_agent, created_at, updated_at
    FROM waitlist;
  `);

  // Drop old table and rename new
  db.exec(`DROP TABLE waitlist;`);
  db.exec(`ALTER TABLE waitlist_new RENAME TO waitlist;`);

  // Rebuild indices
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
    CREATE INDEX IF NOT EXISTS idx_waitlist_role ON waitlist(role);
    CREATE INDEX IF NOT EXISTS idx_waitlist_queue ON waitlist(queue_number);
  `);
})();

console.log('Migration successful. Current waitlist count:', db.prepare('SELECT count(*) as c FROM waitlist').get().c);
