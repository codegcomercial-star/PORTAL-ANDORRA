import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Mock BOPA bulletins
  const mockBulletins = {
    data: [
      {
        id: '1',
        number: '64',
        year: 2024,
        publishedAt: '2024-09-20T00:00:00Z',
        title: 'BOPA núm. 64 del 20 de setembre de 2024',
        url: 'https://www.bopa.ad/bopa/064024/Pagines/default.aspx',
        summary: 'Disposicions relatives a la modificació del reglament de...',
        documentsCount: 12,
      },
      {
        id: '2',
        number: '63',
        year: 2024,
        publishedAt: '2024-09-18T00:00:00Z',
        title: 'BOPA núm. 63 del 18 de setembre de 2024',
        url: 'https://www.bopa.ad/bopa/063024/Pagines/default.aspx',
        summary: 'Convocatòria de concurs públic per a la contractació de...',
        documentsCount: 8,
      },
    ],
    total: 1250,
    page: 1,
    limit: 10,
  };

  return NextResponse.json(mockBulletins);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Mock ingestion endpoint (admin only)
  return NextResponse.json({
    success: true,
    message: 'Ingestió BOPA iniciada',
    jobId: 'bopa-ingest-' + Date.now(),
  });
}