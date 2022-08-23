import { Post, User } from '@prisma/client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Image from 'next/future/image';
import Link from 'next/link';
import { BiChevronUp, BiComment } from 'react-icons/bi';

import { AvatarPopover } from '@/features/user/components';
import { trpc } from '@/utils/trpc';

type Props = {
  post: Post & {
    author: User;
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
      className='px-2 py-1 sm:py-2 sm:px-4 shadow-sm bg-[#152C41] flex flex-col sm:gap-4 rounded-sm sm:items-center sm:flex-row'
    >
      <div className='hidden sm:block'>
        <AvatarPopover user={post.author} />
      </div>
      <div className='hidden sm:block'>
        <Upvote count={post._count.likes} postId={post.id} />
      </div>
      <div className='flex flex-col flex-1'>
        <Title
          title={post.title}
          slug={post.slug}
          author={post.author.username}
        />
        <div className='items-center hidden p-1 sm:flex'>
          <Comments count={post._count.comments} />
          <Group />
          <div className='hidden lg:block'>
            <span className='mx-1'>·</span>
            <div className='text-sm text-[#63809c] rounded '>
              {format(post.publishedAt, 'yyyy-MM-dd')}
            </div>
          </div>

          {/* <span className='mx-1'>·</span>
          <div className='text-sm text-[#63809c] rounded'>
            {formatDistance(post.publishedAt, new Date(), {
              addSuffix: true,
            })}
          </div> */}
        </div>
      </div>

      <div className='flex gap-4 items-center justify-start w-full mt-1 sm:hidden'>
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
      utils.invalidateQueries('public-posts.infinitePosts-newest');
    },
  });
  return (
    <button
      onClick={() => {
        mutate({ id: postId });
      }}
      className='flex items-center sm:flex-col sm:gap-4 sm:-mt-2  text-[#63809c] group cursor-pointer'
    >
      <BiChevronUp className='h-8 w-8 group-hover:text-red-500' />
      <div className='text-sm group-hover:text-white sm:-mt-6'>{count}</div>
    </button>
  );
};

const MobileComments = ({ count }: { count: number }) => {
  return (
    <div className='flex gap-4'>
      <div className='hover:bg-[#1E364D] p-1 hover:text-white rounded hidden'>
        link
      </div>
      <span className='hidden'>·</span>
      <div className='hover:bg-[#1E364D] p-1 flex gap-2 items-center text-[#63809c] hover:text-gray-400 rounded'>
        <BiComment />
        <div className='text-sm group-hover:text-white sm:-mt-6'>{count}</div>
      </div>
    </div>
  );
};

const Comments = ({ count }: { count: number }) => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='hover:bg-[#1E364D] sm:p-1 hover:text-white rounded'>
        link
      </div>
      <div className='hover:bg-[#1E364D] sm:p-1 text-[#63809c] hover:text-gray-400 rounded'>
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
    <h2 className='hover:bg-[#1E364D] px-2 py-1 rounded text-white sm:text-lg md:text-["#b6cce2"] hover:text-white'>
      <Link href={`/@${author}/${slug}`}>
        <a>{title}</a>
      </Link>
    </h2>
  );
};

const Group = () => {
  return (
    <div className='flex gap-2 items-center p-1'>
      <div className='hover:bg-[#1E364D] hover:text-white rounded'>
        <Image
          src='/avatar.webp'
          width={32}
          height={32}
          className='rounded-full'
          alt='group-image'
        />
      </div>
      <div className='hover:bg-[#1E364D] text-sm text-[#63809c] hover:text-gray-400 rounded'>
        group name
      </div>
    </div>
  );
};
