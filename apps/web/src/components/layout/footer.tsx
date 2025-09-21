import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('navigation');
  
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-andorra-blue rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">PA</span>
              </div>
              <span className="font-bold">Portal Andorra</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Portal Econòmic d&apos;Andorra - La vostra font d&apos;informació econòmica i legal.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Informació</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/bopa" className="text-muted-foreground hover:text-foreground">{t('bopa')}</Link></li>
              <li><Link href="/normativa" className="text-muted-foreground hover:text-foreground">{t('normativa')}</Link></li>
              <li><Link href="/noticias" className="text-muted-foreground hover:text-foreground">{t('noticias')}</Link></li>
              <li><Link href="/clima" className="text-muted-foreground hover:text-foreground">{t('clima')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Serveis</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/finanzas" className="text-muted-foreground hover:text-foreground">{t('finanzas')}</Link></li>
              <li><Link href="/cripto" className="text-muted-foreground hover:text-foreground">{t('cripto')}</Link></li>
              <li><Link href="/irpf" className="text-muted-foreground hover:text-foreground">{t('irpf')}</Link></li>
              <li><Link href="/buscador" className="text-muted-foreground hover:text-foreground">{t('buscador')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacitat" className="text-muted-foreground hover:text-foreground">Privacitat</Link></li>
              <li><Link href="/termes" className="text-muted-foreground hover:text-foreground">Termes d&apos;ús</Link></li>
              <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
              <li><Link href="/contacte" className="text-muted-foreground hover:text-foreground">Contacte</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Portal Andorra. Tots els drets reservats.</p>
        </div>
      </div>
    </footer>
  );
}