export interface BillingRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface PricingTier {
  name: string;
  pricePerRequest: number;
  monthlyLimit: number;
}

export const PRICING_TIERS: PricingTier[] = [
  { name: 'Basic', pricePerRequest: 0.01, monthlyLimit: 1000 },
  { name: 'Pro', pricePerRequest: 0.008, monthlyLimit: 10000 },
  { name: 'Enterprise', pricePerRequest: 0.005, monthlyLimit: 100000 }
];

export function calculateBill(usage: number, tier: PricingTier): number {
  return Math.min(usage, tier.monthlyLimit) * tier.pricePerRequest;
}

export function createBillingRecord(userId: string, amount: number): BillingRecord {
  return {
    id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    amount,
    currency: 'EUR',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
}
