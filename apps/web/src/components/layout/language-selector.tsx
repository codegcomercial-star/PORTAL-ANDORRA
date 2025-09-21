'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

const locales = [
  { code: 'ca', name: 'Català', flag: '🇦🇩' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  return (
    <div className="relative group">
      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
        <Globe className="h-4 w-4" />
        <span className="text-sm">{currentLocale.flag}</span>
      </Button>
      
      <div className="absolute top-full right-0 mt-1 w-40 bg-popover border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {locales.map((loc) => (
          <button
            key={loc.code}
            onClick={() => switchLocale(loc.code)}
            className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-accent transition-colors ${
              loc.code === locale ? 'bg-accent' : ''
            }`}
          >
            <span>{loc.flag}</span>
            <span>{loc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}