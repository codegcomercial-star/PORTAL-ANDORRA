'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  const t = useTranslations('home');

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-andorra-blue via-blue-600 to-blue-800">
      <div className="absolute inset-0 bg-grid-white/10"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl lg:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={"/buscador" as any}>
              <Button size="lg" className="bg-white text-andorra-blue hover:bg-gray-100">
                <Search className="mr-2 h-5 w-5" />
                Prova el cercador IA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href={"/irpf" as any}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-andorra-blue"
              >
                Calculadora IRPF
              </Button>
            </Link>
          </div>

          {/* Demo badge */}
          <div className="mt-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-400 text-yellow-900 font-medium">
              🚀 Modo demo - Dades sintètiques
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}