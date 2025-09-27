import { PrismaClient } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();

export const seedApiMarketplace = async () => {
  console.log('🔌 Seeding API Marketplace...');
  
  try {
    // Create default API plans
    await prisma.apiPlan.createMany({
      data: [
        {
          name: 'Free',
          description: 'Perfect for testing and small projects',
          monthlyPrice: new Decimal(0),
          requestsIncluded: 1000,
          overagePrice: new Decimal(0.001),
          requestsPerMinute: 10,
          requestsPerHour: 100,
          requestsPerDay: 1000,
          features: ['Basic support', 'API documentation', 'Usage analytics'],
          supportLevel: 'basic',
        },
        {
          name: 'Pro',
          description: 'For growing businesses and applications',
          monthlyPrice: new Decimal(29.99),
          requestsIncluded: 50000,
          overagePrice: new Decimal(0.0005),
          requestsPerMinute: 100,
          requestsPerHour: 5000,
          requestsPerDay: 50000,
          features: ['Priority support', 'Advanced analytics', 'Webhooks', 'Custom rate limits'],
          supportLevel: 'priority',
        },
        {
          name: 'Enterprise',
          description: 'For large scale applications',
          monthlyPrice: new Decimal(199.99),
          requestsIncluded: 1000000,
          overagePrice: new Decimal(0.0001),
          requestsPerMinute: 1000,
          requestsPerHour: 50000,
          requestsPerDay: 1000000,
          features: ['Dedicated support', 'Custom integrations', 'SLA guarantee', 'White-label options'],
          supportLevel: 'enterprise',
        },
      ],
      skipDuplicates: true
    });

    // Create sample API endpoints
    await prisma.apiEndpoint.createMany({
      data: [
        {
          path: '/api/v1/search/web',
          method: 'POST',
          name: 'Super Buscador IA',
          description: 'Advanced AI-powered search with sentiment analysis and multilingual support',
          category: 'Search',
          pricePerRequest: new Decimal(0.01),
          freeRequests: 100,
          version: '1.0.0',
          exampleRequest: {
            query: 'economic news Andorra',
            options: {
              limit: 10,
              includeAI: true,
              sources: ['web', 'news']
            }
          },
          exampleResponse: {
            query: 'economic news Andorra',
            results: [
              {
                title: 'Economic Growth in Andorra',
                url: 'https://example.com/news1',
                content: 'Andorra shows strong economic indicators...',
                relevanceScore: 0.95
              }
            ],
            aiAnalysis: {
              summary: 'Recent economic news from Andorra shows positive trends...',
              sentiment: 'positive',
              language: 'English',
              keywords: ['economy', 'growth', 'Andorra']
            }
          }
        },
        {
          path: '/api/v1/scrape/url',
          method: 'POST',
          name: 'Web Scraper',
          description: 'Extract content from any URL with intelligent parsing',
          category: 'Scraping',
          pricePerRequest: new Decimal(0.005),
          freeRequests: 200,
          version: '1.0.0',
          exampleRequest: {
            url: 'https://example.com/article'
          },
          exampleResponse: {
            title: 'Article Title',
            description: 'Article description',
            content: 'Full article content...',
            url: 'https://example.com/article'
          }
        },
        {
          path: '/api/v1/analyze/sentiment',
          method: 'POST',
          name: 'Sentiment Analysis',
          description: 'AI-powered sentiment analysis for text with emotion detection',
          category: 'AI',
          pricePerRequest: new Decimal(0.002),
          freeRequests: 500,
          version: '1.0.0',
          exampleRequest: {
            text: 'I love this product! It works perfectly.'
          },
          exampleResponse: {
            sentiment: 'positive',
            score: 0.8,
            emotions: ['joy', 'satisfaction'],
            confidence: 0.92
          }
        },
      ],
      skipDuplicates: true
    });

    console.log('✅ API Marketplace seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding API Marketplace:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  seedApiMarketplace()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedApiMarketplace;