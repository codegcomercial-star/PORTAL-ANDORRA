import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

export interface BillingCalculation {
  baseCost: number;
  usage: number;
  overageCost: number;
  totalCost: number;
}

export const calculateBilling = async (
  apiKeyId: string,
  billingPeriodStart: Date,
  billingPeriodEnd: Date
): Promise<BillingCalculation> => {
  try {
    // Get API usage for the billing period
    const usage = await prisma.apiUsage.findMany({
      where: {
        apiKeyId,
        timestamp: {
          gte: billingPeriodStart,
          lte: billingPeriodEnd
        }
      }
    });

    const totalRequests = usage.length;
    const totalCost = usage.reduce((sum, record) => sum + Number(record.cost), 0);

    // Get subscription details
    const subscriptions = await prisma.apiSubscription.findMany({
      where: { apiKeyId, active: true }
    });

    let baseCost = 0;
    let overageCost = 0;

    for (const subscription of subscriptions) {
      if (totalRequests > subscription.requestLimit) {
        const overage = totalRequests - subscription.requestLimit;
        overageCost += overage * Number(subscription.pricePerRequest);
      }
    }

    return {
      baseCost,
      usage: totalRequests,
      overageCost,
      totalCost: baseCost + overageCost + totalCost
    };
  } catch (error) {
    console.error('Error calculating billing:', error);
    throw error;
  }
};

export const createStripePaymentIntent = async (
  amount: number,
  currency: string = 'eur',
  metadata: Record<string, string> = {}
) => {
  try {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  } catch (error) {
    console.error('Error creating Stripe payment intent:', error);
    throw error;
  }
};