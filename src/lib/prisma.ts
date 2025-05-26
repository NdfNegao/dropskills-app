// Prisma client placeholder - à configurer plus tard
// Pour éviter les erreurs de build, nous utilisons un mock temporaire

interface MockPrismaClient {
  user: any;
  pack: any;
  log: any;
  adminLog: any;
  supportTicket: any;
  admin: any;
  subscription: any;
  webhook: any;
  tool: any;
  iaTool: any;
  iaToolUsage: any;
  packUser: any;
  webhookEvent: any;
  $disconnect: () => Promise<void>;
}

const createMockPrisma = (): MockPrismaClient => ({
  user: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
  },
  pack: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
  },
  log: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
  },
  adminLog: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
  },
  admin: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  supportTicket: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
  },
  subscription: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  webhook: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
  },
  tool: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  iaTool: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
  },
  iaToolUsage: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
    aggregate: () => Promise.resolve({ _sum: { credits: 0 } }),
  },
  packUser: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
    aggregate: () => Promise.resolve({ _sum: { price: 0 } }),
  },
  webhookEvent: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
  },
  $disconnect: () => Promise.resolve(),
});

const globalForPrisma = globalThis as unknown as {
  prisma: MockPrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createMockPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 