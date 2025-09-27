'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

// Button component inline
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  children: React.ReactNode; 
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}> = ({ children, className, variant = 'default', size = 'default', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

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
    router.push(newPath as any);
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