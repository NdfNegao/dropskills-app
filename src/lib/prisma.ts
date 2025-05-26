// Prisma client placeholder - à configurer plus tard
// Pour éviter les erreurs de build, nous utilisons un mock temporaire

interface MockPrismaClient {
  user: any;
  pack: any;
  log: any;
  supportTicket: any;
  $disconnect: () => Promise<void>;
}

const createMockPrisma = (): MockPrismaClient => ({
  user: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  pack: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  log: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
  },
  supportTicket: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
  },
  $disconnect: () => Promise.resolve(),
});

const globalForPrisma = globalThis as unknown as {
  prisma: MockPrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createMockPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 