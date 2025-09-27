import { setRequestLocale } from 'next-intl/server';
import ClimaContent from './ClimaContent';
import './weather-styles.css';

interface Props {
  params: { locale: string };
}

export default function ClimaPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  
  return <ClimaContent />;
}
