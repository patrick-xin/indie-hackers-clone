import { PostAuthor } from '@/features/post/components';
import { PostOnUser } from '@/features/post/types';

type Props = {
  post: PostOnUser;
};

export const PostPageHeader = ({ post }: Props) => {
  return (
    <header className='post-page-header'>
      <h1 className='not-prose text-center text-3xl text-white md:text-5xl lg:mt-24'>
        {post.title}
      </h1>
      <div className='my-8 text-center text-lg lg:text-xl'>
        by <PostAuthor author={post.author} />
      </div>
    </header>
  );
};
