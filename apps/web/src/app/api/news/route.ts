import { NextRequest, NextResponse } from 'next/server';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
  category: string;
}

function generateCurrentNews(): NewsArticle[] {
  const now = new Date();
  const today = now.toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'news-1',
      title: 'Andorra registra un crecimiento económico del 4.2% en el tercer trimestre de 2024',
      description: 'El Ministeri d\'Economia ha publicat les xifres oficials que mostren una recuperació sostenible del PIB andorrà, impulsada principalment pel sector financer i turístic.',
      content: 'Les últimes dades econòmiques d\'Andorra revelen un panorama positiu per al Principat amb un creixement del 4.2% respecte al mateix període de l\'any anterior.',
      url: '/es/noticias/economia-creixement-2024',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      publishedAt: today,
      source: 'Govern d\'Andorra',
      category: 'economia'
    },
    {
      id: 'news-2',
      title: 'Nueva ley de activos digitales: Andorra se consolida como hub fintech europeo',
      description: 'El Consell General aprova la regulació definitiva per a criptomonedes i actius digitals, posicionant Andorra com a referent en innovació financera.',
      content: 'La nova llei d\'actius digitals estableix un marc regulatori clar per a empreses fintech que vulguin operar des d\'Andorra.',
      url: '/es/noticias/llei-actius-digitals',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
      publishedAt: yesterday,
      source: 'Consell General',
      category: 'fintech'
    },
    {
      id: 'news-3',
      title: 'Acord fiscal amb França: eliminació de la doble imposició per a residents fronterers',
      description: 'S\'implementen noves mesures per evitar la doble tributació entre Andorra i França, beneficiant milers de treballadors transfronterers.',
      content: 'L\'acord fiscal entre Andorra i França suposa un avenç significatiu en les relacions bilaterals i facilita la mobilitat laboral.',
      url: '/es/noticias/acord-fiscal-franca',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      publishedAt: yesterday,
      source: 'Ministeri d\'Afers Exteriors',
      category: 'fiscal'
    },
    {
      id: 'news-4',
      title: 'Record de visitants: Andorra supera els 8 milions de turistes el 2024',
      description: 'Les dades oficials del Ministeri de Turisme confirmen que 2024 serà un any rècord en nombre de visitants al Principat.',
      content: 'El sector turístic andorrà continua la seva trajectòria ascendent amb un increment del 15% respecte a l\'any anterior.',
      url: '/es/noticias/record-turistes-2024',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      publishedAt: twoDaysAgo,
      source: 'Ministeri de Turisme',
      category: 'economia'
    },
    {
      id: 'news-5',
      title: 'Inversió de 50 milions en infraestructures digitals per al 2025',
      description: 'El Govern anuncia un pla ambiciós per digitalitzar completament l\'administració pública i millorar la connectivitat del país.',
      content: 'La transformació digital d\'Andorra rep un impuls decisiu amb aquesta inversió sense precedents en tecnologia.',
      url: '/es/noticias/transformacio-digital-2025',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
      publishedAt: twoDaysAgo,
      source: 'Ministeri de Transformació Digital',
      category: 'fintech'
    },
    {
      id: 'news-6',
      title: 'Nou sistema de tributació per a empreses tecnològiques a partir del 2025',
      description: 'S\'introdueixen incentius fiscals específics per atreure startups i empreses tech al Principat d\'Andorra.',
      content: 'El nou marc fiscal per a empreses tecnològiques inclou reduccions significatives en l\'impost de societats.',
      url: '/es/noticias/incentius-tech-2025',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      publishedAt: today,
      source: 'Ministeri de Finances',
      category: 'fiscal'
    }
  ];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    let articles = generateCurrentNews();
    
    if (category !== 'all') {
      articles = articles.filter(article => article.category === category);
    }

    articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const limitedArticles = articles.slice(0, limit);

    return NextResponse.json({
      success: true,
      articles: limitedArticles,
      total: limitedArticles.length,
      categories: ['fiscal', 'fintech', 'economia', 'politica', 'societat'],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in news API:', error);
    
    return NextResponse.json({
      success: false,
      articles: [],
      error: 'Error fetching news',
      lastUpdated: new Date().toISOString()
    }, { status: 500 });
  }
}
