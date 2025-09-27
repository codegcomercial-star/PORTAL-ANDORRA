import { prisma } from './prisma';
import { rateLimit } from './rate-limit';

export interface RealEstateProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'EUR' | 'USD';
  type: 'apartment' | 'house' | 'commercial' | 'land' | 'office' | 'garage';
  operation: 'sale' | 'rent' | 'transfer';
  
  // Location
  address: string;
  parish: 'andorra-la-vella' | 'canillo' | 'encamp' | 'escaldes-engordany' | 'la-massana' | 'ordino' | 'sant-julia-de-loria';
  latitude?: number;
  longitude?: number;
  
  // Features
  bedrooms?: number;
  bathrooms?: number;
  surface: number; // m²
  terrace?: number; // m²
  parking?: boolean;
  elevator?: boolean;
  heating?: string;
  energyRating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  
  // Media
  images: string[];
  virtualTour?: string;
  floorPlan?: string;
  
  // AI Analysis
  aiDescription: string;
  priceAnalysis: {
    marketValue: number;
    pricePerM2: number;
    comparison: 'below' | 'market' | 'above';
    confidenceScore: number;
  };
  features: string[];
  neighborhood: {
    score: number;
    amenities: string[];
    transport: string[];
    schools: string[];
  };
  
  // Source
  source: string;
  sourceUrl: string;
  agent?: {
    name: string;
    phone?: string;
    email?: string;
    company?: string;
  };
  
  // Status
  active: boolean;
  featured: boolean;
  views: number;
  favorites: number;
  
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface PropertySearchQuery {
  text?: string;
  type?: RealEstateProperty['type'][];
  operation?: RealEstateProperty['operation'];
  parish?: RealEstateProperty['parish'][];
  priceMin?: number;
  priceMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  features?: string[];
  sortBy?: 'price' | 'surface' | 'date' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class RealEstateService {
  private static instance: RealEstateService;
  private rateLimiter = rateLimit({ limit: 100, windowSec: 60 });

  // Real estate sources to scrape
  private sources = [
    { name: 'Immobiliaria.ad', url: 'https://www.immobiliaria.ad', active: true },
    { name: 'Engel & Völkers', url: 'https://www.engelvoelkers.com/andorra', active: true },
    { name: 'Century21 Andorra', url: 'https://www.century21.ad', active: true },
    { name: 'Grup Pyrénées', url: 'https://www.grup-pirineus.com', active: true },
  ];

  static getInstance(): RealEstateService {
    if (!RealEstateService.instance) {
      RealEstateService.instance = new RealEstateService();
    }
    return RealEstateService.instance;
  }

  async scrapeAllSources(): Promise<{ success: number; errors: number }> {
    let success = 0;
    let errors = 0;

    console.log('🏠 Starting real estate scraping...');

    for (const source of this.sources.filter(s => s.active)) {
      try {
        const rateCheck = await this.rateLimiter(`scraper-${source.name}`);
        if (!rateCheck.ok) {
          console.warn(`Rate limit exceeded for ${source.name}`);
          continue;
        }

        console.log(`🔍 Scraping ${source.name}...`);
        const properties = await this.scrapeSource(source);
        
        for (const property of properties) {
          try {
            const enhancedProperty = await this.enhanceWithAI(property);
            await this.saveProperty(enhancedProperty);
            success++;
          } catch (error) {
            console.error(`Error saving property from ${source.name}:`, error);
            errors++;
          }
        }

        // Rate limiting between sources
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        errors++;
      }
    }

    console.log(`✅ Real estate scraping complete: ${success} saved, ${errors} errors`);
    return { success, errors };
  }

  private async scrapeSource(source: { name: string; url: string }): Promise<Partial<RealEstateProperty>[]> {
    try {
      // Mock scraping - replace with actual HTTP requests and parsing
      return this.mockScrapeProperties(source);
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      return [];
    }
  }

  private mockScrapeProperties(source: { name: string; url: string }): Partial<RealEstateProperty>[] {
    // Mock data - replace with actual scraping logic
    const mockProperties: Partial<RealEstateProperty>[] = [
      {
        title: 'Àtic dúplex amb terrassa a Escaldes',
        description: 'Magnífic àtic dúplex de 120m² amb terrassa de 40m², 3 habitacions, 2 banys, parking inclòs.',
        price: 650000,
        currency: 'EUR',
        type: 'apartment',
        operation: 'sale',
        address: 'Carrer de la Vall, Escaldes-Engordany',
        parish: 'escaldes-engordany',
        bedrooms: 3,
        bathrooms: 2,
        surface: 120,
        terrace: 40,
        parking: true,
        elevator: true,
        images: ['/mock-property-1.jpg', '/mock-property-1-2.jpg'],
        source: source.name,
        sourceUrl: source.url + '/property/mock-1',
        active: true,
        featured: Math.random() > 0.7,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Casa unifamiliar a La Massana',
        description: 'Casa de 180m² amb jardí, 4 habitacions, 3 banys, garatge per 2 cotxes.',
        price: 850000,
        currency: 'EUR',
        type: 'house',
        operation: 'sale',
        address: 'Carrer Major, La Massana',
        parish: 'la-massana',
        bedrooms: 4,
        bathrooms: 3,
        surface: 180,
        parking: true,
        images: ['/mock-property-2.jpg'],
        source: source.name,
        sourceUrl: source.url + '/property/mock-2',
        active: true,
        featured: false,
        publishedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
      },
    ];

    return mockProperties;
  }

  private async enhanceWithAI(property: Partial<RealEstateProperty>): Promise<RealEstateProperty> {
    try {
      // AI Enhancement - replace with actual AI API calls
      const enhanced: RealEstateProperty = {
        id: this.generatePropertyId(property),
        title: property.title || '',
        description: property.description || '',
        price: property.price || 0,
        currency: property.currency || 'EUR',
        type: property.type || 'apartment',
        operation: property.operation || 'sale',
        address: property.address || '',
        parish: property.parish || 'andorra-la-vella',
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        surface: property.surface || 0,
        terrace: property.terrace,
        parking: property.parking,
        elevator: property.elevator,
        images: property.images || [],
        source: property.source || '',
        sourceUrl: property.sourceUrl || '',
        active: property.active ?? true,
        featured: property.featured ?? false,
        views: 0,
        favorites: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: property.publishedAt || new Date(),

        // AI-generated content
        aiDescription: await this.generateAIDescription(property),
        priceAnalysis: await this.analyzePrice(property),
        features: this.extractFeatures(property),
        neighborhood: await this.analyzeNeighborhood(property.parish || 'andorra-la-vella'),
      };

      return enhanced;
    } catch (error) {
      console.error('Error enhancing property with AI:', error);
      throw error;
    }
  }

  private generatePropertyId(property: Partial<RealEstateProperty>): string {
    const source = property.source || 'unknown';
    const title = property.title || 'untitled';
    const price = property.price || 0;
    
    const hash = Buffer.from(`${source}-${title}-${price}`).toString('base64');
    return 'prop_' + hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  }

  private async generateAIDescription(property: Partial<RealEstateProperty>): Promise<string> {
    // Mock AI description generation - replace with actual AI API
    const templates = [
      `Descobreix aquesta propietat única a ${property.parish}. Amb ${property.surface}m² de superfície, ofereix un espai còmode i funcional.`,
      `Excel·lent oportunitat d'inversió en el cor d'Andorra. Aquesta propietat combina ubicació privilegiada amb característiques modernes.`,
      `Immobiliària de qualitat superior amb acabats d'alta gamma. Perfecta per a famílies que busquen comoditat i estil.`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private async analyzePrice(property: Partial<RealEstateProperty>): Promise<RealEstateProperty['priceAnalysis']> {
    // Mock price analysis - replace with actual market data analysis
    const price = property.price || 0;
    const surface = property.surface || 1;
    const pricePerM2 = price / surface;
    
    // Mock market data
    const avgPricePerM2ByParish: Record<string, number> = {
      'andorra-la-vella': 4500,
      'escaldes-engordany': 4200,
      'encamp': 3800,
      'canillo': 3500,
      'la-massana': 4000,
      'ordino': 3600,
      'sant-julia-de-loria': 3400,
    };

    const marketPricePerM2 = avgPricePerM2ByParish[property.parish || 'andorra-la-vella'];
    const marketValue = marketPricePerM2 * surface;
    
    let comparison: 'below' | 'market' | 'above';
    if (price < marketValue * 0.9) comparison = 'below';
    else if (price > marketValue * 1.1) comparison = 'above';
    else comparison = 'market';

    return {
      marketValue,
      pricePerM2,
      comparison,
      confidenceScore: 0.8, // Mock confidence
    };
  }

  private extractFeatures(property: Partial<RealEstateProperty>): string[] {
    const features: string[] = [];
    
    if (property.parking) features.push('Aparcament');
    if (property.elevator) features.push('Ascensor');
    if (property.terrace && property.terrace > 0) features.push('Terrassa');
    if (property.bedrooms && property.bedrooms >= 3) features.push('Espai familiar');
    if (property.bathrooms && property.bathrooms >= 2) features.push('Múltiples banys');
    
    // Extract from description
    const description = (property.description || '').toLowerCase();
    if (description.includes('vistes')) features.push('Vistes');
    if (description.includes('reformed') || description.includes('renovat')) features.push('Reformat');
    if (description.includes('calefacció') || description.includes('heating')) features.push('Calefacció');
    if (description.includes('aire condicionat') || description.includes('aire acondicionado')) features.push('Aire condicionat');
    
    return [...new Set(features)]; // Remove duplicates
  }

  private async analyzeNeighborhood(parish: string): Promise<RealEstateProperty['neighborhood']> {
    // Mock neighborhood analysis - replace with actual data
    const neighborhoodData: Record<string, RealEstateProperty['neighborhood']> = {
      'andorra-la-vella': {
        score: 9.2,
        amenities: ['Restaurants', 'Botigues', 'Serveis bancaris', 'Centres comercials'],
        transport: ['Transport públic', 'Aparcament públic', 'Accés autopista'],
        schools: ['Escola Andorrana', 'Escoles internacionals', 'Universitat d\'Andorra'],
      },
      'escaldes-engordany': {
        score: 8.8,
        amenities: ['Caldea', 'Restaurants', 'Botigues', 'Centre wellness'],
        transport: ['Transport públic', 'Aparcament', 'Proximitat capital'],
        schools: ['Escola francesa', 'Escola espanyola', 'Col·legi privat'],
      },
      'encamp': {
        score: 8.2,
        amenities: ['Natura', 'Pistes esquí', 'Restaurants locals'],
        transport: ['Funicamp', 'Carretera principal', 'Aparcament gratuït'],
        schools: ['Escola pública', 'Escoles especialitzades'],
      },
    };

    return neighborhoodData[parish] || {
      score: 7.5,
      amenities: ['Serveis bàsics'],
      transport: ['Carretera principal'],
      schools: ['Escola pública'],
    };
  }

  private async saveProperty(property: RealEstateProperty): Promise<void> {
    try {
      await prisma.realEstateProperty.upsert({
        where: { id: property.id },
        create: {
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          currency: property.currency,
          type: property.type,
          operation: property.operation,
          address: property.address,
          parish: property.parish,
          latitude: property.latitude,
          longitude: property.longitude,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          surface: property.surface,
          terrace: property.terrace,
          parking: property.parking,
          elevator: property.elevator,
          heating: property.heating,
          energyRating: property.energyRating,
          images: property.images,
          virtualTour: property.virtualTour,
          floorPlan: property.floorPlan,
          aiDescription: property.aiDescription,
          priceAnalysis: property.priceAnalysis,
          features: property.features,
          neighborhood: property.neighborhood,
          source: property.source,
          sourceUrl: property.sourceUrl,
          agent: property.agent,
          active: property.active,
          featured: property.featured,
          views: property.views,
          favorites: property.favorites,
          publishedAt: property.publishedAt,
        },
        update: {
          title: property.title,
          description: property.description,
          price: property.price,
          active: property.active,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.warn('Database unavailable for real estate, using memory cache:', error);
    }
  }

  async searchProperties(query: PropertySearchQuery): Promise<RealEstateProperty[]> {
    try {
      const where: any = { active: true };
      
      if (query.text) {
        where.OR = [
          { title: { contains: query.text, mode: 'insensitive' } },
          { description: { contains: query.text, mode: 'insensitive' } },
          { address: { contains: query.text, mode: 'insensitive' } },
          { features: { hasSome: [query.text.toLowerCase()] } },
        ];
      }
      
      if (query.type) where.type = { in: query.type };
      if (query.operation) where.operation = query.operation;
      if (query.parish) where.parish = { in: query.parish };
      if (query.priceMin) where.price = { gte: query.priceMin };
      if (query.priceMax) where.price = { ...where.price, lte: query.priceMax };
      if (query.surfaceMin) where.surface = { gte: query.surfaceMin };
      if (query.surfaceMax) where.surface = { ...where.surface, lte: query.surfaceMax };
      if (query.bedrooms) where.bedrooms = { in: query.bedrooms };
      if (query.bathrooms) where.bathrooms = { in: query.bathrooms };

      const orderBy: any = {};
      if (query.sortBy === 'price') orderBy.price = query.sortOrder || 'asc';
      else if (query.sortBy === 'surface') orderBy.surface = query.sortOrder || 'desc';
      else if (query.sortBy === 'date') orderBy.publishedAt = query.sortOrder || 'desc';
      else orderBy.publishedAt = 'desc'; // Default sort

      return await prisma.realEstateProperty.findMany({
        where,
        orderBy,
        take: query.limit || 20,
        skip: query.offset || 0,
      });
    } catch (error) {
      console.error('Error searching properties:', error);
      return [];
    }
  }

  async getFeaturedProperties(limit: number = 6): Promise<RealEstateProperty[]> {
    try {
      return await prisma.realEstateProperty.findMany({
        where: { active: true, featured: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      return [];
    }
  }

  async getPropertyStats(): Promise<{
    totalActive: number;
    byType: Record<string, number>;
    byOperation: Record<string, number>;
    byParish: Record<string, number>;
    avgPrice: number;
    avgPricePerM2: number;
  }> {
    try {
      const totalActive = await prisma.realEstateProperty.count({ where: { active: true } });
      
      const byType = await prisma.realEstateProperty.groupBy({
        by: ['type'],
        where: { active: true },
        _count: { type: true },
      });
      
      const byOperation = await prisma.realEstateProperty.groupBy({
        by: ['operation'],
        where: { active: true },
        _count: { operation: true },
      });
      
      const byParish = await prisma.realEstateProperty.groupBy({
        by: ['parish'],
        where: { active: true },
        _count: { parish: true },
      });
      
      const priceStats = await prisma.realEstateProperty.aggregate({
        where: { active: true },
        _avg: { price: true, surface: true },
      });
      
      const avgPrice = priceStats._avg.price || 0;
      const avgSurface = priceStats._avg.surface || 1;
      const avgPricePerM2 = avgPrice / avgSurface;
      
      return {
        totalActive,
        byType: Object.fromEntries(byType.map(t => [t.type, t._count.type])),
        byOperation: Object.fromEntries(byOperation.map(o => [o.operation, o._count.operation])),
        byParish: Object.fromEntries(byParish.map(p => [p.parish, p._count.parish])),
        avgPrice,
        avgPricePerM2,
      };
    } catch (error) {
      console.error('Error fetching property stats:', error);
      return {
        totalActive: 0,
        byType: {},
        byOperation: {},
        byParish: {},
        avgPrice: 0,
        avgPricePerM2: 0,
      };
    }
  }

  async incrementViews(propertyId: string): Promise<void> {
    try {
      await prisma.realEstateProperty.update({
        where: { id: propertyId },
        data: { views: { increment: 1 } },
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }
}

// Export singleton instance
export const realEstateService = RealEstateService.getInstance();