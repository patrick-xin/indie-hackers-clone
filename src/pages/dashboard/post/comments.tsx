import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { z } from 'zod';

import { DashboardLayout } from '@/features/layout/Dashboard';
import { Flex } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const DashboardCommentPage = () => {
  const orderOptions = z.enum(['creation', 'default']);
  type OrderOptions = z.infer<typeof orderOptions>;
  const [selectedPostType, setSelectedPostType] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderOptions>(
    orderOptions.Enum.default
  );
  const { data: comments } = trpc.useQuery([
    'auth.comments',
    { order: selectedOrder },
  ]);

  const noComments = comments?.length === 0;
  return (
    <div className='mx-12'>
      <div className='flex items-center justify-between'>
        {noComments ? (
          <h1 className='text-3xl text-white'>
            You havn&#39;t commented on any posts.
          </h1>
        ) : (
          <h1 className='text-3xl text-white'>
            My Comments <span>({comments?.length})</span>
          </h1>
        )}
      </div>
      <DashboardCommentList comments={comments} />
    </div>
  );
};

export default DashboardCommentPage;

DashboardCommentPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const DashboardCommentList = ({
  comments,
}: {
  comments:
    | {
        post: {
          title: string;
          slug: string;
          author: {
            username: string;
          };
        };
        content: string;
        id: string;
      }[]
    | undefined;
}) => {
  return (
    <ul className='space-y-4'>
      {comments?.map((comment) => (
        <li key={comment.id} className='rounded-md bg-indigo-300/10 px-4 py-3'>
          <Flex className='items-center justify-between'>
            <div className='space-y-4 py-3'>
              <div className='flex items-center gap-4'>
                <div className='mb-1 italic'>
                  commented on{' '}
                  <span className='text-white'>{comment.post.title}</span>
                  {/* <span className='text-white'>
                    {format(post.markedCreatedAt, 'LLLL dd, yyyy')}
                  </span> */}
                </div>
              </div>
              <div>
                <Link
                  href={`/@${comment.post.author.username}/${comment.post.slug}#${comment.id}`}
                >
                  <a>
                    <h2 className='text-2xl text-white'>{comment.content}</h2>
                  </a>
                </Link>
              </div>
            </div>
          </Flex>
        </li>
      ))}
    </ul>
  );
};
