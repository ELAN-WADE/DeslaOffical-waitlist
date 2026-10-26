// ==============================================================================
// DESLA ATELIER — SUPABASE EDGE FUNCTION: PROCESS OUTBOX EMAILS
// ==============================================================================
// Runtime: Supabase Edge Runtime (Deno / TypeScript)
// Invocation: POST https://<project-ref>.functions.supabase.co/process-emails
// Triggers: Supabase Database Webhook on email_jobs INSERT, or scheduled pg_cron
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface EmailPayload {
  fullName: string;
  email: string;
  role: string;
  queueNumber: number;
  referralCode: string;
  city?: string;
  templateType?: string;
  customSubject?: string;
  customHeadline?: string;
  messageBody?: string;
  callToActionText?: string;
  callToActionUrl?: string;
}

interface EmailJobRecord {
  id: string;
  waitlist_id: string;
  recipient_email: string;
  recipient_name: string;
  role: string;
  subject: string;
  template_type: string;
  payload_json: EmailPayload | string;
  status: string;
  attempts: number;
  max_attempts: number;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SMTP_FROM = Deno.env.get("SMTP_FROM") || "Desla Luxury Atelier <concierge@desla.com>";

serve(async (req: Request) => {
  // CORS Headers
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "15", 10);

    // 1. Fetch pending email jobs from Supabase REST
    const fetchJobsUrl = `${SUPABASE_URL}/rest/v1/email_jobs?status=eq.pending&attempts=lt.3&order=created_at.asc&limit=${limit}`;
    const jobsRes = await fetch(fetchJobsUrl, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!jobsRes.ok) {
      const errText = await jobsRes.text();
      throw new Error(`Failed to fetch pending jobs from Supabase: ${errText}`);
    }

    const jobs: EmailJobRecord[] = await jobsRes.json();

    if (jobs.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0, message: "No pending email jobs." }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = [];

    // 2. Process each job
    for (const job of jobs) {
      // Mark as processing
      await fetch(`${SUPABASE_URL}/rest/v1/email_jobs?id=eq.${job.id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ status: "processing", updated_at: new Date().toISOString() }),
      });

      try {
        const payload: EmailPayload = typeof job.payload_json === "string" 
          ? JSON.parse(job.payload_json) 
          : job.payload_json;

        // Luxury HTML Template builder
        const emailHtml = generateLuxuryEmailHtml(job, payload);

        // Dispatch via Resend API
        if (RESEND_API_KEY) {
          const resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: SMTP_FROM,
              to: [job.recipient_email],
              subject: job.subject,
              html: emailHtml,
            }),
          });

          if (!resendRes.ok) {
            const resendErr = await resendRes.text();
            throw new Error(`Resend API Error: ${resendErr}`);
          }
        } else {
          console.log(`[Edge Function] Simulated dispatch for ${job.recipient_email} (RESEND_API_KEY not set)`);
        }

        // Mark as sent
        await fetch(`${SUPABASE_URL}/rest/v1/email_jobs?id=eq.${job.id}`, {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "sent",
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_error: null,
          }),
        });

        results.push({ id: job.id, email: job.recipient_email, status: "sent" });
      } catch (sendErr: unknown) {
        const errorMessage = sendErr instanceof Error ? sendErr.message : String(sendErr);
        const newAttempts = job.attempts + 1;
        const newStatus = newAttempts >= job.max_attempts ? "failed" : "pending";

        await fetch(`${SUPABASE_URL}/rest/v1/email_jobs?id=eq.${job.id}`, {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            attempts: newAttempts,
            last_error: errorMessage,
            updated_at: new Date().toISOString(),
          }),
        });

        results.push({ id: job.id, email: job.recipient_email, status: "failed", error: errorMessage });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      details: results,
      timestamp: new Date().toISOString(),
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

function generateLuxuryEmailHtml(job: EmailJobRecord, payload: EmailPayload): string {
  const isBroadcast = job.template_type === "broadcast";
  const title = isBroadcast 
    ? (payload.customHeadline || "ATELIER ANNOUNCEMENT")
    : "VIP RESERVATION CONFIRMED";

  const message = isBroadcast 
    ? (payload.messageBody || "Exclusive update from Desla.")
    : `Your place in the founding cohort of Desla has been secured. Priority allocations are assigned in strict sequence based on registration time.`;

  const ctaBtn = payload.callToActionText && payload.callToActionUrl 
    ? `<div style="text-align: center; margin: 32px 0;">
         <a href="${payload.callToActionUrl}" style="background-color: #D4AF37; color: #000000; padding: 14px 32px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; display: inline-block; border-radius: 2px;">
           ${payload.callToActionText}
         </a>
       </div>`
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${job.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050505; color: #F5F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid #262626;">
          <tr>
            <td style="padding: 40px 32px; text-align: center; border-bottom: 1px solid #1F1F1F;">
              <span style="font-size: 24px; font-weight: 800; letter-spacing: 0.35em; color: #D4AF37; text-transform: uppercase;">DESLA</span>
              <div style="font-size: 11px; letter-spacing: 0.25em; color: #888888; margin-top: 6px; text-transform: uppercase;">Haute Skincare & Cellular Formulation</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 32px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.2em; color: #D4AF37; text-transform: uppercase; margin-bottom: 12px;">${title}</div>
              <h1 style="font-size: 26px; font-weight: 300; margin: 0 0 20px 0; color: #FFFFFF; letter-spacing: 0.05em;">Welcome, ${payload.fullName}</h1>
              
              <div style="background-color: #121212; border: 1px solid #2A2A2A; padding: 24px; border-radius: 4px; margin: 24px 0; text-align: center;">
                <div style="font-size: 12px; letter-spacing: 0.15em; color: #9E9E9E; text-transform: uppercase;">Your Priority Position</div>
                <div style="font-size: 42px; font-weight: 800; color: #D4AF37; margin: 8px 0; letter-spacing: 0.05em;">#${payload.queueNumber}</div>
                <div style="font-size: 12px; color: #707070;">VIP Invitation Code: <strong style="color: #FFFFFF; letter-spacing: 0.1em;">${payload.referralCode}</strong></div>
              </div>

              <div style="font-size: 15px; line-height: 1.8; color: #CCCCCC; white-space: pre-line; margin-bottom: 24px;">
                ${message}
              </div>

              ${ctaBtn}

              <div style="border-top: 1px solid #202020; padding-top: 24px; margin-top: 32px; font-size: 12px; color: #666666; line-height: 1.6;">
                Role Allocation: <strong style="color: #AAAAAA; text-transform: uppercase;">${payload.role}</strong><br />
                Invitation Link: <a href="https://delsla.com/waitlist?ref=${payload.referralCode}" style="color: #D4AF37; text-decoration: none;">https://delsla.com/waitlist?ref=${payload.referralCode}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; background-color: #050505; border-top: 1px solid #1F1F1F; text-align: center; font-size: 11px; color: #555555; letter-spacing: 0.1em;">
              DESLA LABORATORIES © 2026. ALL RIGHTS RESERVED. PRIVATE ALLOCATION.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
