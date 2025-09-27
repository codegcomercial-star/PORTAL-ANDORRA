import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';

interface Props {
  params: { locale: string };
}

export default function NormativaPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('NormativaPage');

  const categorias = [
    {
      titulo: "Derecho Constitucional",
      descripcion: "Constitución y leyes fundamentales del Principado",
      icono: "⚖️",
      documentos: 12
    },
    {
      titulo: "Derecho Tributario", 
      descripcion: "Legislación fiscal e impuestos",
      icono: "💰",
      documentos: 45
    },
    {
      titulo: "Derecho Mercantil",
      descripcion: "Normativa empresarial y comercial", 
      icono: "🏢",
      documentos: 78
    },
    {
      titulo: "Derecho Laboral",
      descripcion: "Relaciones laborales y seguridad social",
      icono: "👥", 
      documentos: 34
    },
    {
      titulo: "Derecho Penal",
      descripcion: "Código penal y legislación criminal",
      icono: "🔒",
      documentos: 23
    },
    {
      titulo: "Derecho Civil",
      descripcion: "Código civil y relaciones privadas",
      icono: "📋",
      documentos: 56
    }
  ];

  const recientes = [
    {
      titulo: "Llei 19/2023 de modificació del Codi penal",
      fecha: "2023-12-15",
      tipo: "Ley"
    },
    {
      titulo: "Reglament de desenvolupament de la Llei d'immigració", 
      fecha: "2023-11-28",
      tipo: "Reglamento"
    },
    {
      titulo: "Llei 15/2023 de mesures fiscals",
      fecha: "2023-10-20", 
      tipo: "Ley"
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

        {/* Buscador */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar en la normativa andorrana..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categorias.map((categoria, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{categoria.icono}</span>
                <div>
                  <h3 className="text-lg font-semibold">{categoria.titulo}</h3>
                  <p className="text-sm text-gray-600">{categoria.documentos} documentos</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{categoria.descripcion}</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Explorar
              </button>
            </div>
          ))}
        </div>

        {/* Documentos recientes */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Actualizaciones Recientes</h3>
          <div className="space-y-4">
            {recientes.map((doc, index) => (
              <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-1">{doc.titulo}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {doc.tipo}
                    </span>
                    <span>{new Date(doc.fecha).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  Ver →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Enlaces oficiales */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Portal Jurídico Oficial</h3>
          <p className="text-gray-600 mb-4">
            Para consultar la normativa oficial completa, visita el portal del Gobierno de Andorra
          </p>
          <a 
            href="https://www.govern.ad/legislacio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Ir al Portal Jurídico
          </a>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}