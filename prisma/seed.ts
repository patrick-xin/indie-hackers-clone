import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

import { createPosts } from './seeds/posts';
import { createUsers } from './seeds/users';

const prisma = new PrismaClient();

const seed = async () => {
  const posts = createPosts();
  const users = createUsers();
  const random = Math.floor(Math.random() * users.length);
  await prisma.user.createMany({ data: users });
  for (const post of posts) {
    await prisma.post.create({
      data: {
        ...post,
        authorId: users[random].id,
        postType: 'ARTICLE',
      },
    });
    await prisma.comment.create({
      data: {
        content: faker.lorem.paragraphs(),
        postId: post.id,
        userId: users[random].id,
      },
    });
    await prisma.postLike.create({
      data: {
        postId: post.id,
        userId: users[random].id,
      },
    });
  }
};

async function main() {
  //await prisma.comment.deleteMany();
  //await prisma.post.deleteMany();
  //await prisma.user.deleteMany();
  await seed();
  //test();
  // prisma.post.createMany({
  //   data: createPosts(),
  // });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
