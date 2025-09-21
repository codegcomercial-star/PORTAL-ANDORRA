'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  FileText, 
  Scale, 
  Newspaper, 
  Calculator, 
  Bot, 
  TrendingUp,
  Cloud,
  Bitcoin
} from 'lucide-react';

export function FeaturesGrid() {
  const t = useTranslations('home.features');

  const features = [
    {
      icon: FileText,
      name: t('bopa.title'),
      description: t('bopa.description'),
      href: '/bopa',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    },
    {
      icon: Scale,
      name: t('normativa.title'),
      description: t('normativa.description'),
      href: '/normativa',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    },
    {
      icon: Newspaper,
      name: t('news.title'),
      description: t('news.description'),
      href: '/noticias',
      color: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    },
    {
      icon: Calculator,
      name: t('irpf.title'),
      description: t('irpf.description'),
      href: '/irpf',
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    },
    {
      icon: Bot,
      name: t('ai.title'),
      description: t('ai.description'),
      href: '/buscador',
      color: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400',
    },
    {
      icon: TrendingUp,
      name: t('finance.title'),
      description: t('finance.description'),
      href: '/finanzas',
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    },
    {
      icon: Cloud,
      name: 'Clima',
      description: 'Predicció meteorològica per Andorra',
      href: '/clima',
      color: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
    },
    {
      icon: Bitcoin,
      name: 'Cripto',
      description: 'Preus de Bitcoin, Ethereum i altres',
      href: '/cripto',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Funcionalitats principals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Accedeix a tota la informació d&apos;Andorra des d&apos;una sola plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.name}
                href={feature.href}
                className="group relative p-6 bg-card border rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}