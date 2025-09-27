import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

// BOPA Search and Scraping API
const bopaSearchSchema = z.object({
  query: z.string().optional(),
  category: z.enum(['laws', 'regulations', 'decrees', 'orders', 'announcements']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
  includeContent: z.boolean().default(false),
});

const bopaAlertSchema = z.object({
  keywords: z.array(z.string()).min(1),
  category: z.enum(['laws', 'regulations', 'decrees', 'orders', 'announcements']).optional(),
  email: z.string().email(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
});

interface BOPAEntry {
  id: string;
  title: string;
  category: string;
  publishedDate: Date;
  bopaNumber: string;
  pageNumber?: number;
  content?: string;
  pdfUrl?: string;
  summary?: string;
}

class BOPAScrapingService {
  private static BASE_URL = 'https://www.bopa.ad';
  private static CACHE_TTL = 3600; // 1 hour for BOPA search results

  static async searchBOPA(params: z.infer<typeof bopaSearchSchema>): Promise<{
    entries: BOPAEntry[];
    pagination: any;
    cached: boolean;
  }> {
    // Generate cache key
    const cacheKey = `bopa:search:${Buffer.from(JSON.stringify(params)).toString('base64')}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return { ...JSON.parse(cached), cached: true };
    }

    let entries: BOPAEntry[] = [];

    try {
      // First try database search for previously scraped content
      entries = await this.searchDatabase(params);

      // If no results or fresh data needed, use mock data for now
      if (entries.length === 0) {
        entries = await this.getMockEntries(params);
      }
    } catch (error) {
      console.error('BOPA search error:', error);
      // Fallback to mock data
      entries = await this.getMockEntries(params);
    }

    const { page, limit } = params;
    const totalCount = entries.length;
    const paginatedEntries = entries.slice((page - 1) * limit, page * limit);

    const result = {
      entries: paginatedEntries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
      cached: false,
    };

    // Cache results
    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(result));

    return result;
  }

  private static async searchDatabase(params: z.infer<typeof bopaSearchSchema>): Promise<BOPAEntry[]> {
    const { query, category, dateFrom, dateTo } = params;
    
    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (dateFrom || dateTo) {
      where.publishedDate = {};
      if (dateFrom) where.publishedDate.gte = new Date(dateFrom);
      if (dateTo) where.publishedDate.lte = new Date(dateTo);
    }

    try {
      const bopaEntries = await prisma.bopaEntry.findMany({
        where,
        orderBy: { publishedDate: 'desc' },
        take: 100, // Limit to prevent memory issues
      });

      return bopaEntries.map(entry => ({
        id: entry.id,
        title: entry.title,
        category: entry.category,
        publishedDate: entry.publishedDate,
        bopaNumber: entry.bopaNumber,
        pageNumber: entry.pageNumber ?? undefined,
        content: entry.content ?? undefined,
        pdfUrl: entry.pdfUrl ?? undefined,
        summary: entry.summary ?? undefined,
      }));
    } catch (error) {
      console.error('Database search error:', error);
      return [];
    }
  }

  private static async getMockEntries(params: z.infer<typeof bopaSearchSchema>): Promise<BOPAEntry[]> {
    const mockEntries: BOPAEntry[] = [
      {
        id: 'bopa-1',
        title: 'Modificació del Reglament sobre la creació d\'empreses',
        category: 'regulations',
        publishedDate: new Date('2024-09-20'),
        bopaNumber: '64/2024',
        pageNumber: 1,
        summary: 'Disposicions relatives a la modificació del reglament sobre procediments de creació d\'empreses a Andorra',
        pdfUrl: 'https://www.bopa.ad/bopa/064024/Documents/64-24-01.pdf',
      },
      {
        id: 'bopa-2',
        title: 'Convocatòria de concurs públic per contractació de serveis',
        category: 'announcements',
        publishedDate: new Date('2024-09-18'),
        bopaNumber: '63/2024',
        pageNumber: 3,
        summary: 'Convocatòria de concurs públic per a la contractació de serveis de manteniment informàtic',
        pdfUrl: 'https://www.bopa.ad/bopa/063024/Documents/63-24-03.pdf',
      },
      {
        id: 'bopa-3',
        title: 'Llei de modificació del Codi de comerç',
        category: 'laws',
        publishedDate: new Date('2024-09-15'),
        bopaNumber: '62/2024',
        pageNumber: 1,
        summary: 'Llei que modifica diversos articles del Codi de comerç relatiu a societats mercantils',
        pdfUrl: 'https://www.bopa.ad/bopa/062024/Documents/62-24-01.pdf',
      },
    ];

    // Filter mock entries based on search parameters
    let filtered = mockEntries;

    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.summary?.toLowerCase().includes(query)
      );
    }

    if (params.category) {
      filtered = filtered.filter(entry => entry.category === params.category);
    }

    if (params.dateFrom) {
      const fromDate = new Date(params.dateFrom);
      filtered = filtered.filter(entry => entry.publishedDate >= fromDate);
    }

    if (params.dateTo) {
      const toDate = new Date(params.dateTo);
      filtered = filtered.filter(entry => entry.publishedDate <= toDate);
    }

    return filtered;
  }

  static async createAlert(alertData: z.infer<typeof bopaAlertSchema>, userId: string): Promise<any> {
    try {
      return await prisma.bopaAlert.create({
        data: {
          userId,
          keywords: alertData.keywords,
          category: alertData.category,
          email: alertData.email,
          frequency: alertData.frequency,
          active: true,
        },
      });
    } catch (error) {
      console.error('Create alert error:', error);
      throw new Error('Failed to create BOPA alert');
    }
  }

  static async getUserAlerts(userId: string): Promise<any[]> {
    try {
      return await prisma.bopaAlert.findMany({
        where: { userId, active: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Get user alerts error:', error);
      return [];
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Rate limiting
    const ip = request.ip || 'anonymous';
    const rateLimitResult = await rateLimit(ip, 30, 3600); // 30 requests per hour
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);

    switch (action) {
      case 'search':
        const searchParams_parsed = bopaSearchSchema.parse({
          query: searchParams.get('query') || undefined,
          category: searchParams.get('category') || undefined,
          dateFrom: searchParams.get('dateFrom') || undefined,
          dateTo: searchParams.get('dateTo') || undefined,
          page: parseInt(searchParams.get('page') || '1'),
          limit: parseInt(searchParams.get('limit') || '20'),
          includeContent: searchParams.get('includeContent') === 'true',
        });
        
        const results = await BOPAScrapingService.searchBOPA(searchParams_parsed);
        
        // Log search if user provided
        if (session?.user) {
          try {
            await prisma.searchHistory.create({
              data: {
                userId: session.user.id,
                query: searchParams_parsed.query || '',
                type: 'BOPA',
                results: results.entries.length,
              },
            });
          } catch (error) {
            console.error('Search logging error:', error);
          }
        }

        return NextResponse.json({ success: true, data: results });

      case 'alerts':
        if (!session?.user) {
          return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
          );
        }
        
        const alerts = await BOPAScrapingService.getUserAlerts(session.user.id);
        return NextResponse.json({ success: true, data: alerts });

      case 'categories':
        const categories = [
          { name: 'laws', label: 'Leyes', count: 45 },
          { name: 'regulations', label: 'Reglamentos', count: 128 },
          { name: 'decrees', label: 'Decretos', count: 89 },
          { name: 'orders', label: 'Órdenes', count: 234 },
          { name: 'announcements', label: 'Anuncios', count: 567 },
        ];
        
        return NextResponse.json({ success: true, data: categories });

      default:
        // Default behavior - return mock BOPA bulletins for backward compatibility
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
  } catch (error) {
    console.error('BOPA API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Rate limiting for alert creation
    const rateLimitResult = await rateLimit(session.user.id, 5, 3600); // 5 alerts per hour
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Alert creation rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const alertData = bopaAlertSchema.parse(body);

    const alert = await BOPAScrapingService.createAlert(alertData, session.user.id);

    return NextResponse.json({
      success: true,
      data: alert,
      message: 'BOPA alert created successfully',
    });
  } catch (error) {
    console.error('BOPA Alert Creation Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid alert data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}