import { faker } from '@faker-js/faker';
import { Post } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import cuid from 'cuid';

import { createRouter } from './context';

const random = Math.floor(Math.random() * 60);

export const adminRouter = createRouter()
  .query('users', {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        include: {
          _count: { select: { comment: true, likes: true } },

          // image: true,
          // followers: true,
          // following: true,
          // profile: {
          //   select: {
          //     about: true,
          //   },
          // },
        },
      });

      return users;
    },
  })
  .query('posts', {
    async resolve({ ctx }) {
      const posts = await ctx.prisma.post.findMany({
        include: {
          // _count: { select: { comment: true } },

          author: {
            select: {
              username: true,
            },
          },
          _count: {
            select: { likes: true },
          },
          // image: true,
          // followers: true,
          // following: true,
          // profile: {
          //   select: {
          //     about: true,
          //   },
          // },
        },
      });

      return posts;
    },
  })
  .mutation('generate-posts', {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany();

      const createPost = () => {
        const date = faker.date.between(
          '2020-01-01T00:00:00.000Z',
          '2022-08-04T00:00:00.000Z'
        );

        const post: Post = {
          slug: faker.lorem.slug(),
          title: faker.lorem.text(),
          content: faker.lorem.paragraphs(),
          view_count: 0,
          authorId: users[random].id,
          createdAt: date,
          isPublished: true,
          id: cuid(),
          publishedAt: date,
          updatedAt: date,
          status: 'PUBLISHED',
          categoryId: 'cl5l5fdvz1437ca0wnt355w2t',
        };

        return post;
      };

      const createPosts = (numPosts = 100) => {
        return Array.from({ length: numPosts }, createPost);
      };
      const createLikes = () => {
        return Array.from({ length: Math.floor(Math.random() * 200) }, () => ({
          userId: users[random].id,
        }));
      };
      const posts = createPosts();
      for (const post of posts) {
        await ctx.prisma.post.create({
          data: {
            ...post,

            likes: {
              createMany: {
                data: createLikes(),
              },
            },
          },
        });
      }
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  });
