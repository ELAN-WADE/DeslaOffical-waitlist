import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminRequest } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const db = getDb();

    // Query each waitlist member exactly once with their latest email job status
    const entries = db.prepare(`
      SELECT 
        w.*,
        ej.status as email_status,
        ej.attempts as email_attempts,
        ej.sent_at as email_sent_at,
        ej.last_error as email_error
      FROM waitlist w
      LEFT JOIN (
        SELECT 
          waitlist_id,
          status,
          attempts,
          sent_at,
          last_error,
          ROW_NUMBER() OVER (PARTITION BY waitlist_id ORDER BY created_at DESC) as rn
        FROM email_jobs
      ) ej ON w.id = ej.waitlist_id AND ej.rn = 1
      ORDER BY w.queue_number DESC
      LIMIT 100
    `).all();

    const jobs = db.prepare(`
      SELECT * FROM email_jobs
      ORDER BY created_at DESC
      LIMIT 50
    `).all();

    const stats = {
      totalEntries: (db.prepare('SELECT COUNT(*) as count FROM waitlist').get() as any).count,
      pendingEmails: (db.prepare(`SELECT COUNT(*) as count FROM email_jobs WHERE status = 'pending'`).get() as any).count,
      sentEmails: (db.prepare(`SELECT COUNT(*) as count FROM email_jobs WHERE status = 'sent'`).get() as any).count,
      failedEmails: (db.prepare(`SELECT COUNT(*) as count FROM email_jobs WHERE status = 'failed'`).get() as any).count,
    };

    return NextResponse.json({
      success: true,
      stats,
      entries,
      recentJobs: jobs,
    });
  } catch (error: unknown) {
    console.error('[API /api/admin/entries] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve waitlist data' },
      { status: 500 }
    );
  }
}
