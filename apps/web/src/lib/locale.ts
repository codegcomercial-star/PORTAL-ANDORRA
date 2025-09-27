import { setRequestLocale } from 'next-intl/server';

export function setLocale(locale: string) {
  setRequestLocale(locale);
}