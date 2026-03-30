import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Barbearia', slug: 'barbearia', iconName: 'Scissors' },
  { name: 'Clínica', slug: 'clinica', iconName: 'Stethoscope' },
  { name: 'Estúdio', slug: 'estudio', iconName: 'Camera' },
  { name: 'Consultoria', slug: 'consultoria', iconName: 'Briefcase' },
  { name: 'Academia', slug: 'academia', iconName: 'Dumbbell' },
  { name: 'Spa', slug: 'spa', iconName: 'Sparkles' },
  { name: 'Outro', slug: 'outro', iconName: 'Building2' },
];

async function main() {
  console.log('Seeding business categories...');

  for (const category of categories) {
    await prisma.businessCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`Seeded ${categories.length} categories.`);

  // Seed SUPER_ADMIN user
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@agendapro.com';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
  const passwordHash = await bcrypt.hash(superAdminPassword, 10);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: superAdminEmail,
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`Seeded SUPER_ADMIN user: ${superAdminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
