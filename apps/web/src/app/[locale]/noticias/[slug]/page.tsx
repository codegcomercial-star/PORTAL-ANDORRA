'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { NewsArticle } from '../../../../../../../types/news';

export default function NoticiaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          setArticle(data.article);
        } else {
          setError('Noticia no encontrada');
        }
      } catch (err) {
        setError('Error cargando la noticia');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Noticia no encontrada'}
          </h1>
          <a 
            href="/es/noticias"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← Volver a noticias
          </a>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <a 
            href="/es/noticias"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm"
          >
            ← Volver a noticias
          </a>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              article.category === 'fiscal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              article.category === 'fintech' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              article.category === 'economia' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(article.publishedAt)}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {article.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Fuente: {article.source}</span>
          </div>
        </header>

        {/* Article Image */}
        {article.image && (
          <div className="mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {article.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </article>

        {/* Related News - Placeholder */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Noticias relacionadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Próximamente: noticias relacionadas
              </p>
            </div>
            <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Próximamente: más contenido
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}