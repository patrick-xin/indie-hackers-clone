import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useMe } from '@/features/user/auth/api';
import { trpc } from '@/utils/trpc';

const useUpvotePost = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation(
    'private-posts.upvote',
    {
      onSuccess: async () => {
        utils.invalidateQueries('public-posts.by-slug');
        utils.invalidateQueries('auth.me');
      },
    }
  );
  return { upvote: mutate, isLoading, isError };
};

const useCancleUpvotePost = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation(
    'private-posts.cancle-upvote',
    {
      onSuccess: () => {
        utils.invalidateQueries('public-posts.by-slug');
        utils.invalidateQueries('auth.me');
      },
    }
  );
  return { cancleUpvote: mutate, isLoading, isError };
};

const useAddPostToBookmark = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation(
    'private-posts.addToBookmark',
    {
      onSuccess: () => {
        utils.invalidateQueries('public-posts.by-slug');
        utils.invalidateQueries('auth.me');
      },
    }
  );

  return {
    addPostToBookmark: mutate,
    isAdding: isLoading,
    isAddingError: isError,
  };
};

const useRemovePostFromBookmark = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation(
    'private-posts.removeFromBookmark',
    {
      onSuccess: () => {
        utils.invalidateQueries('public-posts.by-slug');
        utils.invalidateQueries('auth.me');
        utils.invalidateQueries('auth.bookmarks');
      },
    }
  );

  return {
    removePostFromBookmark: mutate,
    isRemoving: isLoading,
    isRemovingError: isError,
  };
};

const useReportPost = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation(
    'private-posts.report',
    {
      onSuccess: () => {
        utils.invalidateQueries('public-posts.by-slug');
      },
    }
  );

  return {
    reportPost: mutate,
    isReporting: isLoading,
    isReportError: isError,
  };
};

const useGetDraftPost = () => {
  const { query, push } = useRouter();
  const id = query.id as string;
  const {
    data: post,
    isLoading,
    error,
  } = trpc.useQuery(['private-posts.draft', { id }], {
    enabled: Boolean(query) && Boolean(id),
  });

  const { data: user } = useMe({});

  useEffect(() => {
    if (error?.data?.code === 'UNAUTHORIZED') push('/');
    if (error?.data?.code === 'INTERNAL_SERVER_ERROR') push('/404');
    if (post && user) {
      const canEdit = post.authorId === user.user.id;
      if (!canEdit) push('/');
    }
  }, [error, post, user, push]);
  return {
    post,
    isLoading,
    error,
  };
};

export {
  useAddPostToBookmark,
  useCancleUpvotePost,
  useGetDraftPost,
  useRemovePostFromBookmark,
  useReportPost,
  useUpvotePost,
};
