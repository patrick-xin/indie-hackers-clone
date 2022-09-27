import { useSession } from 'next-auth/react';
import { IoWarning } from 'react-icons/io5';
import {
  MdBookmark,
  MdBookmarkAdd,
  MdBookmarkRemove,
  MdOutlineExpandLess,
  MdOutlineExpandMore,
} from 'react-icons/md';
import ScrollIntoView from 'react-scroll-into-view';
import {
  Bookmark,
  BrandFacebook,
  BrandTwitter,
  ChevronUp,
  ExternalLink,
  Message,
  Share,
} from 'tabler-icons-react';

import {
  useAddPostToBookmark,
  useCancleUpvotePost,
  useRemovePostFromBookmark,
  useUpvotePost,
} from '@/features/postpage/api';
import { ActionPopover } from '@/features/postpage/components/ActionPopover';
import { Button, IconButton } from '@/features/UI';
import { AuthWrapper } from '@/features/UI/AuthWrapper';
import { useMe } from '@/features/user/auth/api';

type Props = {
  likes: number;
  comments: number;
  bookmarks: number;
  postId: string;
  setScrolled: () => void;
  openModal: () => void;
};

export const PostPageAction = ({
  likes,
  comments,
  bookmarks,
  postId,
  setScrolled,
  openModal,
}: Props) => {
  return (
    <div className='post-page-action flex justify-between px-4 lg:gap-5 lg:rounded lg:p-6 xl:flex-col'>
      <LikeAction postId={postId} likes={likes} variant='gradient' />
      <BookmarkAction
        postId={postId}
        bookmarks={bookmarks}
        variant='gradient'
      />
      <CommentAction setScrolled={setScrolled} comments={comments} />
      <ReportAction openModal={openModal} />
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
  return (
    <div className='my-8 flex gap-4'>
      <LikeAction postId={postId} likes={likes} variant='transparent' />
      <BookmarkAction
        postId={postId}
        bookmarks={bookmarks}
        variant='transparent'
      />
      <ShareAction />
    </div>
  );
};

const LikeAction = ({
  variant,
  likes,
  postId,
}: {
  variant: 'transparent' | 'gradient';
  likes: number;
  postId: string;
}) => {
  const { data: session } = useSession();
  const { data } = useMe({ postId });

  const { upvote } = useUpvotePost();
  const { cancleUpvote } = useCancleUpvotePost();
  const handleUpvote = () => {
    if (!session) return;
    upvote({ id: postId });
  };
  const handleCancleUpvote = () => {
    if (!session) return;
    cancleUpvote({ id: postId });
  };

  return (
    <div className='flex items-center gap-3'>
      {variant === 'gradient' ? (
        <AuthWrapper>
          {session ? (
            data?.canLike ? (
              <Button
                onClick={handleUpvote}
                variant='gradient'
                size='small'
                className='flex h-8 w-8 items-center justify-center rounded-full p-0'
              >
                <MdOutlineExpandLess className='h-6 w-6' />
              </Button>
            ) : (
              <Button
                variant='gradient'
                size='small'
                className='flex h-8 w-8 items-center justify-center rounded-full p-0'
                onClick={handleCancleUpvote}
              >
                <MdOutlineExpandMore className='h-6 w-6' />
              </Button>
            )
          ) : (
            <Button
              variant='gradient'
              size='small'
              className='flex h-8 w-8 items-center justify-center rounded-full p-0'
            >
              <MdOutlineExpandLess className='h-6 w-6' />
            </Button>
          )}
        </AuthWrapper>
      ) : (
        <AuthWrapper>
          {session ? (
            data?.canLike ? (
              <Button
                variant='outline'
                icon={<ChevronUp className='group-hover:text-red-500' />}
                onClick={handleUpvote}
              >
                {likes}
              </Button>
            ) : (
              <Button
                variant='outline'
                icon={<ChevronUp className='group-hover:text-red-500' />}
                onClick={handleCancleUpvote}
              >
                {likes}
              </Button>
            )
          ) : (
            <Button
              variant='gradient'
              size='small'
              className='flex h-8 w-8 items-center justify-center rounded-full p-0'
            >
              <MdOutlineExpandLess className='h-6 w-6' />
              <span>{likes}</span>
            </Button>
          )}
        </AuthWrapper>
      )}
      {variant === 'gradient' && (
        <div className='flex gap-1 text-white lg:gap-2'>
          <span>{likes}</span>
          <span>{likes > 1 ? 'Likes' : 'Like'}</span>
        </div>
      )}
    </div>
  );
};

const BookmarkAction = ({
  variant,
  bookmarks,
  postId,
}: {
  variant: 'transparent' | 'gradient';
  bookmarks: number;
  postId: string;
}) => {
  const { data: session } = useSession();
  const { data } = useMe({ postId });
  const { addPostToBookmark, isAdding } = useAddPostToBookmark();
  const { removePostFromBookmark, isRemoving } = useRemovePostFromBookmark();
  const handleAdd = () => {
    if (!session) return;
    addPostToBookmark({ id: postId });
  };
  const handleRemove = () => {
    if (!session) return;
    removePostFromBookmark({ id: postId });
  };

  return (
    <div>
      {variant === 'gradient' ? (
        <div className='hidden gap-3 md:flex md:items-center'>
          <AuthWrapper>
            {session ? (
              data?.canBookmark ? (
                <Button
                  disabled={isAdding}
                  onClick={handleAdd}
                  variant='transparent'
                  size='small'
                  className='flex h-8 w-8 items-center justify-center rounded-full p-0'
                >
                  <MdBookmarkAdd className='h-6 w-6' />
                </Button>
              ) : (
                <Button
                  disabled={isRemoving}
                  variant='transparent'
                  size='small'
                  className='flex h-8 w-8 items-center justify-center rounded-full p-0'
                  onClick={handleRemove}
                >
                  <MdBookmarkRemove className='h-6 w-6' />
                </Button>
              )
            ) : (
              <Button
                variant='transparent'
                size='small'
                className='flex h-8 w-8 items-center justify-center rounded-full p-0'
              >
                <MdBookmark className='h-6 w-6' />
              </Button>
            )}
          </AuthWrapper>

          <div className='gap-1 md:flex lg:gap-2'>
            <span>{bookmarks}</span>
            <span>Bookmarks</span>
          </div>
        </div>
      ) : (
        <AuthWrapper>
          {data?.canBookmark ? (
            <Button
              disabled={isAdding}
              onClick={handleAdd}
              variant='outline'
              icon={<Bookmark className='group-hover:text-red-500' />}
            >
              {bookmarks}
            </Button>
          ) : (
            <Button
              disabled={isRemoving}
              onClick={handleRemove}
              variant='outline'
              icon={<Bookmark className='group-hover:text-red-500' />}
            >
              {bookmarks}
            </Button>
          )}
        </AuthWrapper>
      )}
    </div>
  );
};

const CommentAction = ({
  comments,
  setScrolled,
}: {
  comments: number;
  setScrolled: () => void;
}) => {
  return (
    <div className='hidden gap-3 md:flex md:items-center'>
      <Message className='h-6 w-6' />
      <ScrollIntoView selector='#comment-input' onClick={setScrolled}>
        <button className='gap-1 md:flex lg:gap-2'>
          <span>{comments}</span>
          <span>Comments</span>
        </button>
      </ScrollIntoView>
    </div>
  );
};

const ReportAction = ({ openModal }: { openModal: () => void }) => {
  return (
    <div className='flex items-center gap-3'>
      <IconButton
        icon={<IoWarning className='h-6 w-6' />}
        onClick={openModal}
      />
    </div>
  );
};

const ShareAction = () => {
  return (
    <ActionPopover
      triggerIcon={<Share className='group-hover:text-white' />}
      buttonGroup={
        <>
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
        </>
      }
    />
  );
};
