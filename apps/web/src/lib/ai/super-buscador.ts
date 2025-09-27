// Super Buscador IA - Core Library
import { OpenAI } from 'openai';
import { HfInference } from '@huggingface/inference';
import Anthropic from '@anthropic-ai/sdk';
import sentiment from 'sentiment';
import { franc } from 'franc';
import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';

// Configuración de APIs de IA
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Limitador de concurrencia
const limit = pLimit(5);

export interface SearchResult {
  query: string;
  results: Array<{
    title: string;
    url: string;
    content: string;
    relevanceScore: number;
  }>;
  aiAnalysis: {
    summary: string;
    sentiment: string;
    language: string;
    keywords: string[];
  };
  metadata: {
    totalResults: number;
    searchTime: number;
    aiProcessingTime: number;
  };
}

export class SuperBuscadorIA {
  private sentimentAnalyzer = new sentiment();

  async search(query: string, options: {
    limit?: number;
    includeAI?: boolean;
    sources?: string[];
  } = {}): Promise<SearchResult> {
    const startTime = Date.now();
    
    const { 
      limit: resultLimit = 10, 
      includeAI = true,
      sources = ['web', 'news']
    } = options;

    try {
      // 1. Realizar búsqueda web básica
      const searchResults = await this.performWebSearch(query, resultLimit);
      
      // 2. Análisis de IA (si está habilitado)
      let aiAnalysis = null;
      const aiStartTime = Date.now();
      
      if (includeAI) {
        aiAnalysis = await this.performAIAnalysis(query, searchResults);
      }
      
      const aiProcessingTime = Date.now() - aiStartTime;
      const totalTime = Date.now() - startTime;

      return {
        query,
        results: searchResults,
        aiAnalysis: aiAnalysis || {
          summary: 'Análisis de IA deshabilitado',
          sentiment: 'neutral',
          language: this.detectLanguage(query),
          keywords: []
        },
        metadata: {
          totalResults: searchResults.length,
          searchTime: totalTime,
          aiProcessingTime
        }
      };
    } catch (error) {
      console.error('Error en Super Buscador IA:', error);
      throw new Error('Error al realizar la búsqueda');
    }
  }

  private async performWebSearch(query: string, limit: number) {
    // Simulación de búsqueda web - en producción conectar con APIs reales
    // Como DuckDuckGo, Bing Search API, Google Custom Search, etc.
    
    const mockResults = [
      {
        title: `Resultados para: ${query}`,
        url: 'https://example.com/result1',
        content: `Contenido relacionado con ${query}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        relevanceScore: 0.95
      },
      {
        title: `Información sobre ${query}`,
        url: 'https://example.com/result2', 
        content: `Más información detallada sobre ${query}. Sed do eiusmod tempor incididunt ut labore.`,
        relevanceScore: 0.87
      }
    ];

    return mockResults.slice(0, limit);
  }

  private async performAIAnalysis(query: string, results: any[]) {
    const combinedContent = results.map(r => r.content).join('\n\n');
    
    // Análisis de sentimiento
    const sentimentResult = this.sentimentAnalyzer.analyze(query + ' ' + combinedContent);
    const sentimentLabel = sentimentResult.score > 0 ? 'positive' : 
                          sentimentResult.score < 0 ? 'negative' : 'neutral';

    // Detección de idioma
    const language = this.detectLanguage(query);

    // Generar resumen con IA (usando OpenAI como ejemplo)
    let summary = 'Resumen no disponible';
    let keywords: string[] = [];

    try {
      if (process.env.OPENAI_API_KEY) {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Analiza esta consulta y resultados de búsqueda. 
            Consulta: "${query}"
            Resultados: ${combinedContent}
            
            Proporciona:
            1. Un resumen breve (máximo 150 palabras)
            2. 5 palabras clave principales separadas por comas`
          }],
          max_tokens: 300,
          temperature: 0.7
        });

        const aiResponse = completion.choices[0].message.content || '';
        const parts = aiResponse.split('\n');
        summary = parts.find(p => p.includes('resumen') || p.includes('Resumen')) || aiResponse.substring(0, 150);
        
        const keywordLine = parts.find(p => p.includes('palabras clave') || p.includes('keywords'));
        if (keywordLine) {
          keywords = keywordLine.split(':')[1]?.split(',').map(k => k.trim()) || [];
        }
      }
    } catch (error) {
      console.error('Error en análisis OpenAI:', error);
    }

    return {
      summary,
      sentiment: sentimentLabel,
      language,
      keywords
    };
  }

  private detectLanguage(text: string): string {
    try {
      const langCode = franc(text);
      const languageMap: { [key: string]: string } = {
        'spa': 'Spanish',
        'eng': 'English', 
        'cat': 'Catalan',
        'fra': 'French',
        'und': 'Unknown'
      };
      return languageMap[langCode] || 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  // Método para análisis de sentimiento específico
  async analyzeSentiment(text: string) {
    const result = this.sentimentAnalyzer.analyze(text);
    return result;
  }

  // Método para scraping de URL específica
  async scrapeUrl(url: string) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': process.env.USER_AGENT || 'SuperBuscadorIA/1.0'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      return {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content') || '',
        content: $('body').text().substring(0, 1000),
        url
      };
    } catch (error) {
      throw new Error(`Error scraping URL: ${url}`);
    }
  }
}

export default SuperBuscadorIA;