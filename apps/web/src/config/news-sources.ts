/**
 * Fuentes reales (RSS). Puedes ampliar esta lista si alguna redacción añade RSS.
 * ⚠️ Si alguna fuente falla temporalmente, se ignora y las demás siguen funcionando.
 */
export type Lang = 'ca'|'es'|'en'|'fr';
export type NewsCategory = 'politics'|'economy'|'sports'|'culture'|'technology'|'health';

export interface NewsSource {
  name: string;
  url: string;
  category: NewsCategory;
  language: Lang;
}

export const NEWS_SOURCES: NewsSource[] = [
  { name: "Diari d'Andorra", url: "https://www.diariandorra.ad/rss", category: "politics", language: "ca" },
  { name: "El Periòdic",      url: "https://www.elperiodic.ad/rss",  category: "economy", language: "ca" },
  { name: "BonDia",           url: "https://www.bondia.ad/rss",       category: "culture", language: "ca" },
  { name: "Andorra Difusió",  url: "https://www.andorradifusio.ad/rss", category: "sports", language: "ca" }
];