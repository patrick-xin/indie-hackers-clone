import { CommentForm, CommentList } from '@/features/post/components';
import { trpc } from '@/utils/trpc';

type Props = {
  rootComments;
  postId;
  commentsByParentId;
};

export const PostPageComment = ({
  rootComments,
  postId,
  commentsByParentId,
}: Props) => {
  const utils = trpc.useContext();
  const { mutate: createComment } = trpc.useMutation('comment.create', {
    onSuccess: () => {
      utils.invalidateQueries(['public-posts.by-slug']);
    },
  });
  return (
    <div className='not-prose text-brand-text font-normal text-lg'>
      <CommentForm
        onSubmit={(content) => createComment({ content, postId })}
        initialValue=''
        buttonLabel='post comment'
      />
      {rootComments && (
        <CommentList
          postId={postId}
          comments={rootComments}
          commentsByParentId={commentsByParentId}
        />
      )}
    </div>
  );
};
