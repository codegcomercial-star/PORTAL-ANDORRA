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

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Noticias</h1>
      {news.length === 0 ? (
        <p className="text-gray-400">No hay noticias recientes por ahora.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n) => <NewsCard key={n.id} item={n} />)}
        </div>
      )}
    </main>
  );
}