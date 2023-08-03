import { trpc } from '@/utils/trpc';

const useCreateComment = (cb: () => void) => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation('comment.create', {
    onSuccess: () => {
      utils.invalidateQueries(['public-posts.by-slug']);
      cb();
    },
  });
  return {
    createComment: mutate,
    isCreatingComment: isLoading,
    isCreatingError: isError,
  };
};

const useUpdateComment = (cb: () => void) => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation('comment.update', {
    onSuccess: () => {
      utils.invalidateQueries(['public-posts.by-slug']);
      cb();
    },
  });
  return {
    updateComment: mutate,
    isUpdatingComment: isLoading,
    isUpdatingError: isError,
  };
};
const useDeleteComment = (cb: () => void) => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation('comment.delete', {
    onSuccess: () => {
      utils.invalidateQueries(['public-posts.by-slug']);
      cb();
    },
  });
  return {
    deleteComment: mutate,
    isDeletingComment: isLoading,
    isDeletingError: isError,
  };
};

const useComment = (cb: () => void) => {
  const { createComment, isCreatingComment, isCreatingError } =
    useCreateComment(() => cb());
  const { updateComment, isUpdatingComment, isUpdatingError } =
    useUpdateComment(() => cb());
  const { deleteComment, isDeletingComment, isDeletingError } =
    useDeleteComment(() => cb());
  return {
    createComment,
    isCreatingComment,
    isCreatingError,
    updateComment,
    isUpdatingComment,
    isUpdatingError,
    deleteComment,
    isDeletingComment,
    isDeletingError,
  };
};

export { useComment };
