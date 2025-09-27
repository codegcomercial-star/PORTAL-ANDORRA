import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/lib/news';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category') || undefined;
    const language = searchParams.get('language') || undefined;
    const search = searchParams.get('search') || undefined;

    const news = await newsService.getNews({
      limit,
      offset,
      category,
      language,
      search,
    });

    return NextResponse.json({
      success: true,
      news,
      pagination: {
        limit,
        offset,
        hasMore: news.length === limit,
      },
    });

  } catch (error) {
    console.error('News API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Manual news ingestion trigger
    const result = await newsService.ingestAllFeeds();
    
    return NextResponse.json({
      success: true,
      message: 'News ingestion completed',
      result,
    });

  } catch (error) {
    console.error('News ingestion error:', error);
    
    return NextResponse.json(
      { error: 'News ingestion failed' },
      { status: 500 }
    );
  }
}
