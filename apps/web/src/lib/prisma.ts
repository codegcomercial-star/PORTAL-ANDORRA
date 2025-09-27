// Mock Prisma client for development
export const prisma = {
  // User management
  user: {
    create: async (data: any) => ({ id: 'mock-user', ...data.data }),
    findFirst: async (options: any) => null,
    findUnique: async (options: any) => null,
    findMany: async (options: any) => [],
    update: async (data: any) => ({ id: 'mock-user', ...data.data }),
    delete: async (data: any) => ({ id: 'mock-user' })
  },
  
  // Search history
  searchHistory: {
    create: async (data: any) => ({ id: 'mock-search', ...data.data }),
    findMany: async (options: any) => [],
    findFirst: async (options: any) => null
  },
  
  // Laws and regulations
  law: {
    create: async (data: any) => ({ id: 'mock-law', ...data.data }),
    findMany: async (options: any) => [],
    findFirst: async (options: any) => null
  },
  
  // Organizations
  organization: {
    create: async (data: any) => ({ id: 'mock-org', ...data.data }),
    findMany: async (options: any) => [],
    findFirst: async (options: any) => null
  },
  
  // Weather data
  weatherSnapshot: {
    create: async (data: any) => ({ id: 'mock-weather', ...data.data }),
    findMany: async (options: any) => [],
    findFirst: async (options: any) => null
  },
  
  // Articles/News
  article: {
    create: async (data: any) => ({ id: 'mock-article', ...data.data }),
    findMany: async (options: any) => [],
    findFirst: async (options: any) => null,
    update: async (data: any) => ({ id: 'mock-article', ...data.data })
  },
  
  // BOPA entries
  bopaEntry: {
    create: async (data: any) => ({ id: 'mock-bopa', ...data.data }),
    findMany: async (options: any) => [],
    findFirst: async (options: any) => null
  },
  
  // BOPA alerts
  bopaAlert: {
    create: async (data: any) => ({ id: 'mock-alert', ...data.data }),
    findMany: async (options: any) => [],
    findFirst: async (options: any) => null
  }
};