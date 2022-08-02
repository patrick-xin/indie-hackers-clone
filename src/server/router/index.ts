// src/server/router/index.ts
import superjson from 'superjson';

import { privatePostRouter } from '@/server/router/post-private';
import { publicPostRouter } from '@/server/router/post-public';
import { userRouter } from '@/server/router/user';

import { authRouter } from './auth';
import { createRouter } from './context';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('auth.', authRouter)
  .merge('private-posts.', privatePostRouter)
  .merge('public-posts.', publicPostRouter)
  .merge('user.', userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;