import { createSSGHelpers } from '@trpc/react/ssg';
import { TRPCError } from '@trpc/server';
import { GetServerSidePropsContext } from 'next';
import superjson from 'superjson';

import { UserPageLayout } from '@/features/layout/UserPage';
import { BookmarkCard } from '@/features/post/components';
import { useGetUserBookmarks } from '@/features/user/unauth/api';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';

type Props = {
  username: string;
};

const UserPage = ({ username }: Props) => {
  const { data: user } = useGetUserBookmarks({ username });

  return (
    <UserPageLayout>
      <div className='space-y-4'>
        {user?.bookmarks.length === 0 && (
          <p className='text-lg'>
            {user?.username} hasn&apos;t bookmarked any posts.
          </p>
        )}
        <div className='space-y-6'>
          {user?.bookmarks.map((bookmark) => (
            <BookmarkCard bookmark={bookmark} key={bookmark.id} />
          ))}
        </div>
      </div>
    </UserPageLayout>
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
    await ssg.fetchQuery('user.username-bookmark', { username });
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        return {
          redirect: {
            destination: '/404',
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
