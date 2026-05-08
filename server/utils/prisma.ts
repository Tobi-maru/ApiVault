import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Cache Prisma client in globalThis to prevent connection pool exhaustion
// in serverless environments like Vercel where processes are frozen/thawed.
globalForPrisma.prisma = prisma;

export default prisma;
