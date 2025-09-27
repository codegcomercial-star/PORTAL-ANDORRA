'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { Menu, X, Search, Globe, Sun, Moon, User } from 'lucide-react';

// Button component inline with variants
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
import { LanguageSelector } from './language-selector';

export function Header() {
  const t = useTranslations('navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('bopa'), href: '/bopa' },
    { name: t('normativa'), href: '/normativa' },
    { name: t('noticias'), href: '/noticias' },
    { name: t('clima'), href: '/clima' },
    { name: t('finanzas'), href: '/finanzas' },
    { name: t('cripto'), href: '/cripto' },
    { name: t('irpf'), href: '/irpf' },
    { name: t('buscador'), href: '/buscador' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href={"/" as any} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-andorra-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PA</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl">Portal Andorra</span>
                <span className="text-xs text-gray-500">By Nexora</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.slice(0, 5).map((item) => (
              <Link
                key={item.name}
                href={item.href as any}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* More dropdown for remaining items */}
            <div className="relative group">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Més
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-popover border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {navigation.slice(5).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href as any}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>

            {/* Language selector */}
            <LanguageSelector />

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* User menu */}
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href as any}
                  className="block px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}