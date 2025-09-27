import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

// AI Search API - Multiple providers with fallback
const aiSearchSchema = z.object({
  query: z.string().min(1).max(1000),
  context: z.enum(['general', 'laws', 'bopa', 'companies', 'weather', 'finance']).default('general'),
  model: z.enum(['gpt-4', 'claude-3', 'gemini-pro']).optional(),
  stream: z.boolean().default(false),
  maxTokens: z.number().min(100).max(4000).default(1000),
});

interface AIProvider {
  name: string;
  generateResponse(prompt: string, context: string, maxTokens: number): Promise<string>;
  generateStreamResponse?(prompt: string, context: string): AsyncGenerator<string>;
}

class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey = process.env.OPENAI_API_KEY!;

  async generateResponse(prompt: string, context: string, maxTokens: number): Promise<string> {
    const systemPrompt = this.getSystemPrompt(context);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private getSystemPrompt(context: string): string {
    const basePrompt = `Eres un asistente especializado en el Portal Andorra. Respondes en español sobre temas relacionados con Andorra.`;
    
    const contextPrompts = {
      general: `${basePrompt} Proporciona información general sobre Andorra.`,
      laws: `${basePrompt} Te especializas en legislación y normativa andorrana. Cita siempre las fuentes legales.`,
      bopa: `${basePrompt} Te especializas en el Butlletí Oficial del Principat d'Andorra (BOPA).`,
      companies: `${basePrompt} Te especializas en el directorio de empresas andorranas.`,
      weather: `${basePrompt} Te especializas en información meteorológica de Andorra.`,
      finance: `${basePrompt} Te especializas en información financiera y fiscal de Andorra.`,
    };

    return contextPrompts[context as keyof typeof contextPrompts] || contextPrompts.general;
  }
}

class ClaudeProvider implements AIProvider {
  name = 'Claude';
  private apiKey = process.env.CLAUDE_API_KEY!;

  async generateResponse(prompt: string, context: string, maxTokens: number): Promise<string> {
    const systemPrompt = this.getSystemPrompt(context);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private getSystemPrompt(context: string): string {
    return `Eres Claude, un asistente especializado en el Portal Andorra. Respondes en español sobre temas relacionados con Andorra, ${context}.`;
  }
}

class AISearchService {
  private static providers: AIProvider[] = [
    new OpenAIProvider(),
    new ClaudeProvider(),
  ];

  private static CACHE_TTL = 3600; // 1 hour for frequent queries

  static async search(
    query: string,
    context: string,
    userId?: string,
    options: { maxTokens?: number; preferredModel?: string } = {}
  ): Promise<{
    response: string;
    provider: string;
    tokensUsed: number;
    cached: boolean;
  }> {
    // Check cache for frequent queries
    const cacheKey = `ai:search:${Buffer.from(query + context).toString('base64')}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      const result = JSON.parse(cached);
      return { ...result, cached: true };
    }

    // Get relevant context from database
    const enhancedContext = await this.getRelevantContext(query, context);
    const fullPrompt = `${query}\n\nContexto relevante:\n${enhancedContext}`;

    // Try providers in order
    let lastError: Error | null = null;
    
    for (const provider of this.providers) {
      try {
        const response = await provider.generateResponse(
          fullPrompt,
          context,
          options.maxTokens || 1000
        );

        const result = {
          response,
          provider: provider.name,
          tokensUsed: Math.ceil(response.length / 4), // Rough estimate
          cached: false,
        };

        // Cache successful response
        await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(result));

        // Log search if user provided
        if (userId) {
          await prisma.searchHistory.create({
            data: {
              userId,
              query,
              type: 'AI_CHAT',
              results: 1,
            },
          });
        }

        return result;
      } catch (error) {
        console.error(`AI Provider ${provider.name} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    throw lastError || new Error('All AI providers failed');
  }

  private static async getRelevantContext(query: string, context: string): Promise<string> {
    // Simple keyword-based context retrieval
    // In production, use vector embeddings for semantic search
    
    let relevantContent = '';

    try {
      switch (context) {
        case 'laws':
          const laws = await prisma.law.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { summary: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: 3,
            select: {
              title: true,
              summary: true,
              number: true,
            },
          });
          relevantContent = laws.map((law: any) => `Ley ${law.number}: ${law.title} - ${law.summary || ''}`).join('\n');
          break;

        case 'companies':
          const companies = await prisma.organization.findMany({
            where: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: 5,
            select: {
              name: true,
              description: true,
              country: true,
            },
          });
          relevantContent = companies.map((company: any) => `${company.name} (${company.country}): ${company.description || ''}`).join('\n');
          break;

        case 'weather':
          const weatherData = await prisma.weatherSnapshot.findFirst({
            where: { city: 'Andorra la Vella' },
            orderBy: { recordedAt: 'desc' },
          });
          if (weatherData) {
            relevantContent = `Tiempo actual en Andorra: ${weatherData.temperature}°C, ${weatherData.description}, Humedad: ${weatherData.humidity}%`;
          }
          break;

        default:
          // General context - get recent news
          const news = await prisma.article.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: 3,
            select: {
              title: true,
              summary: true,
              publishedAt: true,
            },
            orderBy: { publishedAt: 'desc' },
          });
          relevantContent = news.map(article => `${article.title} (${article.publishedAt?.toDateString()}): ${article.summary || ''}`).join('\n');
          break;
      }
    } catch (error) {
      console.error('Error getting relevant context:', error);
    }

    return relevantContent || 'No se encontró contexto específico relacionado.';
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || 'anonymous';
    const rateLimitResult = await rateLimit(ip, 50, 3600); // 50 requests per hour
    
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
    const body = await request.json();
    const params = aiSearchSchema.parse(body);

    // Additional rate limiting for non-authenticated users
    if (!session?.user) {
      const guestRateLimit = await rateLimit(`guest:${ip}`, 10, 3600); // 10 requests per hour for guests
      if (!guestRateLimit.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Guest rate limit exceeded. Please sign in for higher limits.',
            retryAfter: guestRateLimit.retryAfter 
          },
          { status: 429 }
        );
      }
    }

    const result = await AISearchService.search(
      params.query,
      params.context,
      session?.user?.id,
      {
        maxTokens: params.maxTokens,
        preferredModel: params.model,
      }
    );

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Search Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters', details: error.errors },
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

// GET endpoint for search suggestions and history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'history':
        const history = await prisma.searchHistory.findMany({
          where: {
            userId: session.user.id,
            type: 'AI_CHAT',
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });
        return NextResponse.json({ success: true, data: history });

      case 'suggestions':
        const query = searchParams.get('query') || '';
        // Simple suggestion system - in production use ML-based suggestions
        const suggestions = [
          'Cómo crear una empresa en Andorra',
          'Trámites fiscales para residentes',
          'Tiempo en Andorra esta semana',
          'Últimas leyes aprobadas',
          'Directorio empresas tecnología',
        ].filter(s => s.toLowerCase().includes(query.toLowerCase()));
        
        return NextResponse.json({ success: true, data: suggestions });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI Search GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}