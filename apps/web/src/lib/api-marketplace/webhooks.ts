export interface WebhookEvent {
  id: string;
  type: 'payment.success' | 'payment.failed' | 'usage.limit' | 'account.created';
  data: Record<string, any>;
  timestamp: string;
  retries: number;
  delivered: boolean;
}

export interface WebhookEndpoint {
  id: string;
  userId: string;
  url: string;
  secret: string;
  events: WebhookEvent['type'][];
  active: boolean;
  createdAt: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventId: string;
  url: string;
  status: 'pending' | 'success' | 'failed';
  response?: {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
  attemptedAt: string;
  deliveredAt?: string;
}

export function createWebhookEvent(
  type: WebhookEvent['type'],
  data: Record<string, any>
): WebhookEvent {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    type,
    data,
    timestamp: new Date().toISOString(),
    retries: 0,
    delivered: false
  };
}

export function generateWebhookSignature(payload: string, secret: string): string {
  // Simple signature generation - in production use HMAC-SHA256
  const timestamp = Math.floor(Date.now() / 1000);
  return `t=${timestamp},v1=${Buffer.from(payload + secret).toString('base64')}`;
}

export async function deliverWebhook(
  webhook: WebhookEndpoint,
  event: WebhookEvent
): Promise<WebhookDelivery> {
  const delivery: WebhookDelivery = {
    id: `del_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    webhookId: webhook.id,
    eventId: event.id,
    url: webhook.url,
    status: 'pending',
    attemptedAt: new Date().toISOString()
  };

  try {
    const payload = JSON.stringify(event);
    const signature = generateWebhookSignature(payload, webhook.secret);
    
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature
      },
      body: payload
    });

    delivery.response = {
      status: response.status,
      body: await response.text(),
      headers: Object.fromEntries(response.headers.entries())
    };

    delivery.status = response.ok ? 'success' : 'failed';
    if (response.ok) {
      delivery.deliveredAt = new Date().toISOString();
    }
  } catch (error) {
    delivery.status = 'failed';
    delivery.response = {
      status: 0,
      body: error instanceof Error ? error.message : 'Unknown error',
      headers: {}
    };
  }

  return delivery;
}

export function validateWebhookUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' && parsedUrl.hostname !== 'localhost';
  } catch {
    return false;
  }
}
