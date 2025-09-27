import { newsService } from './news';
import { bopaService } from './bopa';
import { realEstateService } from './real-estate';
import { jobService } from './jobs';
import { rateLimit } from './rate-limit';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'news' | 'bopa' | 'real-estate' | 'job' | 'general';
  source: string;
  date: Date;
  relevanceScore: number;
  metadata: Record<string, any>;
  snippet?: string;
  imageUrl?: string;
}

export interface SearchQuery {
  query: string;
  types?: SearchResult['type'][];
  sources?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'relevance' | 'date' | 'source';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}

export interface SearchFacets {
  types: { type: string; count: number }[];
  sources: { source: string; count: number }[];
  dates: { period: string; count: number }[];
  categories: { category: string; count: number }[];
}

export interface SearchStats {
  totalResults: number;
  searchTime: number;
  suggestions: string[];
  didYouMean?: string;
}

export class UniversalSearchService {
  private static instance: UniversalSearchService;
  private rateLimiter = rateLimit({ limit: 100, windowSec: 60 });
  private searchHistory: Map<string, SearchResult[]> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static getInstance(): UniversalSearchService {
    if (!UniversalSearchService.instance) {
      UniversalSearchService.instance = new UniversalSearchService();
    }
    return UniversalSearchService.instance;
  }

  async search(query: SearchQuery): Promise<{
    results: SearchResult[];
    facets: SearchFacets;
    stats: SearchStats;
  }> {
    const startTime = Date.now();
    
    try {
      // Rate limiting
      const rateCheck = await this.rateLimiter(`search-${query.query}`);
      if (!rateCheck.ok) {
        throw new Error('Rate limit exceeded for search');
      }

      // Check cache first
      const cacheKey = this.generateCacheKey(query);
      const cached = this.searchHistory.get(cacheKey);
      if (cached && Date.now() - cached[0]?.date.getTime() < this.cacheTimeout) {
        return this.buildSearchResponse(cached, startTime, query);
      }

      console.log(`🔍 Universal search for: "${query.query}"`);

      // Parallel search across all sources
      const searchPromises: Promise<SearchResult[]>[] = [];

      if (!query.types || query.types.includes('news')) {
        searchPromises.push(this.searchNews(query));
      }
      if (!query.types || query.types.includes('bopa')) {
        searchPromises.push(this.searchBOPA(query));
      }
      if (!query.types || query.types.includes('real-estate')) {
        searchPromises.push(this.searchRealEstate(query));
      }
      if (!query.types || query.types.includes('job')) {
        searchPromises.push(this.searchJobs(query));
      }

      // Execute all searches in parallel
      const searchResults = await Promise.allSettled(searchPromises);
      
      // Combine and process results
      let allResults: SearchResult[] = [];
      for (const result of searchResults) {
        if (result.status === 'fulfilled') {
          allResults = allResults.concat(result.value);
        } else {
          console.error('Search error:', result.reason);
        }
      }

      // Apply AI ranking and filtering
      allResults = await this.enhanceResultsWithAI(allResults, query);

      // Sort and limit results
      allResults = this.sortAndLimitResults(allResults, query);

      // Cache results
      this.searchHistory.set(cacheKey, allResults);

      return this.buildSearchResponse(allResults, startTime, query);
    } catch (error) {
      console.error('Error in universal search:', error);
      return {
        results: [],
        facets: { types: [], sources: [], dates: [], categories: [] },
        stats: { totalResults: 0, searchTime: Date.now() - startTime, suggestions: [] },
      };
    }
  }

  private async searchNews(query: SearchQuery): Promise<SearchResult[]> {
    try {
      const newsResults = await newsService.getNews({
        search: query.query,
        limit: 50,
      });

      return newsResults.map(news => ({
        id: `news_${news.id}`,
        title: news.title,
        description: news.summary,
        url: news.url,
        type: 'news' as const,
        source: news.source,
        date: news.publishedAt,
        relevanceScore: this.calculateRelevanceScore(query.query, news.title + ' ' + news.content),
        metadata: {
          category: news.category,
          tags: news.tags,
          language: news.language,
          sentiment: news.sentiment,
        },
        snippet: this.generateSnippet(news.content, query.query),
        imageUrl: news.imageUrl,
      }));
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  private async searchBOPA(query: SearchQuery): Promise<SearchResult[]> {
    try {
      const bopaResults = await bopaService.searchBOPA({
        text: query.query,
        limit: 30,
      });

      return bopaResults.map(bopa => ({
        id: `bopa_${bopa.id}`,
        title: bopa.titulo,
        description: bopa.contenido.substring(0, 200) + '...',
        url: bopa.url,
        type: 'bopa' as const,
        source: 'BOPA',
        date: bopa.fecha,
        relevanceScore: this.calculateRelevanceScore(query.query, bopa.titulo + ' ' + bopa.contenido),
        metadata: {
          numero: bopa.numero,
          seccion: bopa.seccion,
          tipo: bopa.tipo,
          keywords: bopa.keywords,
        },
        snippet: this.generateSnippet(bopa.contenido, query.query),
      }));
    } catch (error) {
      console.error('Error searching BOPA:', error);
      return [];
    }
  }

  private async searchRealEstate(query: SearchQuery): Promise<SearchResult[]> {
    try {
      const propertyResults = await realEstateService.searchProperties({
        text: query.query,
        limit: 30,
      });

      return propertyResults.map(property => ({
        id: `property_${property.id}`,
        title: property.title,
        description: property.aiDescription,
        url: `/immobiliaria/${property.id}`,
        type: 'real-estate' as const,
        source: property.source,
        date: property.publishedAt,
        relevanceScore: this.calculateRelevanceScore(query.query, property.title + ' ' + property.description),
        metadata: {
          price: property.price,
          type: property.type,
          parish: property.parish,
          surface: property.surface,
          bedrooms: property.bedrooms,
          operation: property.operation,
        },
        snippet: this.generateSnippet(property.description, query.query),
        imageUrl: property.images[0],
      }));
    } catch (error) {
      console.error('Error searching real estate:', error);
      return [];
    }
  }

  private async searchJobs(query: SearchQuery): Promise<SearchResult[]> {
    try {
      const jobResults = await jobService.searchJobs({
        text: query.query,
        limit: 30,
      });

      return jobResults.map(job => ({
        id: `job_${job.id}`,
        title: job.title,
        description: job.aiSummary,
        url: `/feina/${job.id}`,
        type: 'job' as const,
        source: job.source,
        date: job.publishedAt,
        relevanceScore: this.calculateRelevanceScore(query.query, job.title + ' ' + job.description),
        metadata: {
          company: job.company,
          type: job.type,
          level: job.level,
          category: job.category,
          skills: job.skills,
          salary: job.salary,
          location: job.location,
        },
        snippet: this.generateSnippet(job.description, query.query),
      }));
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }

  private calculateRelevanceScore(query: string, content: string): number {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();
    
    let score = 0;
    let titleBonus = 0;
    
    for (const term of queryTerms) {
      if (term.length < 3) continue; // Skip short terms
      
      // Exact match bonus
      if (contentLower.includes(term)) {
        score += 10;
        
        // Title match bonus (first 100 characters)
        if (contentLower.substring(0, 100).includes(term)) {
          titleBonus += 5;
        }
      }
      
      // Partial match
      const words = contentLower.split(/\s+/);
      for (const word of words) {
        if (word.includes(term) || term.includes(word)) {
          score += 3;
        }
      }
    }
    
    // Normalize score (0-100)
    const maxScore = queryTerms.length * 10 + titleBonus;
    return Math.min(100, (score / Math.max(maxScore, 1)) * 100);
  }

  private generateSnippet(content: string, query: string): string {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
    const sentences = content.split(/[.!?]+/);
    
    // Find sentence with most query terms
    let bestSentence = '';
    let maxMatches = 0;
    
    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase();
      const matches = queryTerms.filter(term => sentenceLower.includes(term)).length;
      
      if (matches > maxMatches && sentence.length > 50) {
        maxMatches = matches;
        bestSentence = sentence;
      }
    }
    
    if (bestSentence) {
      // Highlight query terms
      let snippet = bestSentence.trim();
      for (const term of queryTerms) {
        const regex = new RegExp(`(${term})`, 'gi');
        snippet = snippet.replace(regex, '<mark>$1</mark>');
      }
      return snippet.substring(0, 200) + (snippet.length > 200 ? '...' : '');
    }
    
    return content.substring(0, 150) + '...';
  }

  private async enhanceResultsWithAI(results: SearchResult[], query: SearchQuery): Promise<SearchResult[]> {
    try {
      // AI-powered result enhancement
      // 1. Semantic similarity scoring
      // 2. Intent detection
      // 3. Result clustering
      // 4. Personalization (if user context available)
      
      // Mock AI enhancement - replace with actual AI processing
      return results.map(result => ({
        ...result,
        relevanceScore: result.relevanceScore * this.getTypeBoost(result.type, query.query),
      }));
    } catch (error) {
      console.error('Error enhancing results with AI:', error);
      return results;
    }
  }

  private getTypeBoost(type: SearchResult['type'], query: string): number {
    const queryLower = query.toLowerCase();
    
    // Boost based on query intent
    if (type === 'news' && (queryLower.includes('notícia') || queryLower.includes('actualitat'))) return 1.3;
    if (type === 'bopa' && (queryLower.includes('llei') || queryLower.includes('decret'))) return 1.3;
    if (type === 'real-estate' && (queryLower.includes('casa') || queryLower.includes('pis') || queryLower.includes('lloguer'))) return 1.3;
    if (type === 'job' && (queryLower.includes('feina') || queryLower.includes('treball') || queryLower.includes('contracte'))) return 1.3;
    
    return 1.0;
  }

  private sortAndLimitResults(results: SearchResult[], query: SearchQuery): SearchResult[] {
    // Sort results
    const sortBy = query.sortBy || 'relevance';
    const sortOrder = query.sortOrder || 'desc';
    
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          comparison = a.relevanceScore - b.relevanceScore;
          break;
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'source':
          comparison = a.source.localeCompare(b.source);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 20;
    
    return results.slice(offset, offset + limit);
  }

  private buildSearchResponse(results: SearchResult[], startTime: number, query: SearchQuery): {
    results: SearchResult[];
    facets: SearchFacets;
    stats: SearchStats;
  } {
    const searchTime = Date.now() - startTime;
    
    // Build facets
    const facets: SearchFacets = {
      types: this.buildTypeFacet(results),
      sources: this.buildSourceFacet(results),
      dates: this.buildDateFacets(results),
      categories: this.buildCategoryFacets(results),
    };
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(query.query);
    
    return {
      results,
      facets,
      stats: {
        totalResults: results.length,
        searchTime,
        suggestions,
        didYouMean: this.generateDidYouMean(query.query),
      },
    };
  }

  private buildTypeFacet(results: SearchResult[]): { type: string; count: number }[] {
    const counts = new Map<string, number>();
    
    for (const result of results) {
      const value = String(result.type);
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    
    return Array.from(counts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }

  private buildSourceFacet(results: SearchResult[]): { source: string; count: number }[] {
    const counts = new Map<string, number>();
    
    for (const result of results) {
      const value = String(result.source);
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    
    return Array.from(counts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  }

  private buildDateFacets(results: SearchResult[]): { period: string; count: number }[] {
    const now = new Date();
    const periods = {
      'Última hora': new Date(now.getTime() - 60 * 60 * 1000),
      'Avui': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      'Aquesta setmana': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      'Aquest mes': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    };
    
    const counts: { period: string; count: number }[] = [];
    
    for (const [period, cutoff] of Object.entries(periods)) {
      const count = results.filter(r => r.date >= cutoff).length;
      if (count > 0) {
        counts.push({ period, count });
      }
    }
    
    return counts;
  }

  private buildCategoryFacets(results: SearchResult[]): { category: string; count: number }[] {
    const counts = new Map<string, number>();
    
    for (const result of results) {
      const category = result.metadata?.category || result.metadata?.type || 'General';
      counts.set(category, (counts.get(category) || 0) + 1);
    }
    
    return Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private generateSuggestions(query: string): string[] {
    // Mock suggestions - replace with actual suggestion logic
    const commonSuggestions = [
      'notícies andorra',
      'feina tecnologia',
      'pisos lloguer',
      'lleis BOPA',
      'restaurants escaldes',
      'turisme andorra',
    ];
    
    return commonSuggestions
      .filter(suggestion => !suggestion.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3);
  }

  private generateDidYouMean(query: string): string | undefined {
    // Mock spell correction - replace with actual spell checker
    const corrections: Record<string, string> = {
      'noticias': 'notícies',
      'trabajo': 'feina',
      'alquiler': 'lloguer',
      'casa': 'casa',
    };
    
    const words = query.toLowerCase().split(/\s+/);
    let hasCorrection = false;
    const correctedWords = words.map(word => {
      if (corrections[word]) {
        hasCorrection = true;
        return corrections[word];
      }
      return word;
    });
    
    return hasCorrection ? correctedWords.join(' ') : undefined;
  }

  private generateCacheKey(query: SearchQuery): string {
    return JSON.stringify({
      query: query.query,
      types: query.types?.sort(),
      sources: query.sources?.sort(),
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  async getPopularSearches(): Promise<string[]> {
    // Mock popular searches - replace with actual analytics
    return [
      'feina tecnologia',
      'pisos andorra la vella',
      'notícies economia',
      'restaurants escaldes',
      'lleis fiscals',
      'teletreball andorra',
      'cursos formació',
      'turisme activitats',
    ];
  }

  async getSearchTrends(): Promise<{ term: string; trend: 'up' | 'down' | 'stable'; count: number }[]> {
    // Mock trends - replace with actual analytics
    return [
      { term: 'teletreball', trend: 'up', count: 150 },
      { term: 'sostenibilitat', trend: 'up', count: 120 },
      { term: 'immobiliària', trend: 'stable', count: 300 },
      { term: 'turisme', trend: 'down', count: 80 },
    ];
  }

  clearCache(): void {
    this.searchHistory.clear();
    console.log('Search cache cleared');
  }
}

// Export singleton instance
export const universalSearchService = UniversalSearchService.getInstance();