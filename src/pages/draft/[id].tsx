import { ReactElement } from 'react';

import { PostPageLayout } from '@/features/layout/PostPage';
import { useGetDraftPost } from '@/features/postpage/api';
import { PostPageHeader } from '@/features/postpage/components';
import { PostPageBody } from '@/features/postpage/components/PostPageBody';
import { FullScreenLoader } from '@/features/UI';

const PostDraftPage = () => {
  const { post, isLoading } = useGetDraftPost();
  if (isLoading || !post) return <FullScreenLoader />;

  return (
    <div className='post-page mb-32 max-w-full md:px-8'>
      <PostPageHeader post={post} />
      <div className='post-page-main flex flex-col'>
        <PostPageBody post={post} />
      </div>
    </div>
  );
};

export default PostDraftPage;

PostDraftPage.getLayout = (page: ReactElement) => (
  <PostPageLayout>{page}</PostPageLayout>
);
