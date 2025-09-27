import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

interface Props {
  params: { locale: string };
}

export default function TermesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('TermesPage');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">{t('subtitle')}</h2>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
      </div>
    </div>
  );
}