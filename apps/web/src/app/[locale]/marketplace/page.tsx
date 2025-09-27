import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'API Marketplace - Portal Andorra',
  description: 'Discover and integrate powerful APIs from our marketplace',
};

interface Props {
  params: { locale: string };
}

export default function MarketplacePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">API Marketplace</h1>
          <p className="text-xl text-gray-600 mb-8">
            Monetize your data and access powerful APIs for your applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Super Buscador IA API */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Super Buscador IA</h3>
                <p className="text-sm text-gray-500">v1.0.0</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Advanced AI-powered search with sentiment analysis and multilingual support
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-blue-600">€0.01</span>
              <span className="text-sm text-gray-500">per request</span>
            </div>
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                100 free requests
              </span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>

          {/* Web Scraper API */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🕷️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Web Scraper</h3>
                <p className="text-sm text-gray-500">v1.0.0</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Extract content from any URL with intelligent parsing and data extraction
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-green-600">€0.005</span>
              <span className="text-sm text-gray-500">per request</span>
            </div>
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                200 free requests
              </span>
            </div>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Subscribe
            </button>
          </div>

          {/* Sentiment Analysis API */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">💭</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Sentiment Analysis</h3>
                <p className="text-sm text-gray-500">v1.0.0</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              AI-powered sentiment analysis for text with emotion detection
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-purple-600">€0.002</span>
              <span className="text-sm text-gray-500">per request</span>
            </div>
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                500 free requests
              </span>
            </div>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our API Marketplace?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">High Performance</h3>
              <p className="text-gray-600">Fast response times and 99.9% uptime guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with API key authentication</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics & Monitoring</h3>
              <p className="text-gray-600">Real-time usage analytics and performance monitoring</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Create your API key and start integrating powerful APIs into your applications
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get API Key
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}