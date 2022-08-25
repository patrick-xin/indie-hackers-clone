import { PostAuthor } from '@/features/post/components';
import { PostOnUser } from '@/features/post/types';

type Props = {
  post: PostOnUser;
};

export const PostPageHeader = ({ post }: Props) => {
  return (
    <header className='post-page-header'>
      <h1 className='not-prose text-center text-white text-3xl md:text-5xl'>
        {post.title}
      </h1>
      <div className='text-center my-8 text-lg lg:text-xl'>
        by <PostAuthor author={post.author} />
      </div>
    </header>
  );
};
