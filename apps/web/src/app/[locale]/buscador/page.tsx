import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { SearchForm } from '@/components/search/search-form';

interface Props {
  params: { locale: string };
}

export default function BuscadorPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('SearchPage');

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 mb-8">
            {t('description')}
          </p>
        </div>
        
        <SearchForm />
      </div>
    </div>
    </MainLayout>
  );
}