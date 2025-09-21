import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const semantic = searchParams.get('semantic') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // Mock search results for now
  const mockResults = {
    results: [
      {
        id: '1',
        title: 'Llei 19/2020, del 17 de desembre, de modificació de la Llei general tributària',
        content: 'Aquesta llei modifica diversos aspectes de la tributació a Andorra...',
        url: 'https://www.bopa.ad/bopa/019020/Pagines/LT19-2020.aspx',
        type: 'law',
        score: 0.95,
        publishedAt: '2020-12-17',
      },
      {
        id: '2',
        title: 'BOPA núm. 64 del 17 de desembre de 2020',
        content: 'Butlletí oficial amb les noves disposicions tributàries...',
        url: 'https://www.bopa.ad/bopa/064020/Pagines/default.aspx',
        type: 'bulletin',
        score: 0.87,
        publishedAt: '2020-12-17',
      },
    ],
    total: 2,
    page,
    limit,
    semantic,
    query,
    processingTime: 45,
  };

  return NextResponse.json(mockResults);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query, filters, semantic = false } = body;

  // Mock advanced search
  const mockResults = {
    results: [],
    total: 0,
    query,
    filters,
    semantic,
    processingTime: 23,
  };

  return NextResponse.json(mockResults);
}