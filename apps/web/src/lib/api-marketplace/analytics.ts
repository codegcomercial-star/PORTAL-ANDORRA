export interface AnalyticsUser {
  id: string;
  requests: number;
  lastSeen: string;
}

export interface AnalyticsEndpoint {
  path: string;
  requests: number;
  avgResponseTime: number;
}

export interface AnalyticsUser {
  id: string;
  requests: number;
  lastSeen: string;
}

export interface AnalyticsEndpoint {
  path: string;
  requests: number;
  avgResponseTime: number;
}

export interface AnalyticsData {
  totalRequests: number;
  activeUsers: number;
  revenue: number;
  topEndpoints: AnalyticsEndpoint[];
}

export interface UsageRecord {
  userId: string;
  endpoint: string;
  timestamp: string;
  responseTime: number;
  cost: number;
}

export function calculateAnalytics(records: UsageRecord[]): AnalyticsData {
  const totalRequests = records.length;
  const activeUsers = new Set(records.map(r => r.userId)).size;
  const revenue = records.reduce((sum, record) => sum + record.cost, 0);
  
  const endpointStats = records.reduce((acc, record) => {
    if (!acc[record.endpoint]) {
      acc[record.endpoint] = { requests: 0, totalTime: 0 };
    }
    acc[record.endpoint].requests++;
    acc[record.endpoint].totalTime += record.responseTime;
    return acc;
  }, {} as Record<string, { requests: number; totalTime: number }>);

  const topEndpoints = Object.entries(endpointStats)
    .map(([path, stats]) => ({
      path,
      requests: stats.requests,
      avgResponseTime: stats.totalTime / stats.requests
    }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10);

  return {
    totalRequests,
    activeUsers,
    revenue,
    topEndpoints
  };
}
