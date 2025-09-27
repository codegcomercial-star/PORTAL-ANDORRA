import { NextRequest, NextResponse } from 'next/server';

// Mock data para mercados financieros
const generateRandomChange = (min: number = -3, max: number = 3) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

const generatePrice = (base: number, volatility: number = 0.05) => {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return (base * (1 + change)).toFixed(2);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'indices';

  // Simular delay de API real
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

  switch (type) {
    case 'indices':
      return NextResponse.json({
        data: [
          {
            symbol: 'IBEX35',
            name: 'IBEX 35',
            price: generatePrice(9847.30),
            change: generateRandomChange(-2, 3),
            changePercent: generateRandomChange(-1.5, 2.5),
            volume: '1.2M',
            marketCap: '€856B',
            high: generatePrice(9950),
            low: generatePrice(9750),
            open: generatePrice(9800)
          },
          {
            symbol: 'SPX',
            name: 'S&P 500',
            price: generatePrice(4234.85),
            change: generateRandomChange(-50, 80),
            changePercent: generateRandomChange(-1.2, 1.8),
            volume: '3.8B',
            marketCap: '$45.2T',
            high: generatePrice(4280),
            low: generatePrice(4190),
            open: generatePrice(4220)
          },
          {
            symbol: 'NASDAQ',
            name: 'NASDAQ Composite',
            price: generatePrice(13067.48),
            change: generateRandomChange(-150, 200),
            changePercent: generateRandomChange(-1.5, 2.0),
            volume: '4.2B',
            marketCap: '$16.8T',
            high: generatePrice(13200),
            low: generatePrice(12950),
            open: generatePrice(13000)
          },
          {
            symbol: 'FTSE',
            name: 'FTSE 100',
            price: generatePrice(7456.23),
            change: generateRandomChange(-30, 40),
            changePercent: generateRandomChange(-0.8, 1.2),
            volume: '850K',
            marketCap: '£2.1T',
            high: generatePrice(7500),
            low: generatePrice(7420),
            open: generatePrice(7460)
          },
          {
            symbol: 'DAX',
            name: 'DAX',
            price: generatePrice(15234.67),
            change: generateRandomChange(-80, 120),
            changePercent: generateRandomChange(-1.0, 1.5),
            volume: '2.1B',
            marketCap: '€1.8T',
            high: generatePrice(15350),
            low: generatePrice(15150),
            open: generatePrice(15200)
          },
          {
            symbol: 'CAC40',
            name: 'CAC 40',
            price: generatePrice(7123.45),
            change: generateRandomChange(-35, 50),
            changePercent: generateRandomChange(-0.9, 1.3),
            volume: '1.5B',
            marketCap: '€2.4T',
            high: generatePrice(7180),
            low: generatePrice(7080),
            open: generatePrice(7120)
          }
        ],
        timestamp: new Date().toISOString(),
        source: 'Portal Andorra Market API'
      });

    case 'forex':
      return NextResponse.json({
        data: [
          {
            pair: 'EURUSD',
            name: 'EUR/USD',
            price: generatePrice(1.0876, 0.01),
            change: generateRandomChange(-0.005, 0.005),
            changePercent: generateRandomChange(-0.5, 0.5),
            bid: generatePrice(1.0874, 0.01),
            ask: generatePrice(1.0878, 0.01),
            high: generatePrice(1.0890, 0.01),
            low: generatePrice(1.0860, 0.01)
          },
          {
            pair: 'GBPUSD',
            name: 'GBP/USD',
            price: generatePrice(1.2634, 0.012),
            change: generateRandomChange(-0.008, 0.008),
            changePercent: generateRandomChange(-0.6, 0.6),
            bid: generatePrice(1.2632, 0.012),
            ask: generatePrice(1.2636, 0.012),
            high: generatePrice(1.2650, 0.012),
            low: generatePrice(1.2615, 0.012)
          },
          {
            pair: 'USDJPY',
            name: 'USD/JPY',
            price: generatePrice(149.23, 0.008),
            change: generateRandomChange(-0.3, 0.4),
            changePercent: generateRandomChange(-0.3, 0.3),
            bid: generatePrice(149.21, 0.008),
            ask: generatePrice(149.25, 0.008),
            high: generatePrice(149.80, 0.008),
            low: generatePrice(148.90, 0.008)
          },
          {
            pair: 'EURGBP',
            name: 'EUR/GBP',
            price: generatePrice(0.8608, 0.008),
            change: generateRandomChange(-0.003, 0.004),
            changePercent: generateRandomChange(-0.4, 0.4),
            bid: generatePrice(0.8606, 0.008),
            ask: generatePrice(0.8610, 0.008),
            high: generatePrice(0.8625, 0.008),
            low: generatePrice(0.8590, 0.008)
          },
          {
            pair: 'USDCHF',
            name: 'USD/CHF',
            price: generatePrice(0.9124, 0.01),
            change: generateRandomChange(-0.004, 0.003),
            changePercent: generateRandomChange(-0.3, 0.3),
            bid: generatePrice(0.9122, 0.01),
            ask: generatePrice(0.9126, 0.01),
            high: generatePrice(0.9140, 0.01),
            low: generatePrice(0.9105, 0.01)
          },
          {
            pair: 'AUDUSD',
            name: 'AUD/USD',
            price: generatePrice(0.6543, 0.012),
            change: generateRandomChange(-0.006, 0.008),
            changePercent: generateRandomChange(-0.7, 0.8),
            bid: generatePrice(0.6541, 0.012),
            ask: generatePrice(0.6545, 0.012),
            high: generatePrice(0.6560, 0.012),
            low: generatePrice(0.6525, 0.012)
          }
        ],
        timestamp: new Date().toISOString(),
        source: 'Portal Andorra Forex API'
      });

    case 'andorra-banks':
      return NextResponse.json({
        data: [
          {
            symbol: 'ANDBANK',
            name: 'AndBank',
            price: `€${generatePrice(142.50)}`,
            change: generateRandomChange(-5, 8),
            changePercent: generateRandomChange(-2.5, 3.5),
            volume: '1,250',
            marketCap: '€285M',
            sector: 'Banca Privada',
            employees: '850+',
            founded: '1930'
          },
          {
            symbol: 'CREDITAND',
            name: 'Crèdit Andorrà',
            price: `€${generatePrice(89.30)}`,
            change: generateRandomChange(-3, 6),
            changePercent: generateRandomChange(-2.0, 3.0),
            volume: '890',
            marketCap: '€178M',
            sector: 'Banca Universal',
            employees: '1,200+',
            founded: '1949'
          },
          {
            symbol: 'MORABANC',
            name: 'Morabanc',
            price: `€${generatePrice(67.80)}`,
            change: generateRandomChange(-2, 4),
            changePercent: generateRandomChange(-1.5, 2.5),
            volume: '650',
            marketCap: '€135M',
            sector: 'Banca Digital',
            employees: '600+',
            founded: '1958'
          }
        ],
        timestamp: new Date().toISOString(),
        source: 'Portal Andorra Banking API'
      });

    default:
      return NextResponse.json({ error: 'Invalid market type' }, { status: 400 });
  }
}