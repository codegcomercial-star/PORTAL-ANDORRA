'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}

interface NewsGridProps {
  locale: string;
}

const categories = [
  { id: 'all', name: 'Todas', color: 'bg-blue-600 text-white' },
  { id: 'fiscal', name: 'Fiscal', color: 'bg-blue-100 text-blue-800' },
  { id: 'fintech', name: 'Fintech', color: 'bg-purple-100 text-purple-800' },
  { id: 'economía', name: 'Economía', color: 'bg-green-100 text-green-800' },
  { id: 'finanzas', name: 'Finanzas', color: 'bg-orange-100 text-orange-800' },
  { id: 'turismo', name: 'Turismo', color: 'bg-pink-100 text-pink-800' },
  { id: 'general', name: 'General', color: 'bg-gray-100 text-gray-800' }
];

export function NewsGrid({ locale }: NewsGridProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchNews = async (category: string = 'all') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?category=${category}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.articles);
        setLastUpdated(data.lastUpdated);
        setError(null);
      } else {
        setError('Error al cargar las noticias');
        setNews(data.articles || []); // Usar fallback si está disponible
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
    
    // Actualizar cada 5 minutos
    const interval = setInterval(() => {
      fetchNews(selectedCategory);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id.toLowerCase() === category.toLowerCase());
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`;
    } else {
      return date.toLocaleDateString(locale === 'ca' ? 'ca-ES' : 'es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  if (loading && news.length === 0) {
    return (
      <div className="space-y-6">
        {/* Skeleton loader */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con última actualización */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {lastUpdated && `Última actualización: ${formatDate(lastUpdated)}`}
          </span>
        </div>
        <button
          onClick={() => fetchNews(selectedCategory)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          disabled={loading}
        >
          <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-800">{error}</span>
          </div>
        </div>
      )}

      {/* Grid de noticias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-gray-200">
              {article.urlToImage ? (
                <Image
                  src={article.urlToImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-3 line-clamp-2 hover:text-blue-600">
                {article.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 truncate pr-2">
                  {article.source.name}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                >
                  Leer más →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Mensaje si no hay noticias */}
      {!loading && news.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay noticias disponibles</h3>
          <p className="text-gray-500">Intenta con otra categoría o vuelve más tarde.</p>
        </div>
      )}
    </div>
  );
}