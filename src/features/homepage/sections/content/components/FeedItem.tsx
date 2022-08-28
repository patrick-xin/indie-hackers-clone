import { Post, User } from '@prisma/client';
import { motion } from 'framer-motion';
import Image from 'next/future/image';
import Link from 'next/link';
import { BiChevronUp, BiComment } from 'react-icons/bi';

import { AvatarPopover } from '@/features/user/components';
import { trpc } from '@/utils/trpc';

type Props = {
  post: Post & {
    author: Pick<User, 'username' | 'image'>;
    _count: {
      comments: number;
      likes: number;
    };
  };
};

const listItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const FeedItem = ({ post }: Props) => {
  return (
    <motion.div
      variants={listItem}
      className='flex flex-col rounded-sm bg-[#152C41] px-2 py-1 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:py-2 sm:px-4'
    >
      <div className='hidden sm:block'>
        <AvatarPopover user={post.author} />
      </div>
      <div className='hidden sm:block'>
        <Upvote count={post._count.likes} postId={post.id} />
      </div>
      <div className='flex flex-1 flex-col'>
        <Title
          title={post.title}
          slug={post.slug}
          author={post.author.username}
        />
        <div className='hidden items-center p-0.5 sm:flex'>
          <Comments
            count={post._count.comments}
            postType={post.postType}
            content={post.content}
            username={post.author.username}
          />
          <Group />
          {/* <div className='hidden lg:block'>
            <span className='mx-1'>·</span>
            <div className='text-sm text-[#63809c] rounded '>
              {format(post.publishedAt, 'yyyy-MM-dd')}
            </div>
          </div> */}

          {/* <span className='mx-1'>·</span>
          <div className='text-sm text-[#63809c] rounded'>
            {formatDistance(post.publishedAt, new Date(), {
              addSuffix: true,
            })}
          </div> */}
        </div>
      </div>

      <div className='mt-1 flex w-full items-center justify-start gap-4 sm:hidden'>
        <Upvote count={post._count.likes} postId={post.id} />
        <MobileComments count={post._count.comments} />
        <Group />
      </div>
    </motion.div>
  );
};

const Upvote = ({ count, postId }: { count: number; postId: string }) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('private-posts.upvote', {
    onSuccess: () => {
      utils.invalidateQueries('public-posts.newest');
    },
  });
  return (
    <button
      onClick={() => {
        mutate({ id: postId });
      }}
      className='group flex cursor-pointer items-center text-[#63809c]  sm:-mt-2 sm:flex-col sm:gap-4'
    >
      <BiChevronUp className='h-8 w-8 group-hover:text-red-500' />
      <div className='text-sm group-hover:text-white sm:-mt-6'>{count}</div>
    </button>
  );
};

const MobileComments = ({ count }: { count: number }) => {
  return (
    <div className='flex gap-4'>
      <div className='hidden rounded p-1 hover:bg-[#1E364D] hover:text-white'>
        link
      </div>
      <span className='hidden'>·</span>
      <div className='flex items-center gap-2 rounded p-1 text-[#63809c] hover:bg-[#1E364D] hover:text-gray-400'>
        <BiComment />
        <div className='text-sm group-hover:text-white sm:-mt-6'>{count}</div>
      </div>
    </div>
  );
};

const Comments = ({
  count,
  postType,
  content,
  username,
}: {
  count: number;
  postType: 'LINK' | 'ARTICLE';
  content: string;
  username: string | null;
}) => {
  const linkContent = postType === 'LINK' && JSON.parse(content);

  return (
    <div className='flex items-center gap-2'>
      <div className='rounded hover:bg-[#1E364D] hover:text-white sm:p-1'>
        {postType === 'LINK' ? (
          <a href={linkContent.ogUrl} rel='nofollow noreferrer' target='_blank'>
            {linkContent.ogUrl}
          </a>
        ) : (
          <div>{username && username}</div>
        )}
      </div>
      <div className='rounded text-[#63809c] hover:bg-[#1E364D] hover:text-gray-400 sm:p-1'>
        <div className='text-sm group-hover:text-white'>· {count} comments</div>
      </div>
    </div>
  );
};

const Title = ({
  title,
  slug,
  author,
}: {
  title: string | null;
  slug: string;
  author: string | null;
}) => {
  return (
    <h2 className='md:text-["#b6cce2"] rounded px-2 py-1 hover:bg-[#1E364D] hover:text-white sm:text-lg'>
      <Link href={`/@${author}/${slug}`}>
        <a className='visited:text-white'>{title}</a>
      </Link>
    </h2>
  );
};

const Group = () => {
  return (
    <div className='flex items-center gap-2 p-1'>
      <div className='rounded hover:bg-[#1E364D] hover:text-white'>
        <Image
          src='/group-logo.webp'
          width={24}
          height={24}
          className='rounded-full'
          alt='group-image'
        />
      </div>
      <div className='rounded text-sm text-[#63809c] hover:bg-[#1E364D] hover:text-gray-400'>
        group name
      </div>
    </div>
  );
};
