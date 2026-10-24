import { NextResponse } from 'next/server';
import { processEmailJobs } from '@/lib/worker';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    const result = await processEmailJobs(limit);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error: unknown) {
    console.error('[API /api/worker/process-emails] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown worker error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
