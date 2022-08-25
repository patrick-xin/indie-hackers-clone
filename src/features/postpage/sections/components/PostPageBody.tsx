import { Post } from '@prisma/client';
import ReactMarkdown from 'react-markdown';

import { LinkContent } from '@/features/postpage/sections/components/LinkContent';

type Props = {
  post: Post;
};

export const PostPageBody = ({ post }: Props) => {
  return (
    <>
      <div className='prose prose-brand prose-a:text-brand-blue prose-a:hover:underline md:prose-lg prose-base xl:prose-xl 2xl:prose-2xl prose-p:font-normal prose-p:antialiased mx-auto prose-img:rounded prose-img:object-cover'>
        {post.postType === 'ARTICLE' && (
          <ReactMarkdown>{post.content}</ReactMarkdown>
        )}
      </div>
      {post.postType === 'LINK' && <LinkContent post={post} />}
    </>
  );
};
