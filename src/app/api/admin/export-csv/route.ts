import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminRequest } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

function escapeCsvField(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return '"' + str + '"';
}

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const db = getDb();

    // Deduplicated waitlist query: joins only the latest email job per member
    const records = db.prepare(`
      SELECT 
        w.queue_number,
        w.full_name,
        w.email,
        w.role,
        w.city,
        w.skin_concern,
        w.creator_handle,
        w.creator_platform,
        w.distributor_business,
        w.distributor_volume,
        w.partner_organization,
        w.partner_focus,
        w.referral_code,
        w.status as member_status,
        w.created_at,
        ej.status as email_status,
        ej.sent_at as email_sent_at,
        ej.last_error as email_error
      FROM waitlist w
      LEFT JOIN (
        SELECT 
          waitlist_id,
          status,
          attempts,
          sent_at,
          last_error,
          ROW_NUMBER() OVER (PARTITION BY waitlist_id ORDER BY created_at DESC) as rn
        FROM email_jobs
      ) ej ON w.id = ej.waitlist_id AND ej.rn = 1
      ORDER BY w.queue_number ASC
    `).all() as any[];

    const headers = [
      'Queue #',
      'Full Name',
      'Email Address',
      'Role',
      'City / Region',
      'Skin Concern',
      'Creator Handle / Platform',
      'Distributor Business / Volume',
      'Partner Organization / Focus',
      'Referral Code',
      'Referral Link',
      'Waitlist Status',
      'Email Delivery Status',
      'Email Sent At',
      'Joined Date (UTC)'
    ];

    const rows = records.map((r) => {
      const creatorInfo = r.creator_handle ? (r.creator_handle + ' (' + (r.creator_platform || 'Instagram') + ')') : '';
      const distInfo = r.distributor_business ? (r.distributor_business + ' [Vol: ' + (r.distributor_volume || 'Retail') + ']') : '';
      const partnerInfo = r.partner_organization ? (r.partner_organization + ' [' + (r.partner_focus || 'Clinical') + ']') : '';
      const referralUrl = 'https://delsla.com/waitlist?ref=' + (r.referral_code || '');

      return [
        r.queue_number,
        r.full_name,
        r.email,
        r.role ? r.role.toUpperCase() : 'SHOPPER',
        r.city || 'Lagos',
        r.skin_concern || '',
        creatorInfo,
        distInfo,
        partnerInfo,
        r.referral_code || '',
        referralUrl,
        r.member_status || 'confirmed',
        r.email_status || 'pending',
        r.email_sent_at || '',
        r.created_at || ''
      ].map(escapeCsvField).join(',');
    });

    // Prepend UTF-8 BOM so Microsoft Excel opens special characters correctly
    const csvContent = '\uFEFF' + [headers.map(escapeCsvField).join(','), ...rows].join('\r\n');

    const today = new Date().toISOString().split('T')[0];
    const filename = 'desla-waitlist-export-' + today + '.csv';

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: unknown) {
    console.error('[API /api/admin/export-csv] Error generating CSV:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSV export' },
      { status: 500 }
    );
  }
}
