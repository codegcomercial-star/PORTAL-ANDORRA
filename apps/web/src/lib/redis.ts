// Mock Redis client for development
export const redis = {
  // Basic operations
  get: async (key: string): Promise<string | null> => {
    console.log(`Redis GET: ${key}`);
    return null;
  },
  
  set: async (key: string, value: string): Promise<string> => {
    console.log(`Redis SET: ${key} = ${value}`);
    return 'OK';
  },
  
  setex: async (key: string, seconds: number, value: string): Promise<string> => {
    console.log(`Redis SETEX: ${key} = ${value} (TTL: ${seconds}s)`);
    return 'OK';
  },
  
  del: async (key: string): Promise<number> => {
    console.log(`Redis DEL: ${key}`);
    return 1;
  },
  
  // Hash operations
  hget: async (key: string, field: string): Promise<string | null> => {
    console.log(`Redis HGET: ${key}.${field}`);
    return null;
  },
  
  hset: async (key: string, field: string, value: string): Promise<number> => {
    console.log(`Redis HSET: ${key}.${field} = ${value}`);
    return 1;
  },
  
  // List operations
  lpush: async (key: string, ...values: string[]): Promise<number> => {
    console.log(`Redis LPUSH: ${key} <- [${values.join(', ')}]`);
    return values.length;
  },
  
  lrange: async (key: string, start: number, stop: number): Promise<string[]> => {
    console.log(`Redis LRANGE: ${key}[${start}:${stop}]`);
    return [];
  },
  
  // Utility operations
  exists: async (key: string): Promise<number> => {
    console.log(`Redis EXISTS: ${key}`);
    return 0;
  },
  
  expire: async (key: string, seconds: number): Promise<number> => {
    console.log(`Redis EXPIRE: ${key} (TTL: ${seconds}s)`);
    return 1;
  }
};