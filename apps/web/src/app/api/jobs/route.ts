import { NextRequest, NextResponse } from 'next/server';
import { jobService } from '@/lib/jobs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const text = searchParams.get('search') || undefined;
    const category = searchParams.get('category')?.split(',') || undefined;
    const type = searchParams.get('type')?.split(',') as any[] || undefined;
    const level = searchParams.get('level')?.split(',') as any[] || undefined;
    const skills = searchParams.get('skills')?.split(',') || undefined;
    const languages = searchParams.get('languages')?.split(',') || undefined;
    const parish = searchParams.get('parish')?.split(',') || undefined;
    const remote = searchParams.get('remote') === 'true' ? true : undefined;
    const salaryMin = searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined;
    const salaryMax = searchParams.get('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined;
    const sortBy = searchParams.get('sortBy') as any || 'date';
    const sortOrder = searchParams.get('sortOrder') as any || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const jobs = await jobService.searchJobs({
      text,
      category,
      type,
      level,
      skills,
      languages,
      parish,
      remote,
      salaryMin,
      salaryMax,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        limit,
        offset,
        hasMore: jobs.length === limit,
      },
    });

  } catch (error) {
    console.error('Jobs API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Manual job scraping trigger
    const result = await jobService.scrapeAllJobSources();
    
    return NextResponse.json({
      success: true,
      message: 'Job scraping completed',
      result,
    });

  } catch (error) {
    console.error('Job scraping error:', error);
    
    return NextResponse.json(
      { error: 'Job scraping failed' },
      { status: 500 }
    );
  }
}