export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
  category: string;
}

export interface NewsResponse {
  success: boolean;
  articles: NewsArticle[];
  total: number;
  categories: string[];
  lastUpdated: string;
  error?: string;
}