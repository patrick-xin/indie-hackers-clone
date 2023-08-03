import { CommentForm, CommentList } from '@/features/post/components';
import { CommentOnUser } from '@/features/post/types';
import { trpc } from '@/utils/trpc';

type Props = {
  rootComments: CommentOnUser[] | undefined;
  postId: string;
  commentsByParentId: { [key: string]: CommentOnUser[] };
  hasScrolled: boolean;
  username: string;
};

export const PostPageComment = ({
  rootComments,
  postId,
  commentsByParentId,
  hasScrolled,
  username,
}: Props) => {
  const utils = trpc.useContext();
  const { mutate: createComment } = trpc.useMutation('comment.create', {
    onSuccess: () => {
      utils.invalidateQueries(['public-posts.by-slug']);
    },
  });
  return (
    <div
      className='not-prose text-lg font-normal text-brand-text'
      id='post-comments'
    >
      <CommentForm
        hasScrolled={hasScrolled}
        onSubmit={(content) => createComment({ content, postId })}
        initialValue=''
        buttonLabel='post comment'
        username={username}
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
