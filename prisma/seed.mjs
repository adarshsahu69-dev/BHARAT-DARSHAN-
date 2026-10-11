import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

function requireDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set — export it in .env.local (see .env.example)');
  }
}

async function main() {
  requireDatabaseUrl();
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const email = (process.env.ADMIN_EMAIL || 'admin@bharatdarshan.local').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: Role.ADMIN, emailVerified: true, name: 'Administrator' },
    create: { email, passwordHash, role: Role.ADMIN, emailVerified: true, name: 'Administrator' },
  });
  console.log(`Admin user ready: ${email}`);
  if (!process.env.ADMIN_PASSWORD) console.warn('Default password in use — change it after first login.');
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});
