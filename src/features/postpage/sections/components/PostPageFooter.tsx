import { format } from 'date-fns';

import { PostAuthor } from '@/features/post/components';
import { PostOnUser } from '@/features/post/types';
import { PostPageInlineAction } from '@/features/postpage/sections/components/PostPageAction';

type Props = {
  post: PostOnUser;
};

export const PostPageFooter = ({ post }: Props) => {
  return (
    <div>
      <div className='my-6 text-lg'>
        <span>--</span> <PostAuthor author={post.author} />{' '}
        {post.postType === 'LINK' && <span>submitted this link </span>}
        <span>on</span>{' '}
        <span className='decoration-brand-blue decoration-[2px] underline-offset-[6px] hover:text-brand-blue hover:underline'>
          {format(post.publishedAt, 'MMMM dd, yyyy')}
        </span>
      </div>
      <PostPageInlineAction
        postId={post.id}
        likes={post._count.likes}
        bookmarks={10}
      />
    </div>
  );
};
