import { Popover } from '@headlessui/react';
import { IoWarning } from 'react-icons/io5';
import ScrollIntoView from 'react-scroll-into-view';
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
  setScrolled: () => void;
};

export const PostPageAction = ({
  likes,
  comments,
  bookmarks,
  postId,
  setScrolled,
}: Props) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('private-posts.upvote', {
    onSuccess: () => {
      utils.invalidateQueries('public-posts.by-slug');
    },
  });
  return (
    <div className='post-page-action flex justify-between lg:flex-col lg:gap-5 lg:rounded lg:p-6 xl:flex-row 2xl:flex-col'>
      <div className='flex items-center gap-3'>
        <Button
          onClick={() => mutate({ id: postId })}
          variant='gradient'
          size='small'
          className='flex h-8 w-8 items-center justify-center rounded-full p-0'
        >
          <ChevronUp className='h-6 w-6' />
        </Button>
        <div className='gap-1 md:flex lg:gap-2'>
          <span>{likes}</span>
          <span>{likes > 0 ? 'Likes' : 'Like'} </span>
        </div>
      </div>
      <div className='hidden items-center gap-3 md:flex'>
        <Bookmarks className='h-6 w-6' />
        <div className='gap-1 md:flex lg:gap-2'>
          <span>{bookmarks}</span>
          <span>Bookmarks</span>
        </div>
      </div>
      <div className='hidden items-center gap-3 md:flex'>
        <Message className='h-6 w-6' />
        <ScrollIntoView selector='#comment-input' onClick={setScrolled}>
          <button className='gap-1 md:flex lg:gap-2'>
            <span>{comments}</span>
            <span>Comments</span>
          </button>
        </ScrollIntoView>
      </div>
      <div className='flex items-center gap-3'>
        <IoWarning className='h-6 w-6' />
      </div>
    </div>
  );
};

export const PostPageInlineAction = ({
  likes,
  bookmarks,
  postId,
}: {
  likes: number;
  bookmarks: number;
  postId: string;
}) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('private-posts.upvote', {
    onSuccess: () => {
      utils.invalidateQueries('public-posts.by-slug');
    },
  });
  return (
    <div className='my-8 flex gap-4'>
      <Button
        variant='outline'
        onClick={() => mutate({ id: postId })}
        icon={<ChevronUp />}
      >
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
      <Popover.Button className='inline-flex justify-center rounded border-2 border-gray-100/5 p-2.5 py-2 px-6 text-sm hover:text-green-500'>
        <Share className='group-hover:text-white' />
      </Popover.Button>

      <Popover.Panel className='absolute top-0 left-0 z-10 w-[12rem] rounded-lg'>
        <div className='divide-y-[1px] divide-gray-600'>
          <button className='inline-flex w-full items-center justify-start gap-4 rounded rounded-b-none bg-[#1f364d] py-3 px-2 text-sm uppercase text-white hover:bg-brand-blue'>
            <span>
              <ExternalLink className='h-5 w-5' />
            </span>
            <span>Copy Link</span>
          </button>
          <button className='inline-flex w-full items-center justify-start gap-4 bg-[#1f364d] py-3 px-2 text-sm text-white hover:bg-brand-blue'>
            <span>
              <BrandTwitter className='h-5 w-5' />
            </span>
            <span> Share On Twitter</span>
          </button>
          <button className='inline-flex w-full items-center justify-start gap-4 rounded rounded-t-none bg-[#1f364d] py-3 px-2 text-sm text-white hover:bg-brand-blue'>
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
