import NewsCard from '@/components/news/NewsCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchNews(locale: string) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NEXT_PUBLIC_BASE_PATH 
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : 'https://web-inky-alpha-95.vercel.app';
  
  try {
    const res = await fetch(`${baseUrl}/api/news/latest?lang=${locale}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (res && res.ok) {
      const data = await res.json();
      return data.news as any[];
    }
  } catch (e) {
    console.error('Error fetching news:', e);
  }

  // Fallback data
  return [
    {
      id: '1',
      title: 'Noticias de Andorra',
      content: 'Las últimas noticias de Andorra se están cargando...',
      url: 'https://www.diariandorra.ad',
      source: 'Portal Andorra',
      category: 'general',
      language: locale,
      imageUrl: null,
      publishedAt: new Date()
    }
  ];
}

export default async function NoticiasPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'es';
  const news = await fetchNews(locale);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const refreshNews = () => {
    fetchNews(selectedCategory);
  };

  const getCategoryTranslation = (category: string) => {
    const translations: Record<string, string> = {
      all: 'Todas',
      fiscal: 'Fiscal',
      fintech: 'Fintech',
      economia: 'Economía',
      politica: 'Política',
      societat: 'Sociedad',
      general: 'General'
    };
    return translations[category] || category;
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      } else {
        return 'hace unos minutos';
      }
    } catch {
      return 'Fecha desconocida';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Noticias
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Últimas noticias de Andorra actualizadas en tiempo real.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleCategoryChange('all')}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {getCategoryTranslation(category)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Actualizado {formatTimeAgo(lastUpdated)}
              </span>
            )}
            <button
              onClick={refreshNews}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 dark:bg-red-900/20 dark:border-red-800">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error al cargar noticias
          </h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general}`}>
                        {getCategoryTranslation(article.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span>{article.source}</span>
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    
                    <a
                      href={article.url}
                      target={article.url.startsWith('http') ? "_blank" : "_self"}
                      rel={article.url.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Leer más
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={article.url.startsWith('http') ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : "M9 5l7 7-7 7"} />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3v6m0 0l-3-3m3 3l3-3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay noticias disponibles
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No se encontraron noticias para la categoría seleccionada.
              </p>
              <button 
                onClick={refreshNews} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
