import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import { NEWS_SOURCES, type NewsSource } from '@/config/news-sources';

type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  enclosure?: { url?: string };
  'content:encoded'?: string;
};
type Feed = { items: FeedItem[] };

const parser = new Parser<unknown, Feed>();

function parseDate(item: FeedItem): Date {
  const raw = (item.isoDate || item.pubDate || '').trim();
  const d = raw ? new Date(raw) : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}

function extractImage(item: FeedItem): string | null {
  // 1) Enclosure <enclosure url="...">
  const enc = item.enclosure?.url;
  if (enc && /^https?:\/\//.test(enc)) return enc;

  // 2) Buscar <img src="..."> dentro de content:encoded
  const html = (item as any)['content:encoded'] || item.content || '';
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m && /^https?:\/\//.test(m[1])) return m[1];

  return null;
}

function pickContent(item: FeedItem): string {
  return (
    item.contentSnippet ||
    item.summary ||
    item.content ||
    ''
  ).toString();
}

export async function ingestAllNews(): Promise<void> {
  const jobs = NEWS_SOURCES.map(s => ingestSource(s));
  await Promise.allSettled(jobs);
}

async function ingestSource(source: NewsSource): Promise<void> {
  try {
    const feed = await parser.parseURL(source.url);
    const items = (feed.items || []).slice(0, 20);

    for (const it of items) {
      const url = it.link?.trim() || '';
      if (!url) continue;

      await prisma.news.upsert({
        where: { url },
        update: {
          title: it.title?.trim() || '',
          content: pickContent(it),
          source: source.name,
          category: source.category,
          language: source.language,
          imageUrl: extractImage(it),
          publishedAt: parseDate(it),
          updatedAt: new Date()
        },
        create: {
          title: it.title?.trim() || '',
          content: pickContent(it),
          url,
          source: source.name,
          category: source.category,
          language: source.language,
          imageUrl: extractImage(it),
          publishedAt: parseDate(it)
        }
      });
    }
  } catch (e) {
    console.error(`[news] Error en ${source.name}:`, e);
  }
}

export async function latestNews(opts?: { lang?: string; category?: string; limit?: number }) {
  const { lang, category, limit = 24 } = opts || {};
  return prisma.news.findMany({
    where: {
      ...(lang ? { language: lang as any } : {}),
      ...(category ? { category: category as any } : {})
    },
    orderBy: { publishedAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 100)
  });
}