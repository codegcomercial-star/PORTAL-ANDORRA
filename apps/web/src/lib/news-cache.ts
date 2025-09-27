// Sistema de cache simple para noticias
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class NewsCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, expiresInMs: number = 3600000): void { // 1 hora por defecto
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInMs
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si ha expirado
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Limpiar entradas expiradas
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }
}

// Instancia global del cache
export const newsCache = new NewsCache();

// Configuración de tiempos de cache
export const CACHE_TIMES = {
  NEWS_API: 30 * 60 * 1000,    // 30 minutos
  RSS_FEEDS: 15 * 60 * 1000,   // 15 minutos
  MOCK_DATA: 5 * 60 * 1000,    // 5 minutos
  CATEGORIES: 60 * 60 * 1000,  // 1 hora
};

// Funciones utilitarias para cache
export function getCacheKey(source: string, category?: string, limit?: number): string {
  const parts = [source];
  if (category && category !== 'all') parts.push(category);
  if (limit) parts.push(limit.toString());
  return parts.join(':');
}

// Limpiar cache automáticamente cada 30 minutos
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    newsCache.cleanup();
  }, 30 * 60 * 1000);
}