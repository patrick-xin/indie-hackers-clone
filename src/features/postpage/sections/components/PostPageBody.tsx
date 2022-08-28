import { Post } from '@prisma/client';
import ReactMarkdown from 'react-markdown';

import { LinkContent } from '@/features/postpage/sections/components/LinkContent';

type Props = {
  post: Post;
};

export const PostPageBody = ({ post }: Props) => {
  return (
    <>
      <div className='prose-base prose prose-brand mx-auto prose-p:font-normal prose-p:antialiased prose-a:text-brand-blue prose-a:hover:underline prose-img:rounded prose-img:object-cover md:prose-lg xl:prose-xl 2xl:prose-2xl'>
        {post.postType === 'ARTICLE' && (
          <ReactMarkdown>{post.content}</ReactMarkdown>
        )}
      </div>
      {post.postType === 'LINK' && <LinkContent post={post} />}
    </>
  );
};
