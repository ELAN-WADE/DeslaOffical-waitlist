import { NextResponse } from 'next/server';
import { getAdminPassword, generateSessionToken, isValidAdminToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/desla_admin_auth=([^;]+)/);
    const isAuthenticated = Boolean(match && match[1] && isValidAdminToken(match[1]));

    return NextResponse.json({
      authenticated: isAuthenticated,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Logout action
    if (body.action === 'logout') {
      const response = NextResponse.json({
        success: true,
        authenticated: false,
        message: 'Admin session closed.',
      });
      response.cookies.delete('desla_admin_auth');
      return response;
    }

    const { password } = body;
    const expectedPassword = getAdminPassword();

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password.trim() !== expectedPassword.trim()) {
      return NextResponse.json(
        { success: false, error: 'Incorrect authorization passcode. Access denied.' },
        { status: 401 }
      );
    }

    const token = generateSessionToken(expectedPassword);
    const response = NextResponse.json({
      success: true,
      authenticated: true,
      message: 'Access granted. Welcome, Elan.',
    });

    response.cookies.set('desla_admin_auth', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days session
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('[Admin Auth API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}
