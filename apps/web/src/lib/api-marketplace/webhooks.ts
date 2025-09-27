import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface WebhookEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export const triggerWebhook = async (
  userId: string,
  event: WebhookEvent
) => {
  try {
    // Find active webhooks for this user and event type
    const webhooks = await prisma.apiWebhook.findMany({
      where: {
        userId,
        active: true,
        events: {
          has: event.type
        }
      }
    });

    const promises = webhooks.map(webhook => sendWebhook(webhook, event));
    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Error triggering webhooks:', error);
  }
};

const sendWebhook = async (
  webhook: any,
  event: WebhookEvent
) => {
  try {
    const payload = {
      id: crypto.randomUUID(),
      event: event.type,
      data: event.data,
      timestamp: event.timestamp.toISOString()
    };

    const signature = createWebhookSignature(JSON.stringify(payload), webhook.secret);

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'User-Agent': 'API-Marketplace-Webhook/1.0'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (response.ok) {
      await prisma.apiWebhook.update({
        where: { id: webhook.id },
        data: { lastSuccess: new Date() }
      });
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Webhook failed for ${webhook.url}:`, error);
    
    await prisma.apiWebhook.update({
      where: { id: webhook.id },
      data: { lastFailure: new Date() }
    });
    
    throw error;
  }
};

export const createWebhookSignature = (payload: string, secret: string): string => {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
};

export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = createWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
};

export const createWebhook = async (
  userId: string,
  url: string,
  events: string[]
) => {
  const secret = crypto.randomBytes(32).toString('hex');
  
  return await prisma.apiWebhook.create({
    data: {
      userId,
      url,
      events,
      secret,
      active: true
    }
  });
};