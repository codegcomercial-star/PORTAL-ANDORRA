import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, trackApiUsage } from './auth';
import { apiKeyRateLimiters } from './rate-limiting';

export const apiMarketplaceMiddleware = async (
  req: NextRequest,
  endpointPath: string
) => {
  const startTime = Date.now();
  
  // Extract API key
  const apiKey = req.headers.get('x-api-key') || 
                 req.headers.get('authorization')?.replace('Bearer ', '') ||
                 req.nextUrl.searchParams.get('api_key');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key required. Include it in x-api-key header or api_key query parameter.' },
      { status: 401 }
    );
  }
  
  // Validate API key
  const keyData = await validateApiKey(apiKey);
  if (!keyData) {
    return NextResponse.json(
      { error: 'Invalid or inactive API key' },
      { status: 401 }
    );
  }
  
  // Rate limiting
  try {
    await apiKeyRateLimiters.perMinute.consume(apiKey);
    await apiKeyRateLimiters.perHour.consume(apiKey);
    await apiKeyRateLimiters.perDay.consume(apiKey);
  } catch (rejRes: any) {
    const resetTime = new Date(Date.now() + rejRes.msBeforeNext);
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded',
        resetTime: resetTime.toISOString(),
        remainingPoints: rejRes.remainingPoints || 0
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': keyData.requestsPerMinute.toString(),
          'X-RateLimit-Remaining': (rejRes.remainingPoints || 0).toString(),
          'X-RateLimit-Reset': resetTime.getTime().toString()
        }
      }
    );
  }
  
  return {
    keyData,
    trackUsage: async (statusCode: number, responseSize?: number, cost?: number) => {
      const responseTime = Date.now() - startTime;
      
      await trackApiUsage(keyData.id, {
        endpoint: endpointPath,
        method: req.method,
        statusCode,
        responseTime,
        responseSize,
        userAgent: req.headers.get('user-agent') || undefined,
        ipAddress: req.ip || req.headers.get('x-forwarded-for') || undefined,
        cost: cost || 0
      });
    }
  };
};