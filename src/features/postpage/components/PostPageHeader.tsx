import { BsStarFill } from 'react-icons/bs';

import { NavTooltip } from '@/features/dashboad/components';
import { PostAuthor } from '@/features/post/components';
import { PostOnUser } from '@/features/post/types';
import { PostHeaderAction } from '@/features/postpage/components/PostHeaderAction';
import { useMe } from '@/features/user/auth/api';

type Props = {
  post: PostOnUser;
};

export const PostPageHeader = ({ post }: Props) => {
  const { data: user } = useMe({ postId: post.id });
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
          {user && canEdit && (
            <PostHeaderAction
              post={post}
              isFeaturedPost={user.isFeaturedPost}
              postStatus={user.postStatus}
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
