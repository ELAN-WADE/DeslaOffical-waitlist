import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import type { RoleType } from '../types';

export interface EmailTemplatePayload {
  fullName: string;
  email: string;
  role: RoleType;
  queueNumber: number;
  referralCode: string;
  city: string;
  skinConcern?: string | null;
  creatorHandle?: string | null;
  creatorPlatform?: string | null;
  distributorBusiness?: string | null;
  distributorVolume?: string | null;
  partnerOrganization?: string | null;
  partnerFocus?: string | null;
  // Custom broadcast fields
  templateType?: string;
  customSubject?: string;
  customHeadline?: string;
  messageBody?: string;
  callToActionText?: string;
  callToActionUrl?: string;
}

function getEmailsOutputDir(): string {
  const raw = process.env.DATA_DIR;
  const baseDir = raw && raw.trim()
    ? (path.isAbsolute(raw.trim()) ? raw.trim() : path.resolve(/*turbopackIgnore: true*/ process.cwd(), raw.trim()))
    : path.join(process.cwd(), 'data');
  return path.join(baseDir, 'emails');
}

function ensureEmailDir() {
  try {
    const dir = getEmailsOutputDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.warn('[Email Service] Could not ensure email directory:', err);
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Retrieves the official Desla! logo as a base64 Data URI for immediate visual rendering
export function getLogoDataUri(): string {
  try {
    const candidates = [
      path.join(process.cwd(), 'public', 'desla-logo.png'),
      path.join(process.cwd(), 'public', 'images', 'desla-logo.png'),
      path.join(process.cwd(), 'data', 'assets', 'desla-logo.png'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
        const b64 = fs.readFileSync(/*turbopackIgnore: true*/ p).toString('base64');
        return `data:image/png;base64,${b64}`;
      }
    }
  } catch (err) {
    console.error('[Email Service] Error reading logo file for base64 embed:', err);
  }
  return 'https://desla.beauty/desla-logo.png';
}

// Generate an ultra-luxury, minimalist, human editorial email (Aesop/The Row inspired aesthetic)
export function generateEmailHtml(data: EmailTemplatePayload): { subject: string; html: string; text: string } {
  const safeFullName = escapeHtml(data.fullName);
  const firstName = escapeHtml(data.fullName.split(' ')[0] || data.fullName);
  const safeCity = escapeHtml(data.city);
  const referralUrl = `https://desla.beauty/waitlist?ref=${encodeURIComponent(data.referralCode)}`;
  const logoSrc = getLogoDataUri();

  let subject = '';
  let roleTitle = '';
  let mainBodyText = '';
  let privilegesList = '';

  // 1. CREATOR ATELIER
  if (data.role === 'creator') {
    subject = `Welcome to the Desla Creator Atelier`;
    roleTitle = 'Creator Atelier';
    
    const handleInfo = data.creatorHandle
      ? `@${escapeHtml(data.creatorHandle.replace('@', ''))} on ${escapeHtml(data.creatorPlatform || 'Instagram / TikTok')}`
      : 'your creator profile';

    mainBodyText = `Thank you for joining the Desla Creator Atelier. We have reserved your place for ${handleInfo}. As we prepare our initial batches, early creators will receive select formulation samples and direct access to collaborative routine curations.`;

    privilegesList = `
      <div style="margin: 28px 0; padding-top: 20px; border-top: 1px solid #EAE6DF;">
        <p style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #8A8580; margin: 0 0 12px 0;">
          Atelier Privileges
        </p>
        <p style="font-size: 13.5px; line-height: 1.8; color: #3A3835; margin: 0;">
          &bull; Pre-release sample deliveries directly to your studio.<br/>
          &bull; 15% revenue share on shoppable routine edits.<br/>
          &bull; Private sensory previews in Paris, London, and Lagos.<br/>
          &bull; Direct WhatsApp liaison for campaign coordination.
        </p>
      </div>
    `;
  }
  // 2. COMMERCIAL & DISTRIBUTOR
  else if (data.role === 'distributor') {
    subject = `Desla Commercial & Clinic Allocation confirmed`;
    roleTitle = 'Distribution & Clinic Allocation';

    const entityName = data.distributorBusiness ? escapeHtml(data.distributorBusiness) : 'your enterprise';
    const volumeInfo = data.distributorVolume ? escapeHtml(data.distributorVolume) : 'Tier 1 Wholesale';

    mainBodyText = `Thank you for registering commercial interest for ${entityName}. With an indicated volume preference of ${volumeInfo} in ${safeCity}, your reservation is now logged in our launch allocation registry.`;

    privilegesList = `
      <div style="margin: 28px 0; padding-top: 20px; border-top: 1px solid #EAE6DF;">
        <p style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #8A8580; margin: 0 0 12px 0;">
          Wholesale Terms
        </p>
        <p style="font-size: 13.5px; line-height: 1.8; color: #3A3835; margin: 0;">
          &bull; Tiered wholesale margin with regional territory protection.<br/>
          &bull; Cold-chain temperature-monitored logistics maintained under 24&deg;C.<br/>
          &bull; Batch Certificates of Analysis (COA) provided with every delivery.<br/>
          &bull; Dedicated account representative assigned 14 days before launch.
        </p>
      </div>
    `;
  }
  // 3. CLINICAL PARTNER
  else if (data.role === 'partner') {
    subject = `Desla Clinical Formulation Alliance confirmed`;
    roleTitle = 'Clinical & Formulation Alliance';

    const orgName = data.partnerOrganization ? escapeHtml(data.partnerOrganization) : 'your organization';
    mainBodyText = `Thank you for registering ${orgName} with Desla. We collaborate closely with dermatologists, medical estheticians, and skin researchers to validate barrier formulations developed for deeper skin tones.`;

    privilegesList = `
      <div style="margin: 28px 0; padding-top: 20px; border-top: 1px solid #EAE6DF;">
        <p style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #8A8580; margin: 0 0 12px 0;">
          Partnership Inclusions
        </p>
        <p style="font-size: 13.5px; line-height: 1.8; color: #3A3835; margin: 0;">
          &bull; Early access to clinical whitepapers and stability documentation.<br/>
          &bull; Panel sample allocations for in-clinic trial evaluation.<br/>
          &bull; Co-authoring opportunities on tropical formulation efficacy studies.
        </p>
      </div>
    `;
  }
  // 4. PRIVATE SHOPPER / CONSUMER (DEFAULT)
  else {
    subject = `Welcome to Desla, ${firstName} - your reservation is confirmed`;
    roleTitle = 'Founding Member';

    let concernCopy = '';
    const safeConcern = data.skinConcern ? escapeHtml(data.skinConcern) : '';

    if (safeConcern.toLowerCase().includes('hyperpigmentation') || safeConcern.toLowerCase().includes('brightening')) {
      concernCopy = `You noted a priority interest in ${safeConcern}. Our core focus centers on balancing melanin production at the cellular source without harsh bleaching agents or barrier compromise.`;
    } else if (safeConcern.toLowerCase().includes('aging') || safeConcern.toLowerCase().includes('firming')) {
      concernCopy = `You noted a priority interest in ${safeConcern}. Our formulations integrate multi-peptide signaling and biomimetic squalane to support natural elasticity under UV and tropical heat.`;
    } else if (safeConcern.toLowerCase().includes('acne') || safeConcern.toLowerCase().includes('texture') || safeConcern.toLowerCase().includes('pore')) {
      concernCopy = `You noted a priority interest in ${safeConcern}. We pair micro-dosed liposomal salicylic acid with high-purity niacinamide to refine texture while keeping your moisture barrier intact.`;
    } else if (safeConcern) {
      concernCopy = `You noted a priority interest in ${safeConcern}. Our barrier formulations focus on bio-identical ceramides 1, 3, and 6-II to restore hydration and eliminate trans-epidermal water loss.`;
    } else {
      concernCopy = `Our barrier formulations focus on bio-identical ceramides 1, 3, and 6-II to restore deep hydration and eliminate trans-epidermal water loss.`;
    }

    mainBodyText = `Thank you for joining the Desla waitlist. ${concernCopy}`;

    privilegesList = `
      <div style="margin: 28px 0; padding-top: 20px; border-top: 1px solid #EAE6DF;">
        <p style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #8A8580; margin: 0 0 12px 0;">
          Founding Member Access
        </p>
        <p style="font-size: 13.5px; line-height: 1.8; color: #3A3835; margin: 0;">
          &bull; 20% private courtesy allocation on your initial collection.<br/>
          &bull; Complimentary 15ml sensory discovery specimen with your first order.<br/>
          &bull; 48-hour priority window before public batch release.<br/>
          &bull; Direct invitation to private clinical skin telemetry tools.
        </p>
      </div>
    `;
  }

  // Pure Minimalist Luxury HTML (Attachment-free for highest deliverability)
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111112; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F5; padding: 48px 16px;">
    <tr>
      <td align="center">
        <!-- Main Minimalist Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #EAE6DF; border-radius: 4px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);">
          
          <!-- Real Desla Brand Logo -->
          <tr>
            <td style="padding: 44px 44px 28px 44px; text-align: left; border-bottom: 1px solid #F0ECE4;">
              <a href="https://desla.beauty" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoSrc}" width="160" style="width: 160px; max-width: 160px; height: auto; display: block; border: 0; outline: none;" alt="Desla" />
              </a>
              <div style="font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #9E9992; margin-top: 14px;">
                Health before Beauty
              </div>
            </td>
          </tr>

          <!-- Editorial Body -->
          <tr>
            <td style="padding: 40px 44px 36px 44px; text-align: left;">
              
              <!-- Clean Role Subheading (No clunky background badges) -->
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #B89248; margin-bottom: 14px;">
                ${roleTitle}
              </div>

              <!-- Greeting -->
              <h1 style="margin: 0 0 18px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 21px; font-weight: 600; line-height: 1.35; color: #111112; letter-spacing: -0.01em;">
                Hello ${firstName},
              </h1>

              <!-- Core Human Message -->
              <p style="font-size: 14px; line-height: 1.75; color: #44413E; margin: 0 0 24px 0;">
                ${mainBodyText}
              </p>

              <!-- Reservation Details: Clean, quiet, and typographic (No green radio dots or AI pills) -->
              <div style="margin: 28px 0; padding: 20px 24px; background-color: #FAF8F5; border: 1px solid #EAE6DF; border-radius: 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align: top;">
                      <span style="font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8A8580; display: block; margin-bottom: 4px;">
                        Queue Position
                      </span>
                      <span style="font-size: 22px; font-weight: 700; color: #111112; font-family: -apple-system, sans-serif;">
                        #${data.queueNumber}
                      </span>
                    </td>
                    <td align="right" style="vertical-align: top;">
                      <span style="font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8A8580; display: block; margin-bottom: 4px;">
                        Member Code
                      </span>
                      <span style="font-size: 13px; font-weight: 600; color: #111112; font-family: ui-monospace, Menlo, Consolas, monospace;">
                        ${escapeHtml(data.referralCode)}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Privileges / Inclusions -->
              ${privilegesList}

              <!-- Direct Link -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #EAE6DF;">
                <p style="font-size: 12.5px; line-height: 1.6; color: #7A7672; margin: 0 0 16px 0;">
                  You can view your live queue position or share your personal invite link at any time:
                </p>
                <a href="${referralUrl}" target="_blank" style="display: inline-block; background-color: #111112; color: #FFFFFF; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; padding: 12px 26px; border-radius: 3px;">
                  View Waitlist Status &rarr;
                </a>
              </div>

              <!-- Signoff -->
              <div style="margin-top: 36px; padding-top: 20px;">
                <p style="font-size: 13px; line-height: 1.6; color: #55524E; margin: 0;">
                  Warmly,<br/>
                  <strong style="color: #111112; font-weight: 600;">Desla</strong>
                </p>
              </div>

            </td>
          </tr>

          <!-- Minimal Footer -->
          <tr>
            <td style="padding: 24px 44px 32px 44px; text-align: left; border-top: 1px solid #F0ECE4;">
              <p style="margin: 0; font-size: 11px; color: #9E9992; line-height: 1.6;">
                You are receiving this notification because you reserved a spot on the Desla waitlist.<br/>
                &copy; ${new Date().getFullYear()} Desla. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `
DESLA
Health before Beauty
====================

Hello ${firstName},

${mainBodyText}

Queue Position: #${data.queueNumber}
Member Code: ${data.referralCode}
Status: Confirmed

Waitlist Link: ${referralUrl}

Warmly,
Desla
  `.trim();

  return { subject, html, text };
}

// Generate luxury minimalist HTML template for custom admin broadcasts / announcements
export function generateBroadcastHtml(data: EmailTemplatePayload): { subject: string; html: string; text: string } {
  const safeFullName = escapeHtml(data.fullName);
  const firstName = escapeHtml(data.fullName.split(' ')[0] || data.fullName);
  const subject = data.customSubject || 'An Exclusive Announcement from Desla';
  const headline = escapeHtml(data.customHeadline || 'ANNOUNCEMENT');
  const referralUrl = `https://desla.beauty/waitlist?ref=${encodeURIComponent(data.referralCode || '')}`;
  const logoSrc = getLogoDataUri();

  const rawBody = data.messageBody || '';
  const bodyParagraphs = rawBody
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.75; color: #44413E;">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const ctaButton = data.callToActionText && data.callToActionUrl ? `
    <div style="margin: 28px 0 20px 0;">
      <a href="${escapeHtml(data.callToActionUrl)}" target="_blank" style="display: inline-block; background-color: #111112; color: #FFFFFF; padding: 12px 28px; border-radius: 3px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;">
        ${escapeHtml(data.callToActionText)} &rarr;
      </a>
    </div>
  ` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111112; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F5; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #EAE6DF; border-radius: 4px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);">
          
          <!-- Real Desla Brand Logo -->
          <tr>
            <td style="padding: 44px 44px 28px 44px; text-align: left; border-bottom: 1px solid #F0ECE4;">
              <a href="https://desla.beauty" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoSrc}" width="160" style="width: 160px; max-width: 160px; height: auto; display: block; border: 0; outline: none;" alt="Desla" />
              </a>
              <div style="font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #9E9992; margin-top: 14px;">
                Health before Beauty
              </div>
            </td>
          </tr>

          <!-- Announcement Content -->
          <tr>
            <td style="padding: 40px 44px 36px 44px; text-align: left;">
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #B89248; margin-bottom: 14px;">
                ${headline}
              </div>
              <h1 style="margin: 0 0 20px 0; font-size: 21px; line-height: 1.35; font-weight: 600; color: #111112;">
                ${escapeHtml(subject)}
              </h1>
              
              ${bodyParagraphs}
              ${ctaButton}

              <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #EAE6DF;">
                <p style="font-size: 13px; line-height: 1.6; color: #55524E; margin: 0;">
                  Warmly,<br/>
                  <strong style="color: #111112; font-weight: 600;">Desla</strong>
                </p>
              </div>
            </td>
          </tr>

          <!-- Minimal Footer -->
          <tr>
            <td style="padding: 24px 44px 32px 44px; text-align: left; border-top: 1px solid #F0ECE4;">
              <p style="margin: 0; font-size: 11px; color: #9E9992; line-height: 1.6;">
                You are receiving this announcement as a confirmed Desla member.<br/>
                &copy; ${new Date().getFullYear()} Desla. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `
DESLA
Health before Beauty
====================

${subject}

${rawBody}

Warmly,
Desla
  `.trim();

  return { subject, html, text };
}

// Reloads runtime environment from .env.local if present
function reloadEnvFromDisk() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          process.env[key] = val;
        }
      }
    }
  } catch (err) {
    // Non-blocking
  }
}

// Retrieves SendGrid API key if configured
export function getSendgridApiKey(): string | null {
  reloadEnvFromDisk();
  const key = process.env.SENDGRID_API_KEY || (process.env.SMTP_PASS?.startsWith('SG.') ? process.env.SMTP_PASS : null);
  if (key && key.trim()) {
    return key.trim();
  }
  return null;
}

// Retrieves safe sender object for SendGrid
export function getSendgridSender(): { name: string; email: string } {
  const customEmail = process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER || 'elanwadebrook@gmail.com';
  const customName = process.env.SENDGRID_FROM_NAME || 'Desla Official';
  return { name: customName, email: customEmail };
}

// Retrieves Brevo (Sendinblue) API key if configured
export function getBrevoApiKey(): string | null {
  reloadEnvFromDisk();
  const key = process.env.BREVO_API_KEY || (process.env.SMTP_PASS?.startsWith('xkeysib-') ? process.env.SMTP_PASS : null);
  if (key && key.trim()) {
    return key.trim();
  }
  return null;
}

// Retrieves safe sender object for Brevo
export function getBrevoSender(): { name: string; email: string } {
  const customEmail = process.env.BREVO_FROM_EMAIL || process.env.SMTP_USER || 'elanwadebrook@gmail.com';
  const customName = process.env.BREVO_FROM_NAME || 'Desla Official';
  return { name: customName, email: customEmail };
}

// Retrieves Resend API key if configured
export function getResendApiKey(): string | null {
  reloadEnvFromDisk();
  const key = process.env.RESEND_API_KEY || (process.env.SMTP_PASS?.startsWith('re_') ? process.env.SMTP_PASS : null);
  if (key && key.trim().startsWith('re_')) {
    return key.trim();
  }
  return null;
}

// Retrieves safe sender address for Resend
export function getResendFrom(): string {
  const custom = process.env.RESEND_FROM || process.env.SMTP_FROM;
  if (custom && !custom.includes('@gmail.com') && !custom.includes('@yahoo.com') && !custom.includes('@hotmail.com')) {
    return custom;
  }
  return 'Desla Official <onboarding@resend.dev>';
}

// Checks if live email dispatch credentials (SendGrid, Brevo, Resend, or SMTP) are fully provided
export function isSmtpConfigured(): boolean {
  reloadEnvFromDisk();
  if (getSendgridApiKey() || getBrevoApiKey() || getResendApiKey()) {
    return true;
  }
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '') || '';
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    pass &&
    !pass.includes('your_api_key_here') &&
    !pass.includes('your_16_character_app_password') &&
    !pass.includes('your_resend_api_key')
  );
}

// Builds or retrieves cached nodemailer transport instance
export function getMailTransport() {
  reloadEnvFromDisk();
  if (getSendgridApiKey() || getBrevoApiKey() || getResendApiKey()) {
    return null; // Cloud APIs use direct HTTPS Port 443 fetch
  }
  if (!isSmtpConfigured()) {
    return null;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
  });
}

// Verifies email credentials (SendGrid, Brevo, Resend HTTPS API, or SMTP handshake)
export async function verifySmtpConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  message: string;
  host?: string;
  port?: number;
}> {
  const sendgridKey = getSendgridApiKey();
  if (sendgridKey) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/scopes', {
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
        },
      });
      if (res.ok) {
        return {
          configured: true,
          connected: true,
          message: 'SendGrid API authenticated successfully over HTTPS (Port 443 — cloud compliant).',
          host: 'api.sendgrid.com',
          port: 443,
        };
      }
      return {
        configured: true,
        connected: false,
        message: `SendGrid API authentication failed with status ${res.status}.`,
        host: 'api.sendgrid.com',
        port: 443,
      };
    } catch (err: unknown) {
      return {
        configured: true,
        connected: false,
        message: `Network error reaching SendGrid: ${err instanceof Error ? err.message : String(err)}`,
        host: 'api.sendgrid.com',
        port: 443,
      };
    }
  }

  const brevoKey = getBrevoApiKey();
  if (brevoKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/account', {
        headers: {
          'api-key': brevoKey,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        return {
          configured: true,
          connected: true,
          message: 'Brevo API authenticated successfully over HTTPS (Port 443 — cloud compliant).',
          host: 'api.brevo.com',
          port: 443,
        };
      }
      const data = await res.json().catch(() => ({}));
      return {
        configured: true,
        connected: false,
        message: `Brevo API authentication failed: ${data.message || res.statusText}`,
        host: 'api.brevo.com',
        port: 443,
      };
    } catch (err: unknown) {
      return {
        configured: true,
        connected: false,
        message: `Network error reaching Brevo: ${err instanceof Error ? err.message : String(err)}`,
        host: 'api.brevo.com',
        port: 443,
      };
    }
  }

  const resendKey = getResendApiKey();
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/api-keys', {
        headers: { Authorization: `Bearer ${resendKey}` },
      });
      if (res.ok) {
        return {
          configured: true,
          connected: true,
          message: 'Resend API authenticated successfully over HTTPS (Port 443 — cloud compliant).',
          host: 'api.resend.com',
          port: 443,
        };
      }
      const data = await res.json().catch(() => ({}));
      return {
        configured: true,
        connected: false,
        message: `Resend API authentication failed: ${data.message || res.statusText}`,
        host: 'api.resend.com',
        port: 443,
      };
    } catch (err: unknown) {
      return {
        configured: true,
        connected: false,
        message: `Network error reaching Resend: ${err instanceof Error ? err.message : String(err)}`,
        host: 'api.resend.com',
        port: 443,
      };
    }
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;

  if (!isSmtpConfigured()) {
    return {
      configured: false,
      connected: false,
      message: 'Email service is running in local simulation/file-log mode. Add your RESEND_API_KEY or SMTP credentials to enable live sending.',
      host,
      port,
    };
  }

  try {
    const transporter = getMailTransport();
    if (!transporter) {
      throw new Error('Could not initialize mail transporter.');
    }
    await transporter.verify();
    return {
      configured: true,
      connected: true,
      message: `SMTP connection verified successfully with ${host} mail servers.`,
      host,
      port,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[SMTP Verification] Error connecting to mail host:', errorMsg);
    return {
      configured: true,
      connected: false,
      message: `SMTP configuration present, but connection failed: ${errorMsg}`,
      host,
      port,
    };
  }
}

// Dispatches an email for an enqueued job
export async function sendEmailForJob(payload: EmailTemplatePayload & { jobId: string }): Promise<{
  success: boolean;
  messageId: string;
  previewFile?: string;
  simulated?: boolean;
}> {
  ensureEmailDir();
  const isBroadcast = payload.templateType === 'broadcast';
  const { subject, html, text } = isBroadcast
    ? generateBroadcastHtml(payload)
    : generateEmailHtml(payload);
  
  // Persist visual HTML preview with embedded base64 logo for immediate local inspection
  const prefix = isBroadcast ? 'broadcast' : 'waitlist';
  const fileName = `${prefix}-${payload.jobId}-${Date.now()}.html`;
  const filePath = path.join(getEmailsOutputDir(), fileName);
  try {
    fs.writeFileSync(filePath, html, 'utf-8');
  } catch (writeErr) {
    console.warn('[Email Service] Could not write email preview file to disk:', writeErr);
  }

  const sendgridKey = getSendgridApiKey();
  if (sendgridKey) {
    try {
      const sender = getSendgridSender();
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: payload.email, name: payload.fullName }],
            },
          ],
          from: sender,
          subject,
          content: [
            { type: 'text/plain', value: text },
            { type: 'text/html', value: html },
          ],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(`SendGrid API error (${res.status}): ${JSON.stringify(data)}`);
      }

      console.log(`[Email Dispatcher] Delivered via SendGrid HTTPS (Port 443) to: ${payload.email}`);
      return {
        success: true,
        messageId: `sendgrid-${Date.now()}`,
        previewFile: filePath,
        simulated: false,
      };
    } catch (sgErr: unknown) {
      console.error(`[Email Dispatcher] SendGrid HTTPS delivery failed for ${payload.email}:`, sgErr);
      throw sgErr;
    }
  }

  const brevoKey = getBrevoApiKey();
  if (brevoKey) {
    try {
      const sender = getBrevoSender();
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender,
          to: [
            {
              email: payload.email,
              name: payload.fullName,
            },
          ],
          subject,
          htmlContent: html,
          textContent: text,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(`Brevo API error (${res.status}): ${data.message || JSON.stringify(data)}`);
      }

      console.log(`[Email Dispatcher] Delivered via Brevo HTTPS (Port 443) to: ${payload.email} (Message ID: ${data.messageId})`);
      return {
        success: true,
        messageId: data.messageId || `brevo-${Date.now()}`,
        previewFile: filePath,
        simulated: false,
      };
    } catch (brevoErr: unknown) {
      console.error(`[Email Dispatcher] Brevo HTTPS delivery failed for ${payload.email}:`, brevoErr);
      throw brevoErr;
    }
  }

  const resendKey = getResendApiKey();
  if (resendKey) {
    try {
      const from = getResendFrom();
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [payload.email],
          subject,
          html,
          text,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(`Resend API error (${res.status}): ${data.message || JSON.stringify(data)}`);
      }

      console.log(`[Email Dispatcher] Delivered via Resend HTTPS (Port 443) to: ${payload.email} (Message ID: ${data.id})`);
      return {
        success: true,
        messageId: data.id,
        previewFile: filePath,
        simulated: false,
      };
    } catch (resendErr: unknown) {
      console.error(`[Email Dispatcher] Resend HTTPS delivery failed for ${payload.email}:`, resendErr);
      throw resendErr;
    }
  }

  const transporter = getMailTransport();
  const fromAddress = process.env.SMTP_FROM || '"Desla Official" <onboarding@resend.dev>';
  const logoPath = path.join(process.cwd(), 'public', 'desla-logo.png');
  const hasLogo = fs.existsSync(logoPath);
  const logoDataUri = getLogoDataUri();

  if (transporter) {
    const userEmail = process.env.SMTP_USER || 'elanwadebrook@gmail.com';
    const fromAddress = process.env.SMTP_FROM || `Desla Official <${userEmail}>`;

    // For SMTP transmission, swap base64 with cid:deslalogo for native inline rendering in Gmail & Outlook
    const htmlForSmtp = hasLogo && logoDataUri.startsWith('data:')
      ? html.replace(logoDataUri, 'cid:deslalogo')
      : html;

    const mailOptions: any = {
      from: fromAddress,
      replyTo: fromAddress,
      to: `${payload.fullName} <${payload.email}>`,
      envelope: {
        from: userEmail,
        to: payload.email,
      },
      subject,
      text,
      html: htmlForSmtp,
      headers: {
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'Auto-Submitted': 'auto-generated',
        'List-Unsubscribe': `<mailto:${userEmail}?subject=Unsubscribe>`,
        'X-Entity-Ref-ID': payload.jobId,
      },
    };

    if (hasLogo && htmlForSmtp.includes('cid:deslalogo')) {
      mailOptions.attachments = [
        {
          filename: 'desla-logo.png',
          path: logoPath,
          cid: 'deslalogo',
          contentType: 'image/png',
          contentDisposition: 'inline',
        },
      ];
    }

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Dispatcher] Real email delivered strictly to recipient: ${payload.email} (Message ID: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
        previewFile: filePath,
        simulated: false,
      };
    } catch (smtpErr: unknown) {
      const errStr = String(smtpErr);
      console.error(`[Email Dispatcher] SMTP delivery failed for ${payload.email}:`, errStr);
      throw smtpErr;
    }
  } else {
    // Development fallback
    console.log(`\n======================================================`);
    console.log(`[DESLA AUTOMATED NEWSLETTER DISPATCH]`);
    console.log(`From: ${fromAddress}`);
    console.log(`To: ${payload.fullName} <${payload.email}>`);
    console.log(`Role: ${payload.role.toUpperCase()}`);
    console.log(`Subject: ${subject}`);
    console.log(`Queue #: ${payload.queueNumber}`);
    console.log(`Preview saved to: ${filePath}`);
    console.log(`======================================================\n`);

    return {
      success: true,
      messageId: `simulated-${payload.jobId}`,
      previewFile: filePath,
      simulated: true,
    };
  }
}

// Persists a new Resend API key to .env.local and reloads configuration
export function saveResendApiKey(newApiKey: string, customFrom?: string): { success: boolean; message: string } {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    let content = '';
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf-8');
    }

    const lines = content.split('\n');
    let foundSmtpPass = false;
    let foundResendKey = false;

    const newLines = lines.map((line) => {
      if (line.startsWith('SMTP_PASS=')) {
        foundSmtpPass = true;
        return `SMTP_PASS=${newApiKey}`;
      }
      if (line.startsWith('RESEND_API_KEY=')) {
        foundResendKey = true;
        return `RESEND_API_KEY=${newApiKey}`;
      }
      return line;
    });

    if (!foundSmtpPass) {
      newLines.push(`SMTP_PASS=${newApiKey}`);
    }
    if (!foundResendKey) {
      newLines.push(`RESEND_API_KEY=${newApiKey}`);
    }

    if (customFrom && customFrom.trim()) {
      let foundFrom = false;
      for (let i = 0; i < newLines.length; i++) {
        if (newLines[i].startsWith('SMTP_FROM=')) {
          newLines[i] = `SMTP_FROM=${customFrom.trim()}`;
          foundFrom = true;
          break;
        }
      }
      if (!foundFrom) {
        newLines.push(`SMTP_FROM=${customFrom.trim()}`);
      }
      process.env.SMTP_FROM = customFrom.trim();
    }

    fs.writeFileSync(envPath, newLines.join('\n'), 'utf-8');
    process.env.SMTP_PASS = newApiKey;
    process.env.RESEND_API_KEY = newApiKey;

    return {
      success: true,
      message: 'Resend API key securely persisted to .env.local and active in memory.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Failed to save API key to disk: ${errorMsg}`,
    };
  }
}

// Dispatches a live test email from Admin Console
export async function sendTestEmail(recipientEmail: string): Promise<{ success: boolean; messageId: string }> {
  const result = await sendEmailForJob({
    fullName: 'Admin Tester',
    email: recipientEmail,
    role: 'shopper',
    queueNumber: 1421,
    referralCode: 'DLS-TEST',
    city: 'Lagos',
    skinConcern: 'Melanin Barrier & Daily Ritual',
    jobId: `test_${Date.now()}`,
  });

  return {
    success: result.success,
    messageId: result.messageId,
  };
}
