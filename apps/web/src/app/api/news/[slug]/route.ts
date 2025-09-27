import { NextRequest, NextResponse } from 'next/server';

// Simulamos una base de datos de noticias
const articles = {
  'economia-creixement-2024': {
    id: 'news-1',
    title: 'Andorra registra un crecimiento económico del 4.2% en el tercer trimestre de 2024',
    description: 'El Ministeri d\'Economia ha publicat les xifres oficials que mostren una recuperació sostenible del PIB andorrà, impulsada principalment pel sector financer i turístic.',
    content: `Les últimes dades econòmiques d'Andorra revelen un panorama positiu per al Principat amb un creixement del 4.2% respecte al mateix període de l'any anterior.

El creixement s'ha impulsat principalment per:

• **Sector financer**: Augment del 6.8% en els dipòsits bancaris
• **Turisme**: Increment del 15% en el nombre de visitants
• **Comerç**: Millora del 8.3% en les vendes al detall
• **Construcció**: Recuperació del 12% després de la pandèmia

El Ministeri d'Economia ha destacat que aquesta tendència positiva reflecteix la solidesa de l'economia andorrana i la confiança dels inversors internacionals.

Les perspectives per al 2025 són optimistes, amb previsions de mantenir un creixement sostingut entre el 3.5% i el 4%.`,
    url: '/es/noticias/economia-creixement-2024',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    publishedAt: new Date().toISOString(),
    source: 'Govern d\'Andorra',
    category: 'economia'
  },
  'llei-actius-digitals': {
    id: 'news-2',
    title: 'Nueva ley de activos digitales: Andorra se consolida como hub fintech europeo',
    description: 'El Consell General aprova la regulació definitiva per a criptomonedes i actius digitals, posicionant Andorra com a referent en innovació financera.',
    content: `La nova llei d'actius digitals estableix un marc regulatori clar per a empreses fintech que vulguin operar des d'Andorra.

Els punts clau de la regulació inclouen:

• **Llicències específiques** per a exchanges de criptomonedes
• **Requisits de capital** adaptats al risc de cada activitat
• **Protecció del consumidor** amb mesures de seguretat avançades  
• **Compliment AML/CFT** amb estàndards internacionals
• **Innovació tecnològica** amb sandbox regulatori

La llei permetrà a Andorra atreure empreses tecnològiques d'arreu d'Europa i consolidar-se com un hub fintech de referència.

El Consell General ha aprovat per unanimitat aquesta iniciativa que posicionarà el Principat a l'avantguarda de la regulació blockchain.`,
    url: '/es/noticias/llei-actius-digitals',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: 'Consell General',
    category: 'fintech'
  },
  'acord-fiscal-franca': {
    id: 'news-3',
    title: 'Acord fiscal amb França: eliminació de la doble imposició per a residents fronterers',
    description: 'S\'implementen noves mesures per evitar la doble tributació entre Andorra i França, beneficiant milers de treballadors transfronterers.',
    content: `L'acord fiscal entre Andorra i França suposa un avenç significatiu en les relacions bilaterals i facilita la mobilitat laboral.

Les principals mesures inclouen:

• **Eliminació de la doble imposició** per a residents fronterers
• **Reconeixement mutu** de deduccions fiscals
• **Simplificació dels tràmits** burocràtics
• **Transparència fiscal** segons estàndards OCDE
• **Intercanvi d'informació** automàtic entre administracions

Aquest acord beneficiarà més de 8.000 treballadors que viuen a Andorra i treballen a França, o viceversa.

La implementació començarà el gener de 2025 i s'espera que generi un estalvi fiscal mitjà de 2.500 euros anuals per treballador.`,
    url: '/es/noticias/acord-fiscal-franca',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: 'Ministeri d\'Afers Exteriors',
    category: 'fiscal'
  },
  'record-turistes-2024': {
    id: 'news-4',
    title: 'Record de visitants: Andorra supera els 8 milions de turistes el 2024',
    description: 'Les dades oficials del Ministeri de Turisme confirmen que 2024 serà un any rècord en nombre de visitants al Principat.',
    content: `El sector turístic andorrà continua la seva trajectòria ascendent amb un increment del 15% respecte a l'any anterior.

Els sectors que més han crescut són:

• **Turisme d'esquí**: +22% durant la temporada d'hivern
• **Turisme cultural**: +18% gràcies als nous museus
• **Turisme de compres**: +12% per l'atractiu fiscal
• **Turisme gastronòmic**: +25% amb nous restaurants estrella Michelin
• **Turisme de muntanya**: +20% en activitats a l'aire lliure

El Ministeri de Turisme destaca que aquesta xifra consolida Andorra com una destinació turística de primer nivell a Europa.

L'impacte econòmic del turisme representa el 35% del PIB andorrà, generant més de 15.000 llocs de treball directes.`,
    url: '/es/noticias/record-turistes-2024',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    source: 'Ministeri de Turisme',
    category: 'economia'
  },
  'transformacio-digital-2025': {
    id: 'news-5',
    title: 'Inversió de 50 milions en infraestructures digitals per al 2025',
    description: 'El Govern anuncia un pla ambiciós per digitalitzar completament l\'administració pública i millorar la connectivitat del país.',
    content: `La transformació digital d'Andorra rep un impuls decisiu amb aquesta inversió sense precedents en tecnologia.

Els objectius del pla inclouen:

• **Fibra òptica 5G** a tot el territori nacional
• **Administració 100% digital** amb tràmits online
• **Identitat digital** per a tots els residents
• **Smart cities** amb sensors IoT a les parròquies
• **Ciberseguretat** amb centre nacional de protecció

El projecte es desenvoluparà en 3 fases durant els pròxims 3 anys, posicionant Andorra com un país digitalment avançat.

S'espera que aquesta inversió generi més de 2.000 llocs de treball en el sector tecnològic i atraigui empreses tech internacionals.`,
    url: '/es/noticias/transformacio-digital-2025',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    source: 'Ministeri de Transformació Digital',
    category: 'fintech'
  },
  'incentius-tech-2025': {
    id: 'news-6',
    title: 'Nou sistema de tributació per a empreses tecnològiques a partir del 2025',
    description: 'S\'introdueixen incentius fiscals específics per atreure startups i empreses tech al Principat d\'Andorra.',
    content: `El nou marc fiscal per a empreses tecnològiques inclou reduccions significatives en l'impost de societats.

Els incentius principals són:

• **Tipus reduït del 2%** per a startups tecnològiques durant 3 anys
• **Deduccions del 200%** en I+D+i
• **Exempció total** per a patents i propietat intel·lectual
• **Règim especial** per a nòmades digitals
• **Beneficis fiscals** per a inversió en talent tech

Aquest pla pretén atreure 500 empreses tecnològiques en els pròxims 5 anys i crear un ecosistema d'innovació competitiu a nivell europeu.

Les empreses interessades podran sol·licitar aquests beneficis a partir del gener de 2025 a través d'un procés simplificat online.`,
    url: '/es/noticias/incentius-tech-2025',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    publishedAt: new Date().toISOString(),
    source: 'Ministeri de Finances',
    category: 'fiscal'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const article = articles[slug as keyof typeof articles];
    
    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}