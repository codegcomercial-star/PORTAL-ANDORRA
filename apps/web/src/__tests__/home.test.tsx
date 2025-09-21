import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import HomePage from '../app/[locale]/page';

// Mock messages for testing
const messages = {
  'home.hero.title': 'Test Portal Title',
  'home.hero.description': 'Test Description'
};

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HomePage />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText('Test Portal Title')).toBeInTheDocument();
  });
});