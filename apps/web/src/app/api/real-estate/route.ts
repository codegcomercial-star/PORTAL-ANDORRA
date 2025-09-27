import { NextRequest, NextResponse } from 'next/server';
import { realEstateService } from '@/lib/real-estate';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const text = searchParams.get('search') || undefined;
    const type = searchParams.get('type')?.split(',') as any[] || undefined;
    const operation = searchParams.get('operation') as any || undefined;
    const parish = searchParams.get('parish')?.split(',') as any[] || undefined;
    const priceMin = searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined;
    const surfaceMin = searchParams.get('surfaceMin') ? parseInt(searchParams.get('surfaceMin')!) : undefined;
    const surfaceMax = searchParams.get('surfaceMax') ? parseInt(searchParams.get('surfaceMax')!) : undefined;
    const bedrooms = searchParams.get('bedrooms')?.split(',').map(Number) || undefined;
    const bathrooms = searchParams.get('bathrooms')?.split(',').map(Number) || undefined;
    const features = searchParams.get('features')?.split(',') || undefined;
    const sortBy = searchParams.get('sortBy') as any || 'date';
    const sortOrder = searchParams.get('sortOrder') as any || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const properties = await realEstateService.searchProperties({
      text,
      type,
      operation,
      parish,
      priceMin,
      priceMax,
      surfaceMin,
      surfaceMax,
      bedrooms,
      bathrooms,
      features,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      properties,
      pagination: {
        limit,
        offset,
        hasMore: properties.length === limit,
      },
    });

  } catch (error) {
    console.error('Real Estate API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Manual real estate scraping trigger
    const result = await realEstateService.scrapeAllSources();
    
    return NextResponse.json({
      success: true,
      message: 'Real estate scraping completed',
      result,
    });

  } catch (error) {
    console.error('Real estate scraping error:', error);
    
    return NextResponse.json(
      { error: 'Real estate scraping failed' },
      { status: 500 }
    );
  }
}