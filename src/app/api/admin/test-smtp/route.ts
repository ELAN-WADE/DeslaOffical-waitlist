import { NextResponse } from 'next/server';
import { verifySmtpConnection, sendTestEmail, saveResendApiKey, isSmtpConfigured } from '@/lib/email-service';
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
    const status = await verifySmtpConnection();
    return NextResponse.json(status);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        configured: false,
        connected: false,
        message: error instanceof Error ? error.message : 'Unknown error during SMTP handshake',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // 1. Action to save/update Resend API key directly from the Admin UI
    if (body.action === 'save_key') {
      const { apiKey, fromAddress } = body;
      if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid API Key or App Password format.',
          },
          { status: 400 }
        );
      }

      saveResendApiKey(apiKey.trim(), fromAddress);
      const verifyResult = await verifySmtpConnection();

      return NextResponse.json({
        success: verifyResult.connected,
        message: verifyResult.message,
        ...verifyResult,
      });
    }

    // 2. Action to send live test email
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid recipient email address (e.g. yourname@gmail.com).' },
        { status: 400 }
      );
    }

    if (!isSmtpConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'SMTP is not yet configured. Please configure your SMTP credentials in .env.local first.',
        },
        { status: 400 }
      );
    }

    const result = await sendTestEmail(email.trim());
    return NextResponse.json({
      success: true,
      message: `Test transmission successfully delivered to ${email}! (Message ID: ${result.messageId})`,
      messageId: result.messageId,
    });
  } catch (error: unknown) {
    console.error('[API /api/admin/test-smtp] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to dispatch test email',
      },
      { status: 500 }
    );
  }
}
