import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';

interface Props {
  params: { locale: string };
}

const mockNoticias = [
  {
    id: 1,
    title: "Nuevo acuerdo fiscal entre Andorra y España",
    excerpt: "Se firma un nuevo convenio para evitar la doble imposición entre ambos países...",
    date: "2024-03-15",
    category: "Fiscal",
    source: "El Periòdic d'Andorra",
    image: "/api/placeholder/400/200"
  },
  {
    id: 2,
    title: "Andorra aprueba nueva ley de criptomonedas",
    excerpt: "El Govern presenta el marco regulatorio para activos digitales en el Principado...",
    date: "2024-03-10",
    category: "Fintech",
    source: "Diari d'Andorra",
    image: "/api/placeholder/400/200"
  },
  {
    id: 3,
    title: "Récord de empresas registradas en 2024",
    excerpt: "El número de nuevas sociedades constituidas aumenta un 15% respecto al año anterior...",
    date: "2024-03-08",
    category: "Economía",
    source: "Bondia",
    image: "/api/placeholder/400/200"
  },
  {
    id: 4,
    title: "Andorra Bank lanza nuevo servicio digital",
    excerpt: "La entidad presenta su plataforma de banca online renovada con nuevas funcionalidades...",
    date: "2024-03-05",
    category: "Finanzas",
    source: "ATV",
    image: "/api/placeholder/400/200"
  }
];

export default function NoticiasPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('NoticiasPage');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fiscal': return 'bg-blue-100 text-blue-800';
      case 'Fintech': return 'bg-purple-100 text-purple-800';
      case 'Economía': return 'bg-green-100 text-green-800';
      case 'Finanzas': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Todas
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Fiscal
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Fintech
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Economía
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Finanzas
          </button>
        </div>

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNoticias.map((noticia) => (
            <article key={noticia.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">📰 Imagen de noticia</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(noticia.category)}`}>
                    {noticia.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(noticia.date).toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                  {noticia.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {noticia.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {noticia.source}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Leer más →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Fuentes oficiales */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Fuentes Oficiales</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="https://www.govern.ad" target="_blank" rel="noopener noreferrer" 
               className="p-3 bg-white rounded-lg text-center hover:shadow-sm">
              🏛️ Govern d&apos;Andorra
            </a>
            <a href="https://www.andorradifusio.ad" target="_blank" rel="noopener noreferrer"
               className="p-3 bg-white rounded-lg text-center hover:shadow-sm">
              📺 Andorra Difusió
            </a>
            <a href="https://www.elperiodic.ad" target="_blank" rel="noopener noreferrer"
               className="p-3 bg-white rounded-lg text-center hover:shadow-sm">
              📰 El Periòdic
            </a>
            <a href="https://www.diariandorra.ad" target="_blank" rel="noopener noreferrer"
               className="p-3 bg-white rounded-lg text-center hover:shadow-sm">
              📄 Diari d&apos;Andorra
            </a>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}