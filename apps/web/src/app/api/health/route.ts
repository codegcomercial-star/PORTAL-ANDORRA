import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'missing',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
        REDIS_URL: process.env.REDIS_URL ? 'configured' : 'missing',
      },
      deployment: {
        vercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || 'unknown',
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}