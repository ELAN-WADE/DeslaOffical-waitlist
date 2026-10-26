// ==============================================================================
// DESLA LUXURY ATELIER — SUPABASE SERVERLESS CLIENT & API ADAPTER
// ==============================================================================
// Zero native C++ dependencies. 100% Edge & Serverless compatible.
// Operates flawlessly in Vercel Lambdas, Supabase Edge, Cloudflare, and local Node.
// ==============================================================================

import type { WaitlistEntry, RoleType } from '@/types';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && url.trim() && key && key.trim());
}

export function getSupabaseCredentials() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  return {
    url,
    serviceKey: serviceKey || anonKey,
    anonKey,
  };
}

/**
 * Execute standard Supabase PostgREST query using Web fetch
 */
export async function supabaseRest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { url, serviceKey } = getSupabaseCredentials();
  if (!url || !serviceKey) {
    throw new Error('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const targetUrl = `${url}/rest/v1/${cleanPath}`;

  const res = await fetch(targetUrl, {
    method: options.method || 'GET',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`[Supabase REST Error ${res.status}] ${errorText}`);
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

/**
 * Execute a Supabase PostgreSQL Stored Procedure (RPC)
 */
export async function supabaseRpc<T>(fnName: string, params: Record<string, any> = {}): Promise<T> {
  return supabaseRest<T>(`rpc/${fnName}`, {
    method: 'POST',
    body: params,
  });
}

// ==============================================================================
// HIGH-LEVEL SERVERLESS OPERATIONS
// ==============================================================================

export interface ReserveSpotParams {
  fullName: string;
  email: string;
  city: string;
  role: RoleType;
  skinConcern?: string;
  creatorHandle?: string;
  creatorPlatform?: string;
  distributorBusiness?: string;
  distributorVolume?: string;
  partnerOrganization?: string;
  partnerFocus?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ReserveSpotResult {
  is_existing: boolean;
  job_id: string;
  entry: WaitlistEntry;
}

/**
 * Reserves a VIP waitlist spot atomically in PostgreSQL.
 * Sequential queue numbers are guaranteed without race conditions.
 */
export async function supabaseReserveWaitlistSpot(params: ReserveSpotParams): Promise<ReserveSpotResult> {
  return supabaseRpc<ReserveSpotResult>('reserve_waitlist_spot', {
    p_full_name: params.fullName,
    p_email: params.email,
    p_city: params.city,
    p_role: params.role,
    p_skin_concern: params.skinConcern || null,
    p_creator_handle: params.creatorHandle || null,
    p_creator_platform: params.creatorPlatform || null,
    p_distributor_business: params.distributorBusiness || null,
    p_distributor_volume: params.distributorVolume || null,
    p_partner_organization: params.partnerOrganization || null,
    p_partner_focus: params.partnerFocus || null,
    p_ip_address: params.ipAddress || null,
    p_user_agent: params.userAgent || null,
  });
}

/**
 * Fetch non-sensitive waitlist statistics
 */
export async function supabaseGetWaitlistStats(): Promise<{
  totalJoined: number;
  displayTotal: number;
  latestQueue: number;
  roles: Array<{ role: string; count: number }>;
}> {
  return supabaseRpc('get_waitlist_stats', {});
}

/**
 * Fetch deduplicated member view for Executive Console
 */
export async function supabaseGetAdminEntries(limit = 100) {
  return supabaseRest<any[]>(`v_waitlist_admin?limit=${limit}`);
}

/**
 * Fetch recent outbox email jobs
 */
export async function supabaseGetRecentJobs(limit = 50) {
  return supabaseRest<any[]>(`email_jobs?order=created_at.desc&limit=${limit}`);
}

/**
 * Fetch aggregate outbox statistics
 */
export async function supabaseGetAdminStats() {
  const [totalRes, pendingRes, sentRes, failedRes] = await Promise.all([
    supabaseRest<any[]>('waitlist?select=id', { headers: { Prefer: 'count=exact' } }).then((r) => r.length),
    supabaseRest<any[]>('email_jobs?status=eq.pending&select=id').then((r) => r.length),
    supabaseRest<any[]>('email_jobs?status=eq.sent&select=id').then((r) => r.length),
    supabaseRest<any[]>('email_jobs?status=eq.failed&select=id').then((r) => r.length),
  ]);

  return {
    totalEntries: totalRes,
    pendingEmails: pendingRes,
    sentEmails: sentRes,
    failedEmails: failedRes,
  };
}

/**
 * Queue a mass announcement broadcast directly inside Postgres
 */
export async function supabaseQueueBroadcast(params: {
  subject: string;
  headline: string;
  messageBody: string;
  targetRole?: string;
  ctaText?: string;
  ctaUrl?: string;
}): Promise<{ success: boolean; queuedCount: number }> {
  return supabaseRpc('queue_broadcast_announcement', {
    p_subject: params.subject,
    p_headline: params.headline,
    p_message_body: params.messageBody,
    p_target_role: params.targetRole || 'all',
    p_cta_text: params.ctaText || null,
    p_cta_url: params.ctaUrl || null,
  });
}

/**
 * Fetch all waitlist entries for Excel / CSV export
 */
export async function supabaseGetExportData(): Promise<any[]> {
  return supabaseRest<any[]>('v_waitlist_admin?order=queue_number.asc');
}

/**
 * Fetch pending email jobs to process
 */
export async function supabaseGetPendingEmailJobs(limit = 10): Promise<any[]> {
  return supabaseRest<any[]>(`email_jobs?status=eq.pending&attempts=lt.3&order=created_at.asc&limit=${limit}`);
}

/**
 * Update an email job status
 */
export async function supabaseUpdateEmailJob(
  jobId: string,
  data: {
    status: 'pending' | 'processing' | 'sent' | 'failed';
    attempts?: number;
    last_error?: string | null;
    sent_at?: string;
  }
) {
  return supabaseRest(`email_jobs?id=eq.${jobId}`, {
    method: 'PATCH',
    body: {
      ...data,
      updated_at: new Date().toISOString(),
    },
  });
}
