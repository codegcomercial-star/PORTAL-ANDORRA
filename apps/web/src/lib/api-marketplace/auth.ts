import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateApiKey = (): string => {
  const prefix = process.env.API_KEY_PREFIX || 'amp_';
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return `${prefix}${randomBytes}`;
};

export const validateApiKey = async (apiKey: string) => {
  try {
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey, isActive: true },
      include: { user: true, subscriptions: true }
    });
    
    if (!key) return null;
    if (key.expiresAt && key.expiresAt < new Date()) return null;
    
    return key;
  } catch (error) {
    console.error('Error validating API key:', error);
    return null;
  }
};

export const trackApiUsage = async (
  apiKeyId: string,
  requestDetails: {
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    requestSize?: number;
    responseSize?: number;
    userAgent?: string;
    ipAddress?: string;
    cost?: number;
  }
) => {
  const requestId = crypto.randomUUID();
  
  try {
    return await prisma.apiUsage.create({
      data: {
        requestId,
        apiKeyId,
        endpoint: requestDetails.endpoint,
        method: requestDetails.method,
        statusCode: requestDetails.statusCode,
        responseTime: requestDetails.responseTime,
        requestSize: requestDetails.requestSize,
        responseSize: requestDetails.responseSize,
        userAgent: requestDetails.userAgent,
        ipAddress: requestDetails.ipAddress,
        cost: requestDetails.cost || 0,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Error tracking API usage:', error);
    throw error;
  }
};

export const createApiKey = async (
  userId: string,
  name: string,
  description?: string,
  permissions: string[] = ['read']
) => {
  const key = generateApiKey();
  
  try {
    return await prisma.apiKey.create({
      data: {
        key,
        name,
        description,
        userId,
        permissions,
        isActive: true,
      }
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

export const deactivateApiKey = async (keyId: string, userId: string) => {
  try {
    return await prisma.apiKey.update({
      where: { id: keyId, userId },
      data: { isActive: false }
    });
  } catch (error) {
    console.error('Error deactivating API key:', error);
    throw error;
  }
};