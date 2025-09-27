import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnalyticsData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalCost: number;
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
    avgResponseTime: number;
  }>;
  requestsByHour: Array<{
    hour: string;
    requests: number;
  }>;
}

export const generateAnalytics = async (
  apiKeyId: string,
  startDate: Date,
  endDate: Date
): Promise<AnalyticsData> => {
  try {
    // Get all usage data for the period
    const usage = await prisma.apiUsage.findMany({
      where: {
        apiKeyId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    const totalRequests = usage.length;
    const successfulRequests = usage.filter(u => u.statusCode >= 200 && u.statusCode < 400).length;
    const failedRequests = totalRequests - successfulRequests;
    const averageResponseTime = usage.length > 0 
      ? usage.reduce((sum, u) => sum + u.responseTime, 0) / usage.length 
      : 0;
    const totalCost = usage.reduce((sum, u) => sum + Number(u.cost), 0);

    // Top endpoints
    const endpointStats = usage.reduce((acc, u) => {
      if (!acc[u.endpoint]) {
        acc[u.endpoint] = { requests: 0, totalResponseTime: 0 };
      }
      acc[u.endpoint].requests++;
      acc[u.endpoint].totalResponseTime += u.responseTime;
      return acc;
    }, {} as Record<string, { requests: number; totalResponseTime: number }>);

    const topEndpoints = Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint,
        requests: stats.requests,
        avgResponseTime: stats.totalResponseTime / stats.requests
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);

    // Requests by hour
    const hourlyStats = usage.reduce((acc, u) => {
      const hour = u.timestamp.toISOString().substring(0, 13) + ':00:00.000Z';
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const requestsByHour = Object.entries(hourlyStats)
      .map(([hour, requests]) => ({ hour, requests }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: Math.round(averageResponseTime),
      totalCost,
      topEndpoints,
      requestsByHour
    };
  } catch (error) {
    console.error('Error generating analytics:', error);
    throw error;
  }
};

export const saveAnalyticsSnapshot = async (
  date: Date,
  apiKeyId?: string,
  endpointId?: string
) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const whereClause: any = {
      timestamp: {
        gte: startOfDay,
        lte: endOfDay
      }
    };

    if (apiKeyId) whereClause.apiKeyId = apiKeyId;
    if (endpointId) whereClause.endpoint = endpointId;

    const usage = await prisma.apiUsage.findMany({ where: whereClause });

    const totalRequests = usage.length;
    const successfulRequests = usage.filter(u => u.statusCode >= 200 && u.statusCode < 400).length;
    const failedRequests = totalRequests - successfulRequests;
    const averageResponseTime = usage.length > 0
      ? Math.round(usage.reduce((sum, u) => sum + u.responseTime, 0) / usage.length)
      : 0;
    const totalCost = usage.reduce((sum, u) => sum + Number(u.cost), 0);

    // Create unique identifier for the analytics record
    const uniqueKey = `${startOfDay.toISOString()}_${apiKeyId || 'all'}_${endpointId || 'all'}`;
    
    return await prisma.apiAnalytics.create({
      data: {
        id: uniqueKey,
        date: startOfDay,
        apiKeyId,
        endpointId,
        totalRequests,
        successfulRequests,
        failedRequests,
        averageResponseTime,
        totalCost
      }
    });
  } catch (error) {
    console.error('Error saving analytics snapshot:', error);
    throw error;
  }
};