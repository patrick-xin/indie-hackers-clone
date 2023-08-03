import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import cuid from 'cuid';

const createUser = () => {
  const user: User = {
    createdAt: new Date(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    emailVerified: new Date(),
    id: cuid(),
    image: faker.internet.avatar(),
    name: faker.name.firstName(),
    role: 'viewer',
    notificationOfFollowers: true,
    reportId: '',
    usernameUpdatedAt: new Date(),
    notificationOfPost: true,
  };
  return user;
};

export const createUsers = (numPosts = 60) => {
  return Array.from({ length: numPosts }, createUser);
};
