import { Post, User } from '@prisma/client';
import { createSSGHelpers } from '@trpc/react/ssg';
import { format, parseISO } from 'date-fns';
import { GetServerSidePropsContext } from 'next';
import { ReactElement, useMemo } from 'react';
import { IoWarning } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import superjson from 'superjson';
import {
  Bookmark,
  Bookmarks,
  ChevronUp,
  ExternalLink,
  Message,
} from 'tabler-icons-react';

import { prisma } from '@/lib/prisma';

import { BasicLayout } from '@/features/layout/Basic';
import {
  CommentForm,
  CommentList,
  PostAuthor,
} from '@/features/post/components';
import { CommentOnUser } from '@/features/post/types';
import { LinkContent } from '@/features/postpage';
import { Button } from '@/features/UI';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';
import { trpc } from '@/utils/trpc';

type Props = {
  post: Omit<Post, 'publishedAt'> & {
    comments: (Comment & {
      user: User;
    })[];
    author: User;
    _count: { comments: number; likes: number };
    publishedAt: string;
  };
};

const UserPostPage = ({ post }: Props) => {
  const utils = trpc.useContext();

  const { data } = trpc.useQuery(['comment.by-post-slug', { slug: post.slug }]);

  const { mutate: createComment } = trpc.useMutation('comment.create', {
    onSuccess: () => {
      utils.invalidateQueries(['comment.by-post-slug']);
    },
  });
  const commentsByParentId = useMemo(() => {
    const comments = data;
    const group: { [key: string]: CommentOnUser[] } = {};
    comments?.forEach((comment) => {
      const parentId = comment.parentId ?? 'null';
      group[parentId] ||= [];

      group[parentId].push(comment);
    });
    return group;
  }, [data]);

  const rootComments = data && commentsByParentId['null'];

  return (
    <div className='post-page md:px-8 max-w-full'>
      <header className='post-page-header'>
        <h1 className='not-prose text-center text-white text-3xl md:text-5xl'>
          {post.title}
        </h1>
        <div className='text-center my-8 text-lg'>
          by <PostAuthor author={post.author} />
        </div>
      </header>
      <div className='post-page-main flex flex-col'>
        <div className='prose prose-brand prose-a:text-brand-blue prose-a:hover:underline md:prose-lg prose-base xl:prose-xl 2xl:prose-2xl prose-p:font-normal prose-p:antialiased mx-auto prose-img:rounded prose-img:object-cover'>
          {post.postType === 'ARTICLE' && (
            <ReactMarkdown>{post.content}</ReactMarkdown>
          )}
        </div>
        {post.postType === 'LINK' && <LinkContent post={post} />}
        <div className='text-lg my-6'>
          <PostAuthor author={post.author} /> submitted this link{' '}
          <span>{format(parseISO(post.publishedAt), 'MMMM dd, yyyy')}</span>
        </div>

        <div className='not-prose text-brand-text font-normal text-lg'>
          <div className='my-8 flex gap-4'>
            <Button variant='outline' icon={<ChevronUp />}>
              83
            </Button>
            <Button variant='outline' icon={<Bookmark />}>
              23
            </Button>
            <Button variant='outline' icon={<ExternalLink />}></Button>
          </div>
          <CommentForm
            onSubmit={(content) => createComment({ content, postId: post.id })}
            initialValue=''
            buttonLabel='post comment'
          />
          {rootComments && (
            <CommentList
              postId={post.id}
              comments={rootComments}
              commentsByParentId={commentsByParentId}
            />
          )}
        </div>
      </div>
      <PostPageAction
        likes={post._count.likes}
        comments={post._count.comments}
        bookmarks={10}
      />
    </div>
  );
};

export default UserPostPage;

UserPostPage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);

const PostPageAction = ({ likes, comments, bookmarks }) => {
  return (
    <div className='post-page-action flex justify-between xl:flex-col xl:gap-5 xl:p-6 xl:rounded'>
      <div className='flex gap-3 items-center'>
        <Button
          variant='gradient'
          size='small'
          className='rounded-full h-8 w-8 p-0 flex justify-center items-center'
        >
          <ChevronUp className='h-6 w-6' />
        </Button>
        <div className='md:flex gap-1 lg:gap-2'>
          <span>{likes}</span>
          <span>{likes} Likes</span>
        </div>
      </div>
      <div className='md:flex hidden gap-3 items-center'>
        <Bookmarks className='h-6 w-6' />
        <div className='md:flex gap-1 lg:gap-2'>
          <span>1</span>
          <span>Bookmarks</span>
        </div>
      </div>
      <div className='md:flex hidden gap-3 items-center'>
        <Message className='h-6 w-6' />
        <div className='md:flex gap-1 lg:gap-2'>
          <span>{comments}</span>
          <span>Comments</span>
        </div>
      </div>
      <div className='flex gap-3 items-center'>
        <IoWarning className='h-6 w-6' />
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const slug = context.params?.slug as string;
  const username = context.params?.['@username'] as string;
  const user = await prisma.user.findUnique({
    where: {
      username: username.split('@')[1],
    },
    select: {
      posts: {
        where: { slug },

        include: {
          author: true,
          comments: { include: { user: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
  });
  const { json } = superjson.serialize(user?.posts[0]);

  return {
    props: {
      post: json,
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
