import { Popover } from '@headlessui/react';
import { IoWarning } from 'react-icons/io5';
import {
  Bookmark,
  Bookmarks,
  BrandFacebook,
  BrandTwitter,
  ChevronUp,
  ExternalLink,
  Message,
  Share,
} from 'tabler-icons-react';

import { Button } from '@/features/UI';
import { trpc } from '@/utils/trpc';

type Props = {
  likes: number;
  comments: number;
  bookmarks: number;
  postId: string;
};

export const PostPageAction = ({
  likes,
  comments,
  bookmarks,
  postId,
}: Props) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('private-posts.upvote', {
    onSuccess: () => {
      utils.invalidateQueries('public-posts.by-slug');
    },
  });
  return (
    <div className='post-page-action flex justify-between xl:flex-col xl:gap-5 xl:p-6 xl:rounded'>
      <div className='flex gap-3 items-center'>
        <Button
          onClick={() => mutate({ id: postId })}
          variant='gradient'
          size='small'
          className='rounded-full h-8 w-8 p-0 flex justify-center items-center'
        >
          <ChevronUp className='h-6 w-6' />
        </Button>
        <div className='md:flex gap-1 lg:gap-2'>
          <span>{likes}</span>
          <span>{likes > 0 ? 'Likes' : 'Like'} </span>
        </div>
      </div>
      <div className='md:flex hidden gap-3 items-center'>
        <Bookmarks className='h-6 w-6' />
        <div className='md:flex gap-1 lg:gap-2'>
          <span>{bookmarks}</span>
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

export const PostPageInlineAction = ({
  likes,
  comments,
  bookmarks,
  postId,
}: Props) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('private-posts.upvote', {
    onSuccess: () => {
      utils.invalidateQueries('public-posts.by-slug');
    },
  });
  return (
    <div className='my-8 flex gap-4'>
      <Button variant='outline' icon={<ChevronUp />}>
        {likes}
      </Button>
      <Button
        variant='outline'
        icon={<Bookmark className='group-hover:text-red-500' />}
      >
        {bookmarks}
      </Button>
      <ShareButton />
    </div>
  );
};

const ShareButton = () => {
  return (
    <Popover className='relative'>
      <Popover.Button className='border-2 py-2 px-6 inline-flex justify-center text-sm border-gray-100/5 p-2.5 hover:text-green-500 rounded'>
        <Share className='group-hover:text-white' />
      </Popover.Button>

      <Popover.Panel className='absolute top-0 left-0 z-10 w-[12rem] rounded-lg'>
        <div className='divide-y-[1px] divide-gray-600'>
          <button className='w-full text-sm gap-4 justify-start inline-flex items-center hover:bg-brand-blue bg-[#1f364d] py-3 px-2 text-white uppercase rounded rounded-b-none'>
            <span>
              <ExternalLink className='h-5 w-5' />
            </span>
            <span>Copy Link</span>
          </button>
          <button className='w-full text-sm gap-4 justify-start inline-flex items-center hover:bg-brand-blue bg-[#1f364d] py-3 px-2 text-white'>
            <span>
              <BrandTwitter className='h-5 w-5' />
            </span>
            <span> Share On Twitter</span>
          </button>
          <button className='w-full text-sm gap-4 justify-start inline-flex items-center hover:bg-brand-blue bg-[#1f364d] py-3 px-2 text-white rounded rounded-t-none'>
            <span>
              <BrandFacebook className='h-5 w-5' />
            </span>
            <span>Share On Facebook</span>
          </button>
        </div>
      </Popover.Panel>
    </Popover>
  );
};
