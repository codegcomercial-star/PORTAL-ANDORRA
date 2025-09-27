import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const createRateLimiter = (keyPrefix: string, points: number, duration: number) => {
  return new RateLimiterRedis({
    storeClient: redis,
    keyPrefix,
    points, // requests
    duration, // seconds
    blockDuration: duration,
  });
};

export const apiKeyRateLimiters = {
  perMinute: createRateLimiter('api_minute', 60, 60),
  perHour: createRateLimiter('api_hour', 1000, 3600),
  perDay: createRateLimiter('api_day', 10000, 86400),
};