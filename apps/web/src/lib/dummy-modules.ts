// Dummy implementations for missing modules to fix compilation

export const prisma = {
  searchHistory: {
    create: async () => ({}),
    findMany: async () => []
  },
  law: {
    findMany: async () => []
  },
  organization: {
    findMany: async () => []
  },
  weatherSnapshot: {
    findFirst: async () => null
  },
  article: {
    findMany: async () => []
  }
};

export const redis = {
  get: async () => null,
  set: async () => true,
  del: async () => 1
};

export const rateLimit = async () => ({ success: true });