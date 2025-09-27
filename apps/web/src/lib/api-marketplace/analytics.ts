export interface AnalyticsData {
  requests: number;
  users: number;
  revenue: number;
  endpoints: Record<string, number>;
}

export interface UsageStats {
  hour: string;
  requests: number;
}

export function calculateUsage(data: any[]): AnalyticsData {
  return {
    requests: data.length || 0,
    users: new Set(data.map(d => d.userId)).size || 0,
    revenue: data.reduce((sum: number, d: any) => sum + (d.cost || 0), 0),
    endpoints: data.reduce((acc: Record<string, number>, d: any) => {
      acc[d.endpoint] = (acc[d.endpoint] || 0) + 1;
      return acc;
    }, {})
  };
}

export function generateHourlyStats(data: any[]): UsageStats[] {
  const hourlyData: Record<string, number> = {};
  
  data.forEach(item => {
    const hour = new Date(item.timestamp).getHours().toString().padStart(2, '0') + ':00';
    hourlyData[hour] = (hourlyData[hour] || 0) + 1;
  });

  return Object.entries(hourlyData).map(([hour, requests]) => ({ hour, requests }));
}
