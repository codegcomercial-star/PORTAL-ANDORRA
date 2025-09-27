import { NextRequest, NextResponse } from 'next/server';

// Simple AI Search API for demo purposes
export async function POST(request: NextRequest) {
  try {
    const { query, context } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Mock AI response based on query
    let response = '';
    
    if (query.toLowerCase().includes('clima') || query.toLowerCase().includes('weather')) {
      response = `Según la información meteorológica actual de Andorra:

🌤️ **Clima Actual**: La temperatura en Andorra la Vella es de 15°C con cielos parcialmente nublados.

📊 **Previsión**:
- **Mañana**: 12-18°C, soleado
- **Tarde**: 15-20°C, algunas nubes
- **Noche**: 8-12°C, despejado

🏔️ **Montañas**: En Grandvalira (2100m) la temperatura es de -2°C con nieve.

Para información más detallada, visita la sección de clima del portal.`;
    } else if (query.toLowerCase().includes('bopa') || query.toLowerCase().includes('ley')) {
      response = `Información sobre BOPA y normativa andorrana:

📄 **BOPA Reciente**:
- BOPA núm. 64 del 20 de septiembre de 2024
- Incluye modificaciones del reglamento de...
- 12 documentos publicados

⚖️ **Normativa Relevante**:
- Ley de sociedades mercantiles
- Reglamento fiscal actualizado
- Nuevas disposiciones sobre inversión extranjera

Para consultar la normativa completa, accede a la sección BOPA del portal.`;
    } else if (query.toLowerCase().includes('irpf') || query.toLowerCase().includes('impuesto')) {
      response = `Información sobre IRPF en Andorra:

💰 **Tarifas IRPF 2024**:
- Hasta 24.000€: 0%
- De 24.001€ a 40.000€: 5%
- Más de 40.000€: 10%

📊 **Deducciones Disponibles**:
- Gastos de formación
- Donaciones a entidades
- Inversiones en vivienda habitual

Usa nuestra calculadora IRPF para simular tu declaración.`;
    } else {
      response = `Basándome en la información disponible del Portal Andorra:

📍 **Sobre tu consulta**: "${query}"

Este portal incluye información completa sobre:
- BOPA (Boletín Oficial)
- Normativa y leyes
- Clima y meteorología
- Finanzas y criptomonedas
- Calculadora IRPF
- Noticias de Andorra

¿En qué área específica te gustaría que profundice más?`;
    }

    return NextResponse.json({
      success: true,
      data: {
        response,
        query,
        context: context || 'general',
        timestamp: new Date().toISOString(),
        sources: [
          'Portal Andorra - Información oficial',
          'Datos actualizados del sistema'
        ]
      }
    });

  } catch (error) {
    console.error('AI Search error:', error);
    return NextResponse.json(
      { error: 'Error processing AI search request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'history') {
    // Return mock search history
    return NextResponse.json({
      success: true,
      data: [
        {
          id: '1',
          query: '¿Cómo está el clima en Andorra?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'weather'
        },
        {
          id: '2',
          query: 'Información sobre IRPF',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'tax'
        }
      ]
    });
  }

  return NextResponse.json({
    success: true,
    message: 'AI Search API - Use POST to search, GET with ?action=history for search history'
  });
}