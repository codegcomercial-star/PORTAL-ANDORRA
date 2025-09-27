'use client';

import { useState } from 'react';
// Button component inline
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }> = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>
    {children}
  </button>
);

interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  type: string;
  score: number;
  publishedAt: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  semantic: boolean;
  query: string;
  processingTime: number;
}

export function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [semantic, setSemantic] = useState(false);
  const [total, setTotal] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&semantic=${semantic}`
      );
      const data: SearchResponse = await response.json();
      setResults(data.results);
      setTotal(data.total);
      setProcessingTime(data.processingTime);
    } catch (error) {
      console.error('Error al buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'law': return 'Ley';
      case 'bulletin': return 'BOPA';
      case 'news': return 'Noticia';
      default: return 'Documento';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'law': return 'bg-blue-100 text-blue-800';
      case 'bulletin': return 'bg-green-100 text-green-800';
      case 'news': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca en normativa, BOPA, noticias..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="semantic"
            checked={semantic}
            onChange={(e) => setSemantic(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="semantic" className="text-sm text-gray-600">
            Búsqueda semántica (IA)
          </label>
        </div>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {total} resultados encontrados en {processingTime}ms
            </p>
          </div>

          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      {result.title}
                    </a>
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                    {getTypeLabel(result.type)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {result.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Relevancia: {Math.round(result.score * 100)}%</span>
                  <span>Publicado: {new Date(result.publishedAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}