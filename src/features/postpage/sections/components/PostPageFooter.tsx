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
        <PostAuthor author={post.author} /> submitted this link{' '}
        <span>{format(post.publishedAt, 'MMMM dd, yyyy')}</span>
      </div>
      <PostPageInlineAction
        postId={post.id}
        likes={post._count.likes}
        bookmarks={10}
      />
    </div>
  );
};
