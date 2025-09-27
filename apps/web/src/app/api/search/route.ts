import { NextRequest, NextResponse } from 'next/server';
import { universalSearchService } from '@/lib/search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const types = searchParams.get('types')?.split(',') as any[] || undefined;
    const sources = searchParams.get('sources')?.split(',') || undefined;
    const sortBy = searchParams.get('sortBy') as any || 'relevance';
    const sortOrder = searchParams.get('sortOrder') as any || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Parse date filters
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    if (query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Perform universal search
    const searchResult = await universalSearchService.search({
      query,
      types,
      sources,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      query,
      ...searchResult,
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST endpoint for advanced search with complex filters
export async function POST(request: NextRequest) {
  try {
    const searchQuery = await request.json();
    
    if (!searchQuery.query?.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Perform universal search with advanced filters
    const searchResult = await universalSearchService.search(searchQuery);

    return NextResponse.json({
      success: true,
      ...searchResult,
    });

  } catch (error) {
    console.error('Advanced search API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Advanced search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
