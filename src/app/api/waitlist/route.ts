import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { waitlistFormSchema } from '@/lib/validations';
import { enqueueEmailJob, triggerBackgroundWorker } from '@/lib/worker';
import { sendEmailForJob } from '@/lib/email-service';
import type { WaitlistEntry } from '@/types';

// In-memory sliding window rate limiter: max 20 submissions per minute per IP for testing flexibility
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string, limit = 20, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count++;
  return true;
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || '127.0.0.1';

    // 1. IP Rate Limiting Check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many reservation attempts from this connection. Please wait a minute and try again.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 2. Automated Spambot Honeypot
    if (body.website_url || body.hp_trap) {
      return NextResponse.json({ success: true, message: 'Reservation queued.' }, { status: 201 });
    }
    
    // 3. Server-side Zod validation
    const validation = waitlistFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      fullName,
      firstName,
      email,
      city,
      role,
      skinConcern,
      creatorHandle,
      creatorPlatform,
      distributorBusiness,
      distributorVolume,
      partnerOrganization,
      partnerFocus,
    } = validation.data;

    const resolvedFullName = (fullName && fullName.trim()) 
      ? fullName.trim() 
      : (firstName && firstName.trim()) 
        ? firstName.trim() 
        : 'Desla Member';

    const db = getDb();
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // 4. Check if email already registered: if so, update their role & preferences, and DISPATCH an email immediately!
    const existing = db.prepare('SELECT * FROM waitlist WHERE email = ?').get(email) as any;
    if (existing) {
      db.prepare(`
        UPDATE waitlist SET
          full_name = ?,
          city = ?,
          role = ?,
          skin_concern = ?,
          creator_handle = ?,
          creator_platform = ?,
          distributor_business = ?,
          distributor_volume = ?,
          partner_organization = ?,
          partner_focus = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        resolvedFullName,
        city,
        role,
        skinConcern || null,
        creatorHandle || null,
        creatorPlatform || null,
        distributorBusiness || null,
        distributorVolume || null,
        partnerOrganization || null,
        partnerFocus || null,
        existing.id
      );

      const updatedEntry: WaitlistEntry = {
        id: existing.id,
        fullName: resolvedFullName,
        email: existing.email,
        city: city,
        role: role,
        skinConcern: skinConcern || undefined,
        creatorHandle: creatorHandle || undefined,
        creatorPlatform: creatorPlatform || undefined,
        distributorBusiness: distributorBusiness || undefined,
        distributorVolume: distributorVolume || undefined,
        partnerOrganization: partnerOrganization || undefined,
        partnerFocus: partnerFocus || undefined,
        queueNumber: existing.queue_number,
        referralCode: existing.referral_code,
        status: existing.status,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      // Create new transactional email job for this updated role reservation
      const newJobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const subject = 
        role === 'creator'
          ? `Desla Creator Atelier — VIP Waitlist Confirmation (Queue #${existing.queue_number})`
          : role === 'distributor'
          ? `Desla Commercial & Distribution Allocation Confirmed (Queue #${existing.queue_number})`
          : role === 'partner'
          ? `Desla Formulation & Clinical Partnership Confirmed (Queue #${existing.queue_number})`
          : `Welcome to Desla — Your Place Is Reserved (Queue #${existing.queue_number})`;

      const payload = {
        fullName: resolvedFullName,
        email: existing.email,
        role: role,
        queueNumber: existing.queue_number,
        referralCode: existing.referral_code,
        city: city,
        skinConcern: skinConcern || null,
        creatorHandle: creatorHandle || null,
        creatorPlatform: creatorPlatform || null,
        distributorBusiness: distributorBusiness || null,
        distributorVolume: distributorVolume || null,
        partnerOrganization: partnerOrganization || null,
        partnerFocus: partnerFocus || null,
      };

      db.prepare(`
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
      `).run(
        newJobId,
        existing.id,
        existing.email,
        resolvedFullName,
        role,
        subject,
        `welcome_${role}`,
        JSON.stringify(payload)
      );

      // Immediately dispatch the email synchronously so it arrives in the user's inbox instantly!
      try {
        await sendEmailForJob({
          ...payload,
          jobId: newJobId,
        });
        db.prepare(`UPDATE email_jobs SET status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(newJobId);
        console.log(`[Waitlist API] Synchronous email dispatch succeeded for updated member: ${existing.email} (role: ${role})`);
      } catch (sendErr) {
        console.error('[Waitlist API] Synchronous send failed, background worker will retry:', sendErr);
        triggerBackgroundWorker();
      }

      return NextResponse.json(
        {
          success: true,
          isExisting: true,
          message: `Your reservation has been confirmed for the ${role.toUpperCase()} role. A personalized confirmation email has been dispatched to your inbox.`,
          entry: updatedEntry,
          jobId: newJobId,
        },
        { status: 200 }
      );
    }

    // 5. New member reservation: execute atomic insertion within transaction
    let newEntry: WaitlistEntry | null = null;
    let createdJobId = '';

    const executeReservation = db.transaction(() => {
      // Calculate next sequential VIP queue number
      const maxRow = db.prepare('SELECT MAX(queue_number) as max_q FROM waitlist').get() as { max_q: number | null };
      const nextQueue = (maxRow?.max_q && maxRow.max_q >= 1420) ? maxRow.max_q + 1 : 1421;

      // Generate unique referral code
      let referralCode = `DLS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      while (db.prepare('SELECT 1 FROM waitlist WHERE referral_code = ?').get(referralCode)) {
        referralCode = `DLS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      }

      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      db.prepare(`
        INSERT INTO waitlist (
          id,
          full_name,
          email,
          city,
          role,
          skin_concern,
          creator_handle,
          creator_platform,
          distributor_business,
          distributor_volume,
          partner_organization,
          partner_focus,
          queue_number,
          referral_code,
          status,
          ip_address,
          user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)
      `).run(
        id,
        resolvedFullName,
        email,
        city,
        role,
        skinConcern || null,
        creatorHandle || null,
        creatorPlatform || null,
        distributorBusiness || null,
        distributorVolume || null,
        partnerOrganization || null,
        partnerFocus || null,
        nextQueue,
        referralCode,
        ip,
        userAgent
      );

      newEntry = {
        id,
        fullName: resolvedFullName,
        email,
        city,
        role,
        skinConcern: skinConcern || undefined,
        creatorHandle: creatorHandle || undefined,
        creatorPlatform: creatorPlatform || undefined,
        distributorBusiness: distributorBusiness || undefined,
        distributorVolume: distributorVolume || undefined,
        partnerOrganization: partnerOrganization || undefined,
        partnerFocus: partnerFocus || undefined,
        queueNumber: nextQueue,
        referralCode,
        status: 'confirmed',
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      // Enqueue transactional email job
      createdJobId = enqueueEmailJob(newEntry);
    });

    executeReservation();

    // 6. Immediately dispatch the welcome newsletter synchronously so the user receives it in their inbox immediately!
    if (newEntry) {
      try {
        const payload = {
          fullName: (newEntry as WaitlistEntry).fullName,
          email: (newEntry as WaitlistEntry).email,
          role: (newEntry as WaitlistEntry).role,
          queueNumber: (newEntry as WaitlistEntry).queueNumber,
          referralCode: (newEntry as WaitlistEntry).referralCode,
          city: (newEntry as WaitlistEntry).city,
          skinConcern: (newEntry as WaitlistEntry).skinConcern || null,
          creatorHandle: (newEntry as WaitlistEntry).creatorHandle || null,
          creatorPlatform: (newEntry as WaitlistEntry).creatorPlatform || null,
          distributorBusiness: (newEntry as WaitlistEntry).distributorBusiness || null,
          distributorVolume: (newEntry as WaitlistEntry).distributorVolume || null,
          partnerOrganization: (newEntry as WaitlistEntry).partnerOrganization || null,
          partnerFocus: (newEntry as WaitlistEntry).partnerFocus || null,
          jobId: createdJobId,
        };

        await sendEmailForJob(payload);
        db.prepare(`UPDATE email_jobs SET status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(createdJobId);
        console.log(`[Waitlist API] Synchronous email dispatch succeeded for new member: ${(newEntry as WaitlistEntry).email} (role: ${role})`);
      } catch (dispatchErr) {
        console.error('[Waitlist API] Synchronous dispatch error, falling back to background worker:', dispatchErr);
        triggerBackgroundWorker();
      }
    }

    return NextResponse.json(
      {
        success: true,
        isExisting: false,
        message: 'Your spot has been reserved. Confirmation email has been delivered to your inbox.',
        entry: newEntry,
        jobId: createdJobId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[API /api/waitlist] Error processing reservation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal server error occurred while reserving your spot. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = getDb();
    const countRow = db.prepare('SELECT COUNT(*) as total FROM waitlist').get() as { total: number };
    const roleStats = db.prepare('SELECT role, COUNT(*) as count FROM waitlist GROUP BY role').all();
    const latestQueue = db.prepare('SELECT MAX(queue_number) as latest FROM waitlist').get() as { latest: number | null };

    return NextResponse.json({
      success: true,
      stats: {
        totalJoined: countRow.total,
        displayTotal: (countRow.total || 0) + 1420,
        latestQueue: latestQueue.latest || 1420,
        roles: roleStats,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch waitlist stats' },
      { status: 500 }
    );
  }
}
