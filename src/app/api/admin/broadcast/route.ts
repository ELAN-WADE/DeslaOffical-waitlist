import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { triggerBackgroundWorker } from '@/lib/worker';
import { verifyAdminRequest } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      subject,
      headline = 'ATELIER ANNOUNCEMENT',
      messageBody,
      targetRole = 'all',
      callToActionText = '',
      callToActionUrl = '',
    } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { success: false, error: 'Subject line is required.' },
        { status: 400 }
      );
    }

    if (!messageBody || !messageBody.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required.' },
        { status: 400 }
      );
    }

    const db = getDb();

    let query = 'SELECT * FROM waitlist';
    let params: any[] = [];

    if (targetRole && targetRole !== 'all') {
      query += ' WHERE role = ?';
      params.push(targetRole);
    }
    query += ' ORDER BY queue_number ASC';

    const recipients = db.prepare(query).all(...params) as any[];

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No members found matching the selected audience criteria.' },
        { status: 404 }
      );
    }

    let queuedCount = 0;

    const insertJob = db.prepare(`
      INSERT INTO email_jobs (
        id,
        waitlist_id,
        recipient_email,
        recipient_name,
        role,
        subject,
        template_type,
        payload_json,
        status,
        attempts,
        max_attempts
      ) VALUES (?, ?, ?, ?, ?, ?, 'broadcast', ?, 'pending', 0, 3)
    `);

    const queueTransaction = db.transaction(() => {
      for (const r of recipients) {
        const jobId = `bcast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const payload = {
          fullName: r.full_name,
          email: r.email,
          role: r.role,
          queueNumber: r.queue_number,
          referralCode: r.referral_code,
          city: r.city || 'Lagos',
          templateType: 'broadcast',
          customSubject: subject.trim(),
          customHeadline: headline.trim(),
          messageBody: messageBody.trim(),
          callToActionText: callToActionText.trim() || undefined,
          callToActionUrl: callToActionUrl.trim() || undefined,
        };

        insertJob.run(
          jobId,
          r.id,
          r.email,
          r.full_name,
          r.role,
          subject.trim(),
          JSON.stringify(payload)
        );
        queuedCount++;
      }
    });

    queueTransaction();

    // Trigger background worker to process queue asynchronously
    triggerBackgroundWorker();

    return NextResponse.json({
      success: true,
      queuedCount,
      message: `Successfully queued announcement to ${queuedCount} ${targetRole === 'all' ? 'members' : targetRole + 's'}.`,
    });
  } catch (error: unknown) {
    console.error('[API /api/admin/broadcast] Error queueing broadcast:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch broadcast message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = getDb();
    const recentBroadcasts = db.prepare(`
      SELECT id, subject, recipient_name, recipient_email, role, status, attempts, created_at
      FROM email_jobs
      WHERE template_type = 'broadcast'
      ORDER BY created_at DESC
      LIMIT 30
    `).all();

    return NextResponse.json({
      success: true,
      recentBroadcasts,
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve broadcasts' }, { status: 500 });
  }
}