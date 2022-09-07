import { createSSGHelpers } from '@trpc/react/ssg';
import { TRPCError } from '@trpc/server';
import { GetServerSidePropsContext } from 'next';
import { ReactElement, useMemo, useState } from 'react';
import superjson from 'superjson';

import { PostPageLayout } from '@/features/layout/PostPage';
import { CommentOnUser } from '@/features/post/types';
import {
  PostPageAction,
  PostPageComment,
  PostPageFooter,
  PostPageHeader,
} from '@/features/postpage';
import { PostPageBody } from '@/features/postpage/sections/components/PostPageBody';
import { FullScreenLoader } from '@/features/UI';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';
import { trpc } from '@/utils/trpc';

type Props = {
  username: string;
  slug: string;
};

const UserPostPage = ({ username, slug }: Props) => {
  const { data: post, isLoading } = trpc.useQuery([
    'public-posts.by-slug',
    { slug, username },
  ]);

  const commentsByParentId = useMemo(() => {
    const comments = post?.comments;
    const group: { [key: string]: CommentOnUser[] } = {};
    comments?.forEach((comment) => {
      const parentId = comment.parentId ?? 'null';
      group[parentId] ||= [];

      group[parentId].push(comment);
    });
    return group;
  }, [post]);
  const [hasScrolled, setScrolled] = useState(false);
  const rootComments = post && commentsByParentId['null'];
  if (isLoading || !post) return <FullScreenLoader />;
  return (
    <div className='post-page max-w-full md:px-8'>
      <PostPageHeader post={post} />
      <div className='post-page-main flex flex-col'>
        <PostPageBody post={post} />
        <PostPageFooter post={post} />
        <PostPageComment
          rootComments={rootComments}
          postId={post.id}
          commentsByParentId={commentsByParentId}
          hasScrolled={hasScrolled}
        />
      </div>
      <PostPageAction
        postId={post.id}
        likes={post._count.likes}
        comments={post._count.comments}
        bookmarks={post._count.markedBy}
        setScrolled={() => setScrolled(true)}
      />
    </div>
  );
};

export default UserPostPage;

UserPostPage.getLayout = (page: ReactElement) => (
  <PostPageLayout>{page}</PostPageLayout>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const slug = context.params?.slug as string;
  const usernameParam = context.params?.['@username'] as string;
  const username = usernameParam.split('@')[1];
  try {
    await ssg.fetchQuery('public-posts.by-slug', { username, slug });
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
      slug,
    },
  };
}
/* {post && (
        <Blocks
          data={post.content}
          config={{
            code: {
              className: 'language-js',
            },
            delimiter: {
              className: 'border border-2 w-16 mx-auto',
            },
            embed: {
              className: 'border-0',
            },
            header: {
              className: 'font-bold',
            },
            image: {
              className: 'w-full max-w-screen-md',
              actionsClassNames: {
                stretched: 'w-full h-80 object-cover',
                withBorder: 'border border-2',
                withBackground: 'p-2',
              },
            },
            list: {
              className: 'list-inside list-disc',
            },
            paragraph: {
              className: 'text-base text-opacity-75 py-2 lg:py-4 lg:text-lg ',
              actionsClassNames: {
                alignment: 'text-{alignment}', // This is a substitution placeholder: left or center.
              },
            },
            quote: {
              className: 'py-3 px-5 italic font-serif',
            },
            table: {
              className: 'table-auto',
            },
          }}
        />
      )} */
