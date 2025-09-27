import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';

interface Props {
  params: { locale: string };
}

export default function CriptoPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('CriptoPage');

  const criptomonedas = [
    { name: "Bitcoin", symbol: "BTC", price: "$43,250", change: "+2.4%", trend: "📈", icon: "₿" },
    { name: "Ethereum", symbol: "ETH", price: "$2,635", change: "+3.1%", trend: "📈", icon: "Ξ" },
    { name: "Cardano", symbol: "ADA", price: "$0.48", change: "-1.2%", trend: "📉", icon: "₳" },
    { name: "Solana", symbol: "SOL", price: "$95.80", change: "+5.7%", trend: "📈", icon: "◎" },
    { name: "Polygon", symbol: "MATIC", price: "$0.85", change: "+1.8%", trend: "📈", icon: "⬟" },
    { name: "Chainlink", symbol: "LINK", price: "$14.25", change: "-0.5%", trend: "📉", icon: "⛓️" }
  ];

  const noticias = [
    {
      titulo: "Andorra regula las criptomonedas",
      fecha: "2024-03-20",
      categoria: "Regulación"
    },
    {
      titulo: "Nuevo fondo de inversión cripto en Andorra",
      fecha: "2024-03-15", 
      categoria: "Inversión"
    },
    {
      titulo: "Bitcoin supera los $40,000",
      fecha: "2024-03-10",
      categoria: "Mercados"
    }
  ];

  const servicios = [
    {
      name: "AndBank Crypto",
      descripcion: "Custody y trading de criptomonedas",
      tipo: "Banco"
    },
    {
      name: "Crèdit Andorrà Digital",
      descripcion: "Servicios blockchain y DeFi",
      tipo: "Banco"
    },
    {
      name: "Morabanc Crypto Services",
      descripcion: "Fondos de inversión en activos digitales",
      tipo: "Banco"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 mb-8">
            {t('description')}
          </p>
        </div>

        {/* Resumen del mercado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">₿ Bitcoin</h3>
            <p className="text-2xl font-bold text-orange-600">$43,250</p>
            <p className="text-sm text-green-600">+2.4% (24h)</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Ξ Ethereum</h3>
            <p className="text-2xl font-bold text-purple-600">$2,635</p>
            <p className="text-sm text-green-600">+3.1% (24h)</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">💰 Cap. Total</h3>
            <p className="text-2xl font-bold text-blue-600">$1.68T</p>
            <p className="text-sm text-green-600">+2.8% (24h)</p>
          </div>
        </div>

        {/* Top criptomonedas */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <h3 className="text-xl font-semibold mb-4">🚀 Top Criptomonedas</h3>
          <div className="space-y-4">
            {criptomonedas.map((crypto, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{crypto.icon}</span>
                  <div>
                    <h4 className="font-semibold">{crypto.name}</h4>
                    <p className="text-sm text-gray-600">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{crypto.price}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm ${
                      crypto.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {crypto.change}
                    </span>
                    <span>{crypto.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios en Andorra */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <h3 className="text-xl font-semibold mb-4">🏦 Servicios Crypto en Andorra</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servicios.map((servicio, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{servicio.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {servicio.tipo}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Noticias */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <h3 className="text-xl font-semibold mb-4">📰 Noticias Crypto</h3>
          <div className="space-y-4">
            {noticias.map((noticia, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold mb-1">{noticia.titulo}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {noticia.categoria}
                    </span>
                    <span>{new Date(noticia.fecha).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  Leer →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Marco regulatorio */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">⚖️ Marco Regulatorio en Andorra</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Ley de Activos Digitales</h4>
              <p className="text-sm text-gray-600 mb-4">
                Andorra ha establecido un marco claro para la regulación de criptomonedas y activos digitales.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Licencias para exchanges</li>
                <li>• Regulación de ICOs</li>
                <li>• Protección al inversor</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Ventajas Fiscales</h4>
              <p className="text-sm text-gray-600 mb-4">
                Tratamiento fiscal favorable para inversiones en criptomonedas.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Tributación competitiva</li>
                <li>• Régimen de holding</li>
                <li>• Incentivos para startups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}