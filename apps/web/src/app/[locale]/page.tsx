import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

import { HeroSection } from '@/components/home/hero-section';
import { FeaturesGrid } from '@/components/home/features-grid';
import { StatsSection } from '@/components/home/stats-section';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = {
  title: 'Portal Andorra - Portal Econòmic d\'Andorra',
  description: 'La vostra font d\'informació econòmica i legal d\'Andorra. Accediu al BOPA, normativa, notícies, finances i calculadora IRPF.',
};

interface Props {
  params: { locale: string };
}

export default function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        <HeroSection />
        <FeaturesGrid />
        <StatsSection />
      </div>
    </MainLayout>
  );
}