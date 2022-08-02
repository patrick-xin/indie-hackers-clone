import { PrismaClient } from '@prisma/client';
import { tracks } from './seeds/tracks';

const prisma = new PrismaClient();

async function main() {
  await prisma.track.createMany({
    data: tracks,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
