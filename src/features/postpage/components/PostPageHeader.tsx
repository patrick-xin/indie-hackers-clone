import { PostType } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { BsStarFill } from 'react-icons/bs';
import { Dots, Edit, Star } from 'tabler-icons-react';

import { NavTooltip } from '@/features/dashboad/components';
import { PostAuthor } from '@/features/post/components';
import { PostOnUser } from '@/features/post/types';
import { ActionPopover } from '@/features/postpage/components/ActionPopover';
import { trpc } from '@/utils/trpc';

type Props = {
  post: PostOnUser;
};

export const PostPageHeader = ({ post }: Props) => {
  const { data: session } = useSession();
  const { data: user } = trpc.useQuery(['auth.me', { postId: post.id }], {
    enabled: Boolean(session),
  });

  const canEdit = post.authorId === user?.user.id;

  return (
    <header className='post-page-header'>
      <h1 className='not-prose flex flex-wrap items-center justify-center gap-4 text-center text-3xl text-white md:text-5xl lg:mt-24 lg:gap-8'>
        {user && user.isFeaturedPost && canEdit && (
          <div className='group relative flex justify-center'>
            <BsStarFill className='h-6 w-6 text-yellow-500' />
            <NavTooltip label='Featured' position='bottom' />
          </div>
        )}

        <span>{post.title}</span>
        <span>
          {canEdit && (
            <PostHeaderAction
              postId={post.id}
              postType={post.postType}
              isFeaturedPost={user?.isFeaturedPost}
            />
          )}
        </span>
      </h1>

      <div className='my-8 text-center text-lg lg:text-xl'>
        by <PostAuthor author={post.author} />
      </div>
    </header>
  );
};

const PostHeaderAction = ({
  postId,
  postType,
  isFeaturedPost,
}: {
  postId: string;
  postType: PostType;
  isFeaturedPost: boolean | undefined;
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
  return (
    <ActionPopover
      label='actions'
      triggerIcon={<Dots />}
      buttonGroup={
        <>
          {isFeaturedPost ? (
            <button
              onClick={() => unPinPost({ postId })}
              className='flex w-full items-center justify-start gap-4 rounded rounded-b-none bg-[#1f364d] py-3 px-2 text-sm uppercase text-white hover:bg-brand-blue'
            >
              <span>
                <Star className='h-5 w-5' />
              </span>
              <span>Unpin</span>
            </button>
          ) : (
            <button
              onClick={() => pinPost({ postId })}
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
              push(`/dashboard/post/${postType.toLowerCase()}/${postId}`)
            }
            className='flex w-full items-center justify-start gap-4 rounded rounded-t-none bg-[#1f364d] py-3 px-2 text-sm uppercase text-white hover:bg-brand-blue'
          >
            <span>
              <Edit className='h-5 w-5' />
            </span>
            <span>Edit</span>
          </button>
        </>
      }
    />
  );
};
