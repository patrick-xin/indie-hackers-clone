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

export {
  useAddPostToBookmark,
  useCancleUpvotePost,
  useRemovePostFromBookmark,
  useReportPost,
  useUpvotePost,
};
