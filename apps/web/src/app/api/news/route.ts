import { NextRequest, NextResponse } from 'next/server';

// Mock data for news while we fix the service
const mockNews = [
  {
    id: '1',
    title: 'Se firma un nuevo convenio para evitar la doble imposición entre ambos países',
    description: 'Nou conveni fiscal entre Andorra i España per evitar la doble imposició.',
    content: 'El Principat d\'Andorra ha signat un nou conveni per evitar la doble imposició fiscal amb España, millorant les relacions comercials entre els dos països. Aquest acord beneficiarà les empreses i particulars que operen en ambdós territoris.',
    url: 'https://www.diariandorra.ad/noticies/fiscal/convenio-doble-imposicion',
    image: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Fiscal',
    publishedAt: '2024-03-15T10:00:00Z',
    source: 'El Periòdic d\'Andorra',
    category: 'Fiscal'
  },
  {
    id: '2',
    title: 'El Govern presenta el marco regulatorio para activos digitales en el Principado',
    description: 'Nou marc regulatori per actius digitals a Andorra.',
    content: 'El Govern d\'Andorra ha presentat avui el nou marc regulatori per als actius digitals, que inclou mesures per fomentar la innovació fintech i crear un entorn segur per a les empreses tecnològiques.',
    url: 'https://www.diariandorra.ad/noticies/fintech/activos-digitales',
    image: 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Fintech',
    publishedAt: '2024-03-10T14:30:00Z',
    source: 'Diari d\'Andorra',
    category: 'Fintech'
  },
  {
    id: '3',
    title: 'El número de nuevas sociedades constituidas aumenta un 15% respecto al año anterior',
    description: 'Creixement del 15% en la constitució de noves societats.',
    content: 'El registre de noves societats constituïdes a Andorra ha experimentat un creixement del 15% respecte a l\'any anterior, mostrant la vitalitat econòmica del país i l\'atractiu per als inversors internacionals.',
    url: 'https://www.bondia.ad/economia/nuevas-sociedades-2024',
    image: 'https://via.placeholder.com/400x300/059669/ffffff?text=Economia',
    publishedAt: '2024-03-08T09:15:00Z',
    source: 'Bondia',
    category: 'Economia'
  },
  {
    id: '4',
    title: 'La entidad presenta su plataforma de banca online renovada con nuevas funcionalidades',
    description: 'ATV renova la seva plataforma de banca online.',
    content: 'ATV ha presentat la seva nova plataforma de banca online amb funcionalitats millorades per oferir una millor experiència als clients, incloent noves eines de gestió i seguretat avançada.',
    url: 'https://www.atv.ad/noticies/banca-online-renovada',
    image: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Finances',
    publishedAt: '2024-03-05T16:45:00Z',
    source: 'ATV',
    category: 'Finanzas'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category') || 'all';

    let filteredNews = mockNews;
    
    // Filter by category if specified
    if (category && category !== 'all') {
      filteredNews = mockNews.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply pagination
    const paginatedNews = filteredNews.slice(offset, offset + limit);
    const categories = [...new Set(mockNews.map(item => item.category))];

    return NextResponse.json({
      success: true,
      articles: paginatedNews,
      total: filteredNews.length,
      categories: categories,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('News API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        articles: [],
        total: 0,
        categories: [],
        lastUpdated: new Date().toISOString(),
        error: 'Failed to fetch news' 
      },
      { status: 500 }
    );
  }
}
