import { PrismaClient, Role, Verification } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export { PrismaClient, Role, Verification };

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set — export it in .env.local (see .env.example)',
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

function resolvePrismaClient(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = resolvePrismaClient();
    const value = Reflect.get(client, property, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
  has(_target, property) {
    return Reflect.has(resolvePrismaClient(), property);
  },
  set(_target, property, value) {
    return Reflect.set(resolvePrismaClient(), property, value);
  },
});
