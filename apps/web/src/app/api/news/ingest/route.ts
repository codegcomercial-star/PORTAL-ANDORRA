import { NextResponse } from 'next/server';
import { ingestAllNews } from '@/lib/news/news-service';

// Protegido por token simple para uso desde GitHub Actions / Cron
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!process.env.INGEST_TOKEN || token !== process.env.INGEST_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await ingestAllNews();
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}