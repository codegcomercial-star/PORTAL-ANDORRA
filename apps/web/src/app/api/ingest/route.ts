import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/lib/news';
import { bopaService } from '@/lib/bopa';
import { realEstateService } from '@/lib/real-estate';
import { jobService } from '@/lib/jobs';

// Security: Only allow requests with the correct token
const INGEST_TOKEN = process.env.INGEST_TOKEN || 'super-secret-ingest-token-2024';

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== INGEST_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🚀 Starting automated content ingestion...');
    const startTime = Date.now();

    // Parallel execution of all ingestion services
    const [newsResult, bopaResult, realEstateResult, jobResult] = await Promise.allSettled([
      newsService.ingestAllFeeds(),
      bopaService.scrapeLatestBOPA(),
      realEstateService.scrapeAllSources(),
      jobService.scrapeAllJobSources(),
    ]);

    // Process results
    const results = {
      news: newsResult.status === 'fulfilled' ? newsResult.value : { success: 0, errors: 1 },
      bopa: bopaResult.status === 'fulfilled' ? bopaResult.value : { success: 0, errors: 1 },
      realEstate: realEstateResult.status === 'fulfilled' ? realEstateResult.value : { success: 0, errors: 1 },
      jobs: jobResult.status === 'fulfilled' ? jobResult.value : { success: 0, errors: 1 },
    };

    const totalSuccess = results.news.success + results.bopa.success + results.realEstate.success + results.jobs.success;
    const totalErrors = results.news.errors + results.bopa.errors + results.realEstate.errors + results.jobs.errors;
    const executionTime = Date.now() - startTime;

    console.log(`✅ Ingestion complete: ${totalSuccess} items processed, ${totalErrors} errors in ${executionTime}ms`);

    return NextResponse.json({
      success: true,
      summary: {
        totalSuccess,
        totalErrors,
        executionTime,
        timestamp: new Date().toISOString(),
      },
      details: results,
    });

  } catch (error) {
    console.error('Error in content ingestion:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET endpoint for manual trigger and status check
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== INGEST_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return ingestion status and statistics
    return NextResponse.json({
      status: 'ready',
      services: {
        news: 'active',
        bopa: 'active', 
        realEstate: 'active',
        jobs: 'active',
      },
      lastRun: null, // TODO: Implement last run tracking
      nextScheduled: 'Every 15 minutes via cron',
      endpoint: '/api/ingest',
      method: 'POST',
      authentication: 'Bearer token required',
    });

  } catch (error) {
    console.error('Error checking ingestion status:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}