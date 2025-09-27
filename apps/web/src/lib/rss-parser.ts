import { parseStringPromise } from 'xml2js';

interface RSSItem {
  title: string[];
  description: string[];
  link: string[];
  pubDate: string[];
  category?: string[];
  'media:content'?: Array<{
    $: {
      url: string;
      type: string;
    };
  }>;
  enclosure?: Array<{
    $: {
      url: string;
      type: string;
    };
  }>;
}

interface RSSFeed {
  rss?: {
    channel: Array<{
      item: RSSItem[];
    }>;
  };
  feed?: {
    entry: Array<{
      title: Array<{ _: string }>;
      summary: Array<{ _: string }>;
      link: Array<{ $: { href: string } }>;
      published: string[];
    }>;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}

// Fuentes RSS de medios andorranos
const RSS_SOURCES = [
  {
    name: 'Diari d\'Andorra',
    url: 'https://www.diarideandorra.ad/rss',
    domain: 'diarideandorra.ad'
  },
  {
    name: 'Bondia',
    url: 'https://bondia.ad/rss',
    domain: 'bondia.ad'
  },
  {
    name: 'El Periòdic d\'Andorra',
    url: 'https://www.elperiodic.ad/rss',
    domain: 'elperiodic.ad'
  },
  {
    name: 'Ara Andorra',
    url: 'https://www.ara.ad/rss',
    domain: 'ara.ad'
  }
];

// Categorización automática basada en palabras clave
const categorizeNews = (title: string, description: string): string => {
  const content = `${title} ${description}`.toLowerCase();
  
  if (content.includes('fiscal') || content.includes('impuesto') || content.includes('tributario') || 
      content.includes('hacienda') || content.includes('iva') || content.includes('irpf')) {
    return 'Fiscal';
  }
  
  if (content.includes('criptomon') || content.includes('blockchain') || content.includes('fintech') || 
      content.includes('digital') || content.includes('tecnología financiera') || content.includes('bitcoin')) {
    return 'Fintech';
  }
  
  if (content.includes('económ') || content.includes('pib') || content.includes('crecimiento') || 
      content.includes('inversión') || content.includes('comercio') || content.includes('empresas')) {
    return 'Economía';
  }
  
  if (content.includes('banco') || content.includes('financiero') || content.includes('crédito') || 
      content.includes('préstamo') || content.includes('banca') || content.includes('euribor')) {
    return 'Finanzas';
  }
  
  if (content.includes('turismo') || content.includes('esquí') || content.includes('hotel') || 
      content.includes('visitantes') || content.includes('temporada')) {
    return 'Turismo';
  }
  
  return 'General';
};

// Función para extraer imagen de la descripción HTML
const extractImageFromDescription = (description: string): string | null => {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = description.match(imgRegex);
  return match ? match[1] : null;
};

// Parsear feed RSS individual
async function parseRSSFeed(source: typeof RSS_SOURCES[0]): Promise<NewsItem[]> {
  try {
    console.log(`Fetching RSS from ${source.name}...`);
    
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Portal-Andorra-RSS-Reader/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      next: { revalidate: 1800 } // Cache por 30 minutos
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${source.url}`);
    }

    const xmlText = await response.text();
    const parsedData: RSSFeed = await parseStringPromise(xmlText);

    let items: RSSItem[] = [];
    
    // Manejar formato RSS estándar
    if (parsedData.rss?.channel?.[0]?.item) {
      items = parsedData.rss.channel[0].item;
    }
    // Manejar formato Atom
    else if (parsedData.feed?.entry) {
      // Convertir formato Atom a RSS-like
      items = parsedData.feed.entry.map(entry => ({
        title: [entry.title?.[0]?._ || ''],
        description: [entry.summary?.[0]?._ || ''],
        link: [entry.link?.[0]?.$?.href || ''],
        pubDate: entry.published || ['']
      }));
    }

    if (!items || items.length === 0) {
      console.warn(`No items found in RSS feed for ${source.name}`);
      return [];
    }

    console.log(`Found ${items.length} items in ${source.name}`);

    return items
      .filter(item => item.title?.[0] && item.link?.[0]) // Filtrar items válidos
      .slice(0, 10) // Limitar a 10 items por fuente
      .map((item, index) => {
        const title = item.title[0];
        const description = item.description?.[0] || '';
        const cleanDescription = description.replace(/<[^>]*>/g, '').trim(); // Remover HTML
        
        // Extraer imagen de diferentes fuentes
        let imageUrl: string | null = null;
        
        // Buscar en media:content
        if (item['media:content']?.[0]?.$?.url) {
          imageUrl = item['media:content'][0].$.url;
        }
        // Buscar en enclosure
        else if (item.enclosure?.[0]?.$?.url && item.enclosure[0].$.type.startsWith('image/')) {
          imageUrl = item.enclosure[0].$.url;
        }
        // Extraer de la descripción HTML
        else {
          imageUrl = extractImageFromDescription(description);
        }

        // Fecha
        let publishedAt = new Date().toISOString();
        if (item.pubDate?.[0]) {
          try {
            publishedAt = new Date(item.pubDate[0]).toISOString();
          } catch (e) {
            console.warn(`Invalid date format: ${item.pubDate[0]}`);
          }
        }

        return {
          id: `${source.domain}-${Date.now()}-${index}`,
          title,
          description: cleanDescription,
          url: item.link[0],
          urlToImage: imageUrl,
          publishedAt,
          source: {
            name: source.name
          },
          category: categorizeNews(title, cleanDescription)
        };
      });

  } catch (error) {
    console.error(`Error parsing RSS feed for ${source.name}:`, error);
    return [];
  }
}

// Obtener todas las noticias de RSS feeds
export async function getAllRSSNews(): Promise<NewsItem[]> {
  console.log('Fetching news from all RSS sources...');
  
  try {
    // Ejecutar todas las peticiones en paralelo con timeout
    const results = await Promise.allSettled(
      RSS_SOURCES.map(source => 
        Promise.race([
          parseRSSFeed(source),
          new Promise<NewsItem[]>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
        ])
      )
    );

    // Combinar resultados exitosos
    const allNews: NewsItem[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value);
        console.log(`Successfully loaded ${result.value.length} items from ${RSS_SOURCES[index].name}`);
      } else {
        console.error(`Failed to load from ${RSS_SOURCES[index].name}:`, result.reason);
      }
    });

    // Ordenar por fecha (más reciente primero)
    return allNews.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  } catch (error) {
    console.error('Error in getAllRSSNews:', error);
    return [];
  }
}

// Función para obtener noticias mock si las RSS fallan
export function getMockAndorranNews(): NewsItem[] {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3600000);
  const twoHoursAgo = new Date(now.getTime() - 7200000);

  return [
    {
      id: 'mock-andorra-1',
      title: 'El Govern d\'Andorra aprova el pressupost del 2025',
      description: 'El Consell de Ministres ha aprovat el projecte de pressupost general per al 2025, que contempla un increment del 8% respecte a l\'exercici anterior i prioritza la inversió en infraestructures digitals.',
      url: 'https://www.govern.ad/noticia/pressupost-2025',
      urlToImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop',
      publishedAt: now.toISOString(),
      source: { name: 'Govern d\'Andorra' },
      category: 'Fiscal'
    },
    {
      id: 'mock-andorra-2',
      title: 'Nova plataforma de pagaments digitals per a comerços andorrans',
      description: 'Els bancs del Principat llancen conjuntament una plataforma que permetrà als comerços acceptar pagaments amb criptomonedes de manera segura i regulada.',
      url: 'https://www.diarideandorra.ad/economia/pagaments-digitals',
      urlToImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
      publishedAt: oneHourAgo.toISOString(),
      source: { name: 'Diari d\'Andorra' },
      category: 'Fintech'
    },
    {
      id: 'mock-andorra-3',
      title: 'Rècord històric de turistes aquest cap de setmana',
      description: 'Andorra ha rebut més de 60.000 visitants durant el cap de setmana, xifra que supera en un 15% el rècord anterior i consolida la recuperació del sector turístic.',
      url: 'https://bondia.ad/turisme/record-visitants',
      urlToImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop',
      publishedAt: twoHoursAgo.toISOString(),
      source: { name: 'Bondia' },
      category: 'Turismo'
    }
  ];
}