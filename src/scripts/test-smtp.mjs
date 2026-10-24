import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const envPath = path.join(rootDir, '.env.local');

// Parse .env.local manually if dotenv is not loaded
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
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
}

const targetEmail = process.argv[2] || 'test@example.com';

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.SMTP_PORT || '465', 10);
const user = process.env.SMTP_USER || 'elanwadebrook@gmail.com';
const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
const from = process.env.SMTP_FROM || '"Desla Official" <elanwadebrook@gmail.com>';

console.log(`\n======================================================`);
console.log(`[DELSLA PRODUCTION SMTP DIAGNOSTIC CLI]`);
console.log(`Host: ${host}:${port}`);
console.log(`User: ${user}`);
console.log(`From: ${from}`);
console.log(`Target: ${targetEmail}`);
console.log(`======================================================\n`);

if (!pass || pass.includes('your_')) {
  console.log(`⚠ WARNING: SMTP_PASS is still set to placeholder in .env.local.`);
  console.log(`Please configure valid SMTP credentials in .env.local.\n`);
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

async function main() {
  console.log(`Attempting SMTP handshake and authentication with ${host}...`);
  try {
    await transporter.verify();
    console.log(`✔ Connection verified successfully!\n`);

    if (process.argv[2]) {
      console.log(`Sending live test transmission to ${targetEmail}...`);
      const info = await transporter.sendMail({
        from,
        replyTo: from,
        to: targetEmail,
        envelope: {
          from: user,
          to: targetEmail,
        },
        subject: 'Welcome to Desla - your reservation is confirmed',
        text: 'Hello, thank you for joining Desla. Your reservation is confirmed. Warmly, Desla.',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #eae6df; border-radius: 4px;">
            <img src="cid:deslalogo" width="160" style="width: 160px; max-width: 160px; height: auto; display: block; border: 0;" alt="Desla" />
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #9e9992; margin-top: 12px; margin-bottom: 24px;">Health before Beauty</div>
            <p style="font-size: 15px; color: #333; line-height: 1.6;">Hello,</p>
            <p style="font-size: 15px; color: #333; line-height: 1.6;">Thank you for joining the Desla waitlist. Your VIP reservation is confirmed.</p>
            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Desla Official. All rights reserved.
            </div>
          </div>
        `,
        attachments: [
          {
            filename: 'desla-logo.png',
            path: path.join(rootDir, 'public', 'desla-logo.png'),
            cid: 'deslalogo',
            contentType: 'image/png',
            contentDisposition: 'inline',
          },
        ],
        headers: {
          'X-Auto-Response-Suppress': 'OOF, AutoReply',
          'Auto-Submitted': 'auto-generated',
        },
      });
      console.log(`✔ Dispatched! Message ID: ${info.messageId}`);
    } else {
      console.log(`Tip: Pass your email to send a test message: node src/scripts/test-smtp.mjs your@email.com`);
    }
  } catch (err) {
    console.error(`✖ SMTP Connection failed:`, err.message);
  }
}

main();
