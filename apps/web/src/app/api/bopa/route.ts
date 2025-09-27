import { NextRequest, NextResponse } from 'next/server';

// Simple BOPA API for demo purposes
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Mock BOPA data
  const mockBulletins = [
    {
      id: '1',
      number: '64',
      year: 2024,
      publishedAt: '2024-09-20T00:00:00Z',
      title: 'BOPA núm. 64 del 20 de septiembre de 2024',
      url: 'https://www.bopa.ad/bopa/064024/Pagines/default.aspx',
      summary: 'Disposicions relatives a la modificació del reglament de...',
      documentsCount: 12,
    },
    {
      id: '2',
      number: '63',
      year: 2024,
      publishedAt: '2024-09-18T00:00:00Z',
      title: 'BOPA núm. 63 del 18 de septiembre de 2024',
      url: 'https://www.bopa.ad/bopa/063024/Pagines/default.aspx',
      summary: 'Convocatòria de concurs públic per a la contractació de...',
      documentsCount: 8,
    },
    {
      id: '3',
      number: '62',
      year: 2024,
      publishedAt: '2024-09-16T00:00:00Z',
      title: 'BOPA núm. 62 del 16 de septiembre de 2024',
      url: 'https://www.bopa.ad/bopa/062024/Pagines/default.aspx',
      summary: 'Llei del pressupost de l\'Estat per a l\'exercici 2024...',
      documentsCount: 15,
    },
    {
      id: '4',
      number: '61',
      year: 2024,
      publishedAt: '2024-09-13T00:00:00Z',
      title: 'BOPA núm. 61 del 13 de septiembre de 2024',
      url: 'https://www.bopa.ad/bopa/061024/Pagines/default.aspx',
      summary: 'Reglament de desenvolupament de la Llei...',
      documentsCount: 6,
    },
    {
      id: '5',
      number: '60',
      year: 2024,
      publishedAt: '2024-09-11T00:00:00Z',
      title: 'BOPA núm. 60 del 11 de septiembre de 2024',
      url: 'https://www.bopa.ad/bopa/060024/Pagines/default.aspx',
      summary: 'Decret pel qual s\'aprova el Reglament...',
      documentsCount: 9,
    }
  ];

  // Filter by query if provided
  let filteredBulletins = mockBulletins;
  if (query) {
    filteredBulletins = mockBulletins.filter(bulletin =>
      bulletin.title.toLowerCase().includes(query.toLowerCase()) ||
      bulletin.summary.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBulletins = filteredBulletins.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: paginatedBulletins,
    pagination: {
      page,
      limit,
      total: filteredBulletins.length,
      totalPages: Math.ceil(filteredBulletins.length / limit)
    },
    query
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'subscribe') {
      // Mock subscription response
      return NextResponse.json({
        success: true,
        message: 'Subscripción creada exitosamente',
        data: {
          id: 'mock-subscription-id',
          email: body.email,
          frequency: body.frequency || 'weekly',
          categories: body.categories || ['all']
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('BOPA API error:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}