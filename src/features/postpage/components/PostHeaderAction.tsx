import { PostStatus } from '@prisma/client';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { Dots, Edit, Star } from 'tabler-icons-react';

import { PostOnUser } from '@/features/post/types';
import { ActionPopover } from '@/features/postpage/components/ActionPopover';
import { CustomToast } from '@/features/UI';
import { trpc } from '@/utils/trpc';

export const PostHeaderAction = ({
  post,
  isFeaturedPost,
  postStatus,
}: {
  post: PostOnUser;
  isFeaturedPost: boolean;
  postStatus: PostStatus;
}) => {
  const utils = trpc.useContext();
  const { push } = useRouter();
  const { mutate: pinPost } = trpc.useMutation('auth.pin-featured-post', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
    },
  });
  const { mutate: unPinPost } = trpc.useMutation('auth.unpin-featured-post', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
    },
  });
  const { mutate: publish } = trpc.useMutation('private-posts.publish', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
      toast.custom((t) => (
        <CustomToast
          message='published'
          onClose={() => toast.dismiss(t.id)}
          type='success'
          visible={t.visible}
        />
      ));
    },
  });
  const { mutate: unpublish } = trpc.useMutation('private-posts.unpublish', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
    },
  });
  return (
    <ActionPopover
      label='actions'
      triggerIcon={<Dots />}
      buttonGroup={
        <>
          {isFeaturedPost ? (
            <button
              onClick={() => unPinPost({ postId: post.id })}
              className='flex w-full items-center justify-start gap-4 rounded rounded-b-none bg-[#1f364d] py-3 px-2 text-sm uppercase text-white hover:bg-brand-blue'
            >
              <span>
                <Star className='h-5 w-5' />
              </span>
              <span>Unpin</span>
            </button>
          ) : (
            <button
              onClick={() => pinPost({ postId: post.id })}
              className='flex w-full items-center justify-start gap-4 rounded rounded-b-none bg-[#1f364d] py-3 px-2 text-sm uppercase text-white hover:bg-brand-blue'
            >
              <span>
                <Star className='h-5 w-5' />
              </span>
              <span>Mark as featured</span>
            </button>
          )}

          <button
            onClick={() =>
              push(`/dashboard/post/${post.postType.toLowerCase()}/${post.id}`)
            }
            className='flex w-full items-center justify-start gap-4 rounded rounded-t-none bg-[#1f364d] py-3 px-2 text-sm uppercase text-white hover:bg-brand-blue'
          >
            <span>
              <Edit className='h-5 w-5' />
            </span>
            <span>Edit</span>
          </button>
          {postStatus === 'DRAFT' ? (
            <button
              onClick={() =>
                publish({
                  id: post.id,
                  content: post.content,
                  title: post.title,
                })
              }
              className='flex w-full items-center justify-start gap-4 rounded rounded-t-none bg-[#1f364d] py-3 px-2 text-sm uppercase text-white hover:bg-brand-blue'
            >
              <span>
                <Edit className='h-5 w-5' />
              </span>
              <span>publish</span>
            </button>
          ) : (
            <button
              onClick={() => unpublish({ id: post.id })}
              className='flex w-full items-center justify-start gap-4 rounded rounded-t-none bg-[#1f364d] py-3 px-2 text-sm uppercase text-white hover:bg-brand-blue'
            >
              <span>
                <Edit className='h-5 w-5' />
              </span>
              <span>unpublish</span>
            </button>
          )}
          <Toaster position='bottom-right' />
        </>
      }
    />
  );
};
