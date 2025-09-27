'use client';

type Props = {
  item: {
    id: string;
    title: string;
    content: string;
    url: string;
    source: string;
    category: string;
    imageUrl?: string | null;
    publishedAt: string | Date;
  };
};

export default function NewsCard({ item }: Props) {
  const date = new Date(item.publishedAt);
  return (
    <article className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-sm">🖼️ Imagen de noticia</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
            {item.category}
          </span>
          <time dateTime={date.toISOString()}>
            {date.toLocaleDateString()}
          </time>
        </div>
        <h3 className="font-semibold line-clamp-2 mb-1">{item.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-3 mb-3">{item.content}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">{item.source}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
            aria-label={`Leer en ${item.source}`}
          >
            Leer más →
          </a>
        </div>
      </div>
    </article>
  );
}