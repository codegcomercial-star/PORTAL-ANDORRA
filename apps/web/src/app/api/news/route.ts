import { NextRequest, NextResponse } from 'next/server';

// Redirect to new news API endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build new URL with same parameters
    const newUrl = new URL('/api/news/latest', request.url);
    for (const [key, value] of searchParams) {
      newUrl.searchParams.set(key, value);
    }

    // Redirect to new endpoint
    return NextResponse.redirect(newUrl, 301);

  } catch (error) {
    console.error('News API redirect error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        articles: [],
        total: 0,
        categories: [],
        lastUpdated: new Date().toISOString(),
        error: 'Failed to redirect to news endpoint' 
      },
      { status: 500 }
    );
  }
}
