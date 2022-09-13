import { createSSGHelpers } from '@trpc/react/ssg';
import { TRPCError } from '@trpc/server';
import { GetServerSidePropsContext } from 'next';
import superjson from 'superjson';

import { UserPageLayout } from '@/features/layout/UserPage';
import { PostCard } from '@/features/post/components';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';
import { trpc } from '@/utils/trpc';

type Props = {
  username: string;
};

const UserPage = ({ username }: Props) => {
  const { data: user } = trpc.useQuery([
    'user.username-featured',
    { username },
  ]);
  console.log(user);

  return (
    <div>
      {user && (
        <UserPageLayout user={user}>
          <div className='space-y-4'>
            <h3 className='text-3xl text-white'>Featured Post</h3>
            {user.posts.length === 0 && (
              <p className='text-lg'>
                {user.username} hasn&apos;t featured any posts on their profile.
                Check back later, or perhaps give them a friendly nudge. 😇
              </p>
            )}
            {user.posts.map((p) => (
              <PostCard {...p} key={p.id} username={user.username} />
            ))}
          </div>
        </UserPageLayout>
      )}
    </div>
  );
};

export default UserPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const usernameParam = context.params?.['@username'] as string;
  const username = usernameParam.split('@')[1];

  try {
    await ssg.prefetchQuery('user.username-featured', { username });
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === 'NOT_FOUND')
        return {
          redirect: {
            destination: '/404',
            permanent: false,
          },
        };
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        return {
          redirect: {
            destination: '/500',
            permanent: false,
          },
        };
      }
    }
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}
