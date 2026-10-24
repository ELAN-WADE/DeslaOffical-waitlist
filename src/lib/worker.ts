import { getDb } from './db';
import { sendEmailForJob } from './email-service';
import type { WaitlistEntry } from '../types';

export interface ProcessResult {
  processed: number;
  succeeded: number;
  failed: number;
  details: Array<{
    jobId: string;
    email: string;
    status: 'sent' | 'failed';
    error?: string;
  }>;
}

export function enqueueEmailJob(entry: WaitlistEntry): string {
  const db = getDb();
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  const payload = {
    fullName: entry.fullName,
    email: entry.email,
    role: entry.role,
    queueNumber: entry.queueNumber,
    referralCode: entry.referralCode,
    city: entry.city,
    skinConcern: entry.skinConcern || null,
    creatorHandle: entry.creatorHandle || null,
    creatorPlatform: entry.creatorPlatform || null,
    distributorBusiness: entry.distributorBusiness || null,
    distributorVolume: entry.distributorVolume || null,
    partnerOrganization: entry.partnerOrganization || null,
    partnerFocus: entry.partnerFocus || null,
  };

  const subject = 
    entry.role === 'creator'
      ? `Desla Creator Atelier — Reservation Confirmed (#${entry.queueNumber})`
      : entry.role === 'distributor'
      ? `Desla Distribution Allocation Confirmed (#${entry.queueNumber})`
      : entry.role === 'partner'
      ? `Desla Clinical Partnership Confirmed (#${entry.queueNumber})`
      : `Welcome to Desla — Your Place Is Reserved (#${entry.queueNumber})`;

  const stmt = db.prepare(`
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, 3)
  `);

  stmt.run(
    jobId,
    entry.id,
    entry.email,
    entry.fullName,
    entry.role,
    subject,
    `welcome_${entry.role}`,
    JSON.stringify(payload)
  );

  return jobId;
}

export async function processEmailJobs(limit = 10): Promise<ProcessResult> {
  const db = getDb();

  // Find pending jobs that have not exceeded max_attempts
  const pendingJobs = db
    .prepare(`
      SELECT * FROM email_jobs
      WHERE status = 'pending' AND attempts < max_attempts
      ORDER BY created_at ASC
      LIMIT ?
    `)
    .all(limit) as Array<{
      id: string;
      waitlist_id: string;
      recipient_email: string;
      recipient_name: string;
      role: string;
      subject: string;
      template_type: string;
      payload_json: string;
      status: string;
      attempts: number;
      max_attempts: number;
    }>;

  const result: ProcessResult = {
    processed: pendingJobs.length,
    succeeded: 0,
    failed: 0,
    details: [],
  };

  for (const job of pendingJobs) {
    // Mark as processing
    db.prepare(`UPDATE email_jobs SET status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(job.id);

    try {
      const payload = JSON.parse(job.payload_json);
      await sendEmailForJob({
        ...payload,
        jobId: job.id,
        templateType: job.template_type || payload.templateType,
        customSubject: payload.customSubject || job.subject,
      });

      // Update as sent
      db.prepare(`
        UPDATE email_jobs 
        SET status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, last_error = NULL
        WHERE id = ?
      `).run(job.id);

      result.succeeded++;
      result.details.push({
        jobId: job.id,
        email: job.recipient_email,
        status: 'sent',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const newAttempts = job.attempts + 1;
      const newStatus = newAttempts >= job.max_attempts ? 'failed' : 'pending';

      db.prepare(`
        UPDATE email_jobs 
        SET status = ?, attempts = ?, last_error = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newStatus, newAttempts, errorMessage, job.id);

      result.failed++;
      result.details.push({
        jobId: job.id,
        email: job.recipient_email,
        status: 'failed',
        error: errorMessage,
      });
    }
  }

  return result;
}

// Fire and forget background worker runner
export function triggerBackgroundWorker(): void {
  // Execute asynchronously in next tick so the HTTP response completes immediately
  setImmediate(async () => {
    try {
      const res = await processEmailJobs(10);
      if (res.processed > 0) {
        console.log(`[Email Worker] Background run finished: ${res.succeeded} sent, ${res.failed} failed.`);
      }
    } catch (workerErr) {
      console.error('[Email Worker] Unexpected worker failure:', workerErr);
    }
  });
}
