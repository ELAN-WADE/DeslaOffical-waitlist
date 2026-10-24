import crypto from 'crypto';
import { cookies } from 'next/headers';

const SALT = 'desla_executive_atelier_salt_2026';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'ElanTheAdmin2026!';
}

export function generateSessionToken(password: string): string {
  return crypto.createHash('sha256').update(password + SALT).digest('hex');
}

export function isValidAdminToken(token: string): boolean {
  if (!token) return false;
  const expected = generateSessionToken(getAdminPassword());
  if (token.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAuthenticatedServer(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('desla_admin_auth')?.value;
    if (!token) return false;
    return isValidAdminToken(token);
  } catch {
    return false;
  }
}

export function verifyAdminRequest(request: Request): boolean {
  // Check cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/desla_admin_auth=([^;]+)/);
  if (match && match[1]) {
    try {
      if (isValidAdminToken(match[1])) return true;
    } catch {
      // Continue to header check
    }
  }

  // Check Authorization header: Bearer <token> or Bearer <password>
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const value = authHeader.slice(7).trim();
    if (value === getAdminPassword()) return true;
    try {
      if (isValidAdminToken(value)) return true;
    } catch {
      return false;
    }
  }

  return false;
}
