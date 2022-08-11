import { useRouter } from 'next/router';
import { ReactElement, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bookmark,
  Bookmarks,
  ChevronUp,
  ExternalLink,
  Message,
} from 'tabler-icons-react';

import { BasicLayout } from '@/features/layout/Basic';
import { CommentForm } from '@/features/post/components';
import { CommentList } from '@/features/post/components/PostComment';
import { CommentOnUser } from '@/features/post/types';
import { Button, ButtonLink, FullScreenLoader } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const UserPostPage = () => {
  const { query } = useRouter();
  const utils = trpc.useContext();
  const slug = query.slug as string;
  const username = query['@username'] as string;

  const { data: post, isLoading } = trpc.useQuery(
    ['public-posts.by-slug', { slug, username: username?.split('@')[1] }],
    { enabled: Boolean(slug) && Boolean(username) }
  );

  const { mutate: createComment } = trpc.useMutation('comment.create', {
    onSuccess: () => {
      utils.invalidateQueries(['public-posts.by-slug']);
    },
  });
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

  const rootComments = commentsByParentId['null'];

  if (!post || isLoading) return <FullScreenLoader />;

  return (
    <div className='relative flex'>
      <div className='fixed top-1/3 left-[10%] p-6 bg-[#1E364D] rounded space-y-5'>
        <div className='flex gap-3 items-center'>
          <Button
            size='small'
            className='rounded-full h-8 w-8 p-0 flex justify-center items-center'
          >
            <ChevronUp className='h-6 w-6' />
          </Button>
          <div>1 like</div>
        </div>
        <div className='flex gap-3 items-center'>
          <Bookmarks className='h-6 w-6' />
          <div>1 Bookmarks</div>
        </div>
        <div className='flex gap-3 items-center'>
          <Message className='h-6 w-6' />
          <div>1 Comments</div>
        </div>
      </div>
      <div className='prose min-h-screen prose-brand mx-auto lg:prose-lg xl:prose-xl 2xl:prose-2xl'>
        <h1 className='not-prose'>{post.title}</h1>

        <div>by {post.author.username}</div>
        <div className='prose prose-brand prose-a:text-brand-blue prose-a:hover:underline xl:prose-xl 2xl:prose-2xl mx-auto prose-img:rounded prose-img:object-cover'>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <ButtonLink href={`/dashboard/post/${post.id}`}>edit</ButtonLink>

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
    </div>
  );
};

export default UserPostPage;

UserPostPage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);

{
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
}
