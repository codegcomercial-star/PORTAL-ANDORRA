export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
}

export function createWebhookEvent(type: string, data: Record<string, any>): WebhookEvent {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    timestamp: new Date().toISOString()
  };
}

export async function sendWebhook(config: WebhookConfig, event: WebhookEvent): Promise<boolean> {
  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': generateSignature(event, config.secret)
      },
      body: JSON.stringify(event)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Webhook delivery failed:', error);
    return false;
  }
}

function generateSignature(event: WebhookEvent, secret: string): string {
  // Simple signature generation - in production use proper HMAC
  return `sha256=${Buffer.from(JSON.stringify(event) + secret).toString('base64')}`;
}
