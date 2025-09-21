import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Providers } from './providers';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

const locales = ['ca', 'es', 'en', 'fr'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: Props) {
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.some((cur) => cur === locale);
  if (!isValidLocale) notFound();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}