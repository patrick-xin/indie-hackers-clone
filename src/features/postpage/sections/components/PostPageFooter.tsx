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
      <div className='text-lg my-6'>
        <PostAuthor author={post.author} /> submitted this link{' '}
        <span>{format(post.publishedAt, 'MMMM dd, yyyy')}</span>
      </div>
      <PostPageInlineAction
        postId={post.id}
        likes={post._count.likes}
        comments={post._count.comments}
        bookmarks={10}
      />
    </div>
  );
};
