export interface BillingRecord {
  id: string;
  userId: string;
  amount: number;
  currency: 'EUR' | 'USD';
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  pricePerRequest: number;
  monthlyLimit: number;
  features: string[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  userId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    pricePerRequest: 0.01,
    monthlyLimit: 1000,
    features: ['Basic API access', 'Email support']
  },
  {
    id: 'pro',
    name: 'Professional',
    pricePerRequest: 0.008,
    monthlyLimit: 10000,
    features: ['Priority support', 'Advanced analytics', 'Custom webhooks']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    pricePerRequest: 0.005,
    monthlyLimit: 100000,
    features: ['Dedicated support', 'SLA guarantee', 'Custom integrations']
  }
];

export function calculateBill(usageCount: number, tier: PricingTier): number {
  const billableRequests = Math.min(usageCount, tier.monthlyLimit);
  return billableRequests * tier.pricePerRequest;
}

export function createBillingRecord(userId: string, amount: number, currency: 'EUR' | 'USD' = 'EUR'): BillingRecord {
  return {
    id: `bill_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId,
    amount: Math.round(amount * 100) / 100, // Round to 2 decimals
    currency,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
}

export function generateInvoice(userId: string, items: InvoiceItem[]): Invoice {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.21; // 21% VAT
  const total = subtotal + tax;
  
  return {
    id: `inv_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId,
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    status: 'draft'
  };
}
