import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['ca', 'es', 'en', 'fr'],
  
  // Used when no locale matches
  defaultLocale: 'ca',
  
  // Don't use locale prefix for default locale
  localePrefix: 'as-needed',
});

export function middleware(request: NextRequest) {
  // Handle internationalization
  const response = intlMiddleware(request);
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ca|es|en|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};