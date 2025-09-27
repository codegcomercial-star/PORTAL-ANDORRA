import { NextResponse } from 'next/server';
import { latestNews } from '@/lib/news/news-service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang') || undefined;
  const category = url.searchParams.get('category') || undefined;
  const limit = Number(url.searchParams.get('limit') || '24');
  const news = await latestNews({ lang, category, limit });
  // Devolver solo lo necesario en la UI
  return NextResponse.json({
    news: news.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      url: n.url,
      source: n.source,
      category: n.category,
      language: n.language,
      imageUrl: n.imageUrl,
      publishedAt: n.publishedAt
    }))
  });
}