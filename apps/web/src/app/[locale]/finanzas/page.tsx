import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';

interface Props {
  params: { locale: string };
}

export default function FinanzasPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('FinanzasPage');

  const indices = [
    { name: "IBEX 35", value: "9,847.30", change: "+1.2%", trend: "📈" },
    { name: "S&P 500", value: "4,234.85", change: "+0.8%", trend: "📈" },
    { name: "NASDAQ", value: "13,067.48", change: "+1.5%", trend: "📈" },
    { name: "FTSE 100", value: "7,456.23", change: "-0.3%", trend: "📉" },
    { name: "DAX", value: "15,234.67", change: "+0.9%", trend: "📈" },
    { name: "CAC 40", value: "7,123.45", change: "+0.6%", trend: "📈" }
  ];

  const divisas = [
    { par: "EUR/USD", valor: "1.0876", cambio: "+0.15%" },
    { par: "GBP/USD", valor: "1.2634", cambio: "-0.08%" },
    { par: "USD/JPY", valor: "149.23", cambio: "+0.22%" },
    { par: "EUR/GBP", valor: "0.8608", cambio: "+0.23%" },
    { par: "USD/CHF", valor: "0.9124", cambio: "-0.11%" },
    { par: "AUD/USD", valor: "0.6543", cambio: "+0.35%" }
  ];

  const bancosAndorra = [
    { name: "AndBank", precio: "€142.50", cambio: "+2.1%" },
    { name: "Crèdit Andorrà", precio: "€89.30", cambio: "+1.8%" },
    { name: "Morabanc", precio: "€67.80", cambio: "-0.5%" }
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

        {/* Resumen de mercados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">📈 Mercados Alcistas</h3>
            <p className="text-2xl font-bold text-green-600">+0.9%</p>
            <p className="text-sm text-gray-600">Promedio índices principales</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">💱 EUR/USD</h3>
            <p className="text-2xl font-bold text-blue-600">1.0876</p>
            <p className="text-sm text-gray-600">+0.15% hoy</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">🏦 Banca Andorrana</h3>
            <p className="text-2xl font-bold text-purple-600">+1.1%</p>
            <p className="text-sm text-gray-600">Promedio sector</p>
          </div>
        </div>

        {/* Índices principales */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <h3 className="text-xl font-semibold mb-4">📊 Índices Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indices.map((indice, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{indice.name}</h4>
                  <span className="text-xl">{indice.trend}</span>
                </div>
                <p className="text-lg font-bold">{indice.value}</p>
                <p className={`text-sm ${
                  indice.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {indice.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divisas */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <h3 className="text-xl font-semibold mb-4">💱 Mercado de Divisas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisas.map((divisa, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{divisa.par}</h4>
                <p className="text-lg font-bold">{divisa.valor}</p>
                <p className={`text-sm ${
                  divisa.cambio.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {divisa.cambio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Banca andorrana */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <h3 className="text-xl font-semibold mb-4">🏦 Sector Bancario Andorrano</h3>
          <div className="space-y-4">
            {bancosAndorra.map((banco, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">{banco.name}</h4>
                  <p className="text-sm text-gray-600">Entidad bancaria</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{banco.precio}</p>
                  <p className={`text-sm ${
                    banco.cambio.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {banco.cambio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recursos financieros */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🔗 Recursos Financieros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="https://www.aba.ad" target="_blank" rel="noopener noreferrer"
               className="p-4 bg-white rounded-lg hover:shadow-sm">
              🏦 Asociación Bancos Andorranos
            </a>
            <a href="https://www.govern.ad/finances" target="_blank" rel="noopener noreferrer"
               className="p-4 bg-white rounded-lg hover:shadow-sm">
              💼 Ministerio de Finanzas
            </a>
            <a href="https://www.inaf.ad" target="_blank" rel="noopener noreferrer"
               className="p-4 bg-white rounded-lg hover:shadow-sm">
              📊 INAF
            </a>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}