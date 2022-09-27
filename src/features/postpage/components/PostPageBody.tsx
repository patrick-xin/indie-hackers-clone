import { Post } from '@prisma/client';
import ReactMarkdown from 'react-markdown';

import { LinkContent } from '@/features/postpage/components/LinkContent';

type Props = {
  post: Post;
};

export const PostPageBody = ({ post }: Props) => {
  return (
    <>
      <div className='prose-base prose prose-brand mx-auto prose-p:antialiased prose-a:text-brand-blue prose-a:hover:underline prose-img:rounded prose-img:object-cover md:prose-lg lg:prose-xl xl:prose-2xl '>
        {post.postType === 'ARTICLE' && (
          <ReactMarkdown>{post.content}</ReactMarkdown>
        )}
      </div>
      {post.postType === 'LINK' && <LinkContent post={post} />}
    </>
  );
};
