import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';

interface Props {
  params: { locale: string };
}

export default function BOPAPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('BOPAPage');

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Últimas publicaciones */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">Últimas Publicaciones</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">BOPA núm. 64/2023</p>
                <p className="text-sm text-gray-600">17 de diciembre de 2023</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">BOPA núm. 63/2023</p>
                <p className="text-sm text-gray-600">15 de diciembre de 2023</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">BOPA núm. 62/2023</p>
                <p className="text-sm text-gray-600">13 de diciembre de 2023</p>
              </div>
            </div>
          </div>

          {/* Búsqueda por fecha */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">Buscar por Fecha</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Año</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mes</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Diciembre</option>
                  <option>Noviembre</option>
                  <option>Octubre</option>
                </select>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Buscar
              </button>
            </div>
          </div>

          {/* Categorías */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">Categorías</h3>
            <div className="space-y-2">
              <a href="#" className="block p-2 hover:bg-gray-50 rounded">
                📋 Leyes y Reglamentos
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded">
                💼 Empresas y Comercio
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded">
                🏛️ Administración Pública
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded">
                ⚖️ Justicia
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded">
                💰 Hacienda y Tributación
              </a>
            </div>
          </div>
        </div>

        {/* Acceso directo al BOPA oficial */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Acceso Oficial</h3>
          <p className="text-gray-600 mb-4">
            Para consultar la versión oficial del BOPA, visita el sitio web del Gobierno de Andorra
          </p>
          <a 
            href="https://www.bopa.ad" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Ir a BOPA.ad
          </a>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}