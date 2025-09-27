// Rate limiting utility for API endpoints
export interface RateLimitResult {
  success: boolean;
  retryAfter?: number;
  remaining?: number;
  resetTime?: number;
}

/**
 * Simple rate limiter implementation
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 */
export async function rateLimit(
  identifier: string, 
  limit: number, 
  windowMs: number
): Promise<RateLimitResult> {
  // Mock implementation - in production use Redis or memory store
  return {
    success: true,
    remaining: limit - 1,
    resetTime: Date.now() + windowMs
  };
}

/**
 * Rate limiter with different tiers
 */
export const rateLimiters = {
  strict: (id: string) => rateLimit(id, 10, 60000),    // 10 per minute
  normal: (id: string) => rateLimit(id, 50, 60000),    // 50 per minute  
  generous: (id: string) => rateLimit(id, 100, 60000), // 100 per minute
};