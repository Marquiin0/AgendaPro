import { PrismaClient } from '@prisma/client';

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
