import { prisma } from './prisma.js';
import { rateLimit } from './rate-limit.js';

export interface BOPADocument {
  id: string;
  numero: string;
  fecha: Date;
  titulo: string;
  contenido: string;
  seccion: string;
  tipo: 'llei' | 'decret' | 'resolucio' | 'anunci' | 'altres';
  url: string;
  pdfUrl?: string;
  extractedText?: string;
  keywords: string[];
  language: 'ca';
  createdAt: Date;
  updatedAt: Date;
}

export interface BOPASearchQuery {
  text?: string;
  tipo?: string;
  seccion?: string;
  fechaDesde?: Date;
  fechaFins?: Date;
  limit?: number;
  offset?: number;
}

export class BOPAService {
  private static instance: BOPAService;
  private baseUrl = 'https://www.bopa.ad';
  private rateLimiter = rateLimit({ limit: 30, windowSec: 60 }); // 30 requests per minute

  static getInstance(): BOPAService {
    if (!BOPAService.instance) {
      BOPAService.instance = new BOPAService();
    }
    return BOPAService.instance;
  }

  async scrapeLatestBOPA(): Promise<{ success: number; errors: number }> {
    let success = 0;
    let errors = 0;

    try {
      console.log('🔄 Starting BOPA scraping...');

      // Rate limiting
      const rateCheck = await this.rateLimiter('bopa-scraper');
      if (!rateCheck.ok) {
        console.warn('Rate limit exceeded, skipping BOPA scraping');
        return { success: 0, errors: 1 };
      }

      // Get latest BOPA numbers
      const latestNumbers = await this.getLatestBOPANumbers();
      
      for (const numero of latestNumbers) {
        try {
          const documents = await this.scrapeBOPAByNumber(numero);
          
          for (const doc of documents) {
            try {
              await this.saveBOPADocument(doc);
              success++;
            } catch (error) {
              console.error(`Error saving BOPA document ${doc.id}:`, error);
              errors++;
            }
          }
          
          // Respect rate limiting between requests
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Error scraping BOPA ${numero}:`, error);
          errors++;
        }
      }

      console.log(`✅ BOPA scraping complete: ${success} saved, ${errors} errors`);
      return { success, errors };
    } catch (error) {
      console.error('Error in BOPA scraping:', error);
      return { success, errors: errors + 1 };
    }
  }

  private async getLatestBOPANumbers(): Promise<string[]> {
    try {
      // Mock implementation - in production, scrape from BOPA index
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      // Generate likely BOPA numbers for current month
      const numbers: string[] = [];
      for (let i = 1; i <= 10; i++) {
        const numero = `${currentYear}${currentMonth.toString().padStart(2, '0')}${i.toString().padStart(2, '0')}`;
        numbers.push(numero);
      }
      
      return numbers.slice(0, 5); // Limit to 5 latest
    } catch (error) {
      console.error('Error getting latest BOPA numbers:', error);
      return [];
    }
  }

  private async scrapeBOPAByNumber(numero: string): Promise<BOPADocument[]> {
    try {
      const url = `${this.baseUrl}/bopa/${numero}`;
      
      // Mock fetch - replace with actual HTTP request
      const response = await this.mockFetchBOPA(numero);
      
      return this.parseBOPAResponse(response, numero);
    } catch (error) {
      console.error(`Error scraping BOPA ${numero}:`, error);
      return [];
    }
  }

  private async mockFetchBOPA(numero: string): Promise<string> {
    // Mock HTML response - replace with actual fetch
    return `
      <html>
        <body>
          <div class="bopa-document">
            <h2>BOPA ${numero} - ${new Date().toLocaleDateString('ca-AD')}</h2>
            <div class="section" data-section="legislacio">
              <h3>LEGISLACIÓ</h3>
              <div class="document" data-type="llei">
                <h4>Llei 15/2024 de modernització digital</h4>
                <p>Exposició de motius: La present llei té per objecte...</p>
                <a href="/pdf/llei-15-2024.pdf">Descarregar PDF</a>
              </div>
            </div>
            <div class="section" data-section="anuncis">
              <h3>ANUNCIS</h3>
              <div class="document" data-type="anunci">
                <h4>Convocatòria concurs públic obres</h4>
                <p>S'anuncia la convocatòria del concurs públic...</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private parseBOPAResponse(html: string, numero: string): BOPADocument[] {
    const documents: BOPADocument[] = [];
    
    try {
      // Simple HTML parsing - in production use cheerio or similar
      const documentMatches = html.match(/<div class="document"[^>]*>[\s\S]*?<\/div>/gi) || [];
      
      for (const docHtml of documentMatches) {
        const titulo = this.extractContent(docHtml, 'h4');
        const contenido = this.extractContent(docHtml, 'p');
        const tipo = this.extractAttribute(docHtml, 'data-type') as BOPADocument['tipo'] || 'altres';
        const seccion = this.extractParentSection(html, docHtml);
        const pdfUrl = this.extractPDFUrl(docHtml);
        
        if (titulo) {
          documents.push({
            id: this.generateBOPAId(numero, titulo),
            numero,
            fecha: this.parseBOPADate(numero),
            titulo: this.cleanText(titulo),
            contenido: this.cleanText(contenido),
            seccion,
            tipo,
            url: `${this.baseUrl}/bopa/${numero}`,
            pdfUrl,
            keywords: this.extractKeywords(titulo + ' ' + contenido),
            language: 'ca' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Error parsing BOPA response:', error);
    }
    
    return documents;
  }

  private extractContent(html: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = html.match(regex);
    return match ? match[1].trim() : '';
  }

  private extractAttribute(html: string, attr: string): string {
    const regex = new RegExp(`${attr}="([^"]*)"`, 'i');
    const match = html.match(regex);
    return match ? match[1] : '';
  }

  private extractParentSection(fullHtml: string, docHtml: string): string {
    const docIndex = fullHtml.indexOf(docHtml);
    const beforeDoc = fullHtml.substring(0, docIndex);
    const sectionMatch = beforeDoc.match(/data-section="([^"]*)"[^>]*>[\s\S]*?<h3>([^<]*)<\/h3>/gi);
    
    if (sectionMatch && sectionMatch.length > 0) {
      const lastSection = sectionMatch[sectionMatch.length - 1];
      const titleMatch = lastSection.match(/<h3>([^<]*)<\/h3>/);
      return titleMatch ? titleMatch[1].trim() : 'General';
    }
    
    return 'General';
  }

  private extractPDFUrl(html: string): string | undefined {
    const linkMatch = html.match(/href="([^"]*\.pdf[^"]*)"/i);
    return linkMatch ? this.baseUrl + linkMatch[1] : undefined;
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractKeywords(text: string): string[] {
    const cleanText = this.cleanText(text).toLowerCase();
    const words = cleanText.split(/\s+/);
    const stopWords = ['el', 'la', 'de', 'en', 'i', 'a', 'que', 'és', 'es', 'se', 'no', 'per', 'amb', 'del', 'dels', 'les', 'els', 'un', 'una', 'aquest', 'aquesta'];
    
    const keywords = words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 10);
    
    return keywords;
  }

  private generateBOPAId(numero: string, titulo: string): string {
    const hash = Buffer.from(numero + titulo).toString('base64');
    return 'bopa_' + hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  }

  private parseBOPADate(numero: string): Date {
    // Parse date from BOPA number format YYYYMMDD
    if (numero.length >= 8) {
      const year = parseInt(numero.substring(0, 4));
      const month = parseInt(numero.substring(4, 6)) - 1; // Month is 0-indexed
      const day = parseInt(numero.substring(6, 8));
      return new Date(year, month, day);
    }
    return new Date();
  }

  private async saveBOPADocument(doc: BOPADocument): Promise<void> {
    try {
      await prisma.bopaDocument.upsert({
        where: { id: doc.id },
        create: {
          id: doc.id,
          numero: doc.numero,
          fecha: doc.fecha,
          titulo: doc.titulo,
          contenido: doc.contenido,
          seccion: doc.seccion,
          tipo: doc.tipo,
          url: doc.url,
          pdfUrl: doc.pdfUrl,
          extractedText: doc.extractedText,
          keywords: doc.keywords,
          language: doc.language,
        },
        update: {
          titulo: doc.titulo,
          contenido: doc.contenido,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.warn('Database unavailable for BOPA, using memory cache:', error);
      // In production, implement fallback storage
    }
  }

  async searchBOPA(query: BOPASearchQuery): Promise<BOPADocument[]> {
    try {
      const where: any = {};
      
      if (query.text) {
        where.OR = [
          { titulo: { contains: query.text, mode: 'insensitive' } },
          { contenido: { contains: query.text, mode: 'insensitive' } },
          { keywords: { hasSome: [query.text.toLowerCase()] } },
        ];
      }
      
      if (query.tipo) where.tipo = query.tipo;
      if (query.seccion) where.seccion = { contains: query.seccion, mode: 'insensitive' };
      if (query.fechaDesde) where.fecha = { gte: query.fechaDesde };
      if (query.fechaFins) {
        where.fecha = { 
          ...where.fecha,
          lte: query.fechaFins 
        };
      }

      return await prisma.bopaDocument.findMany({
        where,
        orderBy: { fecha: 'desc' },
        take: query.limit || 20,
        skip: query.offset || 0,
      });
    } catch (error) {
      console.error('Error searching BOPA:', error);
      return [];
    }
  }

  async getBOPAByNumber(numero: string): Promise<BOPADocument[]> {
    try {
      return await prisma.bopaDocument.findMany({
        where: { numero },
        orderBy: { titulo: 'asc' },
      });
    } catch (error) {
      console.error(`Error fetching BOPA ${numero}:`, error);
      return [];
    }
  }

  async getAvailableBOPANumbers(): Promise<string[]> {
    try {
      const results = await prisma.bopaDocument.findMany({
        select: { numero: true },
        distinct: ['numero'],
        orderBy: { numero: 'desc' },
        take: 50,
      });
      
      return results.map(r => r.numero);
    } catch (error) {
      console.error('Error fetching BOPA numbers:', error);
      return [];
    }
  }

  async getBOPAStats(): Promise<{
    totalDocuments: number;
    byType: Record<string, number>;
    bySection: Record<string, number>;
    recentActivity: number;
  }> {
    try {
      const totalDocuments = await prisma.bopaDocument.count();
      
      const byType = await prisma.bopaDocument.groupBy({
        by: ['tipo'],
        _count: { tipo: true },
      });
      
      const bySection = await prisma.bopaDocument.groupBy({
        by: ['seccion'],
        _count: { seccion: true },
      });
      
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentActivity = await prisma.bopaDocument.count({
        where: { createdAt: { gte: weekAgo } },
      });
      
      return {
        totalDocuments,
        byType: Object.fromEntries(byType.map(t => [t.tipo, t._count.tipo])),
        bySection: Object.fromEntries(bySection.map(s => [s.seccion, s._count.seccion])),
        recentActivity,
      };
    } catch (error) {
      console.error('Error fetching BOPA stats:', error);
      return {
        totalDocuments: 0,
        byType: {},
        bySection: {},
        recentActivity: 0,
      };
    }
  }
}

// Export singleton instance
export const bopaService = BOPAService.getInstance();