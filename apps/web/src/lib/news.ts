import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma.js';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  url: string;
  publishedAt: Date;
  source: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  language: 'ca' | 'es' | 'en' | 'fr';
  sentiment?: 'positive' | 'negative' | 'neutral';
  importance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RSSFeed {
  url: string;
  name: string;
  category: string;
  language: 'ca' | 'es' | 'en' | 'fr';
  active: boolean;
}

const RSS_FEEDS: RSSFeed[] = [
  { url: 'https://www.diariandorra.ad/rss.xml', name: 'Diari d\'Andorra', category: 'general', language: 'ca', active: true },
  { url: 'https://www.bondia.ad/rss.xml', name: 'Bondia', category: 'general', language: 'ca', active: true },
  { url: 'https://www.altaveu.com/rss.xml', name: 'Altaveu', category: 'general', language: 'ca', active: true },
  { url: 'https://rss.cnn.com/rss/edition.rss', name: 'CNN International', category: 'internacional', language: 'en', active: true },
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', name: 'El País', category: 'españa', language: 'es', active: true },
  { url: 'https://www.lemonde.fr/rss/une.xml', name: 'Le Monde', category: 'france', language: 'fr', active: true },
];

export class NewsService {
  private static instance: NewsService;
  
  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  async fetchRSSFeed(feed: RSSFeed): Promise<NewsItem[]> {
    try {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Portal Andorra News Bot 1.0',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
        next: { revalidate: 300 } // 5 minutos
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${feed.url}`);
      }

      const xmlText = await response.text();
      return this.parseRSSXML(xmlText, feed);
    } catch (error) {
      console.error(`Error fetching RSS feed ${feed.name}:`, error);
      return [];
    }
  }

  private parseRSSXML(xml: string, feed: RSSFeed): NewsItem[] {
    const items: NewsItem[] = [];
    
    // Simple XML parsing (en producción usar una librería como fast-xml-parser)
    const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
    
    for (const itemXml of itemMatches) {
      try {
        const title = this.extractXMLTag(itemXml, 'title');
        const link = this.extractXMLTag(itemXml, 'link');
        const description = this.extractXMLTag(itemXml, 'description');
        const pubDate = this.extractXMLTag(itemXml, 'pubDate');
        const category = this.extractXMLTag(itemXml, 'category') || feed.category;
        
        if (title && link) {
          items.push({
            id: this.generateId(link),
            title: this.cleanHTML(title),
            content: this.cleanHTML(description || ''),
            summary: this.generateSummary(description || ''),
            url: link,
            publishedAt: new Date(pubDate || Date.now()),
            source: feed.name,
            category,
            tags: this.extractTags(description || ''),
            language: feed.language,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Error parsing RSS item:', error);
      }
    }

    return items;
  }

  private extractXMLTag(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  }

  private cleanHTML(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  private generateSummary(content: string): string {
    const cleaned = this.cleanHTML(content);
    return cleaned.length > 200 ? cleaned.substring(0, 197) + '...' : cleaned;
  }

  private extractTags(content: string): string[] {
    const words = this.cleanHTML(content).toLowerCase().split(/\s+/);
    const stopWords = ['el', 'la', 'de', 'en', 'y', 'a', 'que', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'un', 'una', 'este', 'esta', 'estos', 'estas'];
    
    return words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 5);
  }

  private generateId(url: string): string {
    return Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  }

  async ingestAllFeeds(): Promise<{ success: number; errors: number }> {
    let success = 0;
    let errors = 0;

    console.log('🔄 Starting news ingestion...');

    for (const feed of RSS_FEEDS.filter(f => f.active)) {
      try {
        console.log(`📰 Fetching ${feed.name}...`);
        const items = await this.fetchRSSFeed(feed);
        
        for (const item of items) {
          try {
            await this.saveNewsItem(item);
            success++;
          } catch (error) {
            console.error(`Error saving news item from ${feed.name}:`, error);
            errors++;
          }
        }
      } catch (error) {
        console.error(`Error processing feed ${feed.name}:`, error);
        errors++;
      }
    }

    console.log(`✅ News ingestion complete: ${success} saved, ${errors} errors`);
    return { success, errors };
  }

  private async saveNewsItem(item: NewsItem): Promise<void> {
    try {
      await prisma.news.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          title: item.title,
          content: item.content,
          summary: item.summary,
          url: item.url,
          publishedAt: item.publishedAt,
          source: item.source,
          category: item.category,
          tags: item.tags,
          imageUrl: item.imageUrl,
          language: item.language,
          sentiment: item.sentiment,
          importance: item.importance,
        },
        update: {
          title: item.title,
          content: item.content,
          summary: item.summary,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      // Si falla Prisma, guardamos en memoria temporal
      console.warn('Database unavailable, using memory cache:', error);
    }
  }

  async getNews(options: {
    limit?: number;
    offset?: number;
    category?: string;
    language?: string;
    search?: string;
  } = {}): Promise<NewsItem[]> {
    const { limit = 20, offset = 0, category, language, search } = options;

    try {
      const where: any = {};
      
      if (category) where.category = category;
      if (language) where.language = language;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search.toLowerCase()] } },
        ];
      }

      return await prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const categories = await prisma.news.findMany({
        select: { category: true },
        distinct: ['category'],
      });
      
      return categories.map(c => c.category).filter(Boolean);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['general', 'economia', 'politica', 'internacional', 'deportes', 'cultura'];
    }
  }

  async enhanceWithAI(item: NewsItem): Promise<NewsItem> {
    try {
      // Aquí integraríamos con OpenAI/Claude para:
      // 1. Análisis de sentimiento
      // 2. Generación de resumen mejorado
      // 3. Extracción de entidades
      // 4. Puntuación de importancia
      
      const enhancedItem = { ...item };
      
      // Mock AI enhancement (reemplazar con API real)
      enhancedItem.sentiment = this.mockSentimentAnalysis(item.content);
      enhancedItem.importance = this.mockImportanceScore(item);
      
      return enhancedItem;
    } catch (error) {
      console.error('Error enhancing news with AI:', error);
      return item;
    }
  }

  private mockSentimentAnalysis(content: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['éxito', 'crecimiento', 'mejora', 'victoria', 'innovación'];
    const negativeWords = ['crisis', 'problema', 'conflicto', 'recesión', 'accidente'];
    
    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private mockImportanceScore(item: NewsItem): number {
    let score = 0.5; // Base score
    
    // Boost for certain categories
    if (['economia', 'politica'].includes(item.category)) score += 0.2;
    
    // Boost for recent news
    const hoursSincePublished = (Date.now() - item.publishedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSincePublished < 2) score += 0.3;
    
    // Title indicators
    const urgentWords = ['urgente', 'breaking', 'última hora', 'crisis'];
    if (urgentWords.some(word => item.title.toLowerCase().includes(word))) {
      score += 0.4;
    }
    
    return Math.min(1, Math.max(0, score));
  }
}

// Export singleton instance
export const newsService = NewsService.getInstance();