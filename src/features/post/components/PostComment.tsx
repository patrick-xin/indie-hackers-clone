import { formatDistance } from 'date-fns';
import Image from 'next/future/image';
import React, { useState } from 'react';
import { ChevronUp } from 'tabler-icons-react';

import { CommentForm } from '@/features/post/components/comment/CommentForm';
import { CommentOnUser } from '@/features/post/types';
import { Flex } from '@/features/UI';
import { trpc } from '@/utils/trpc';

export const PostComment = ({
  comment,
  commentsByParentId,
  postId,
}: {
  comment: CommentOnUser;
  postId: string;
  commentsByParentId: { [key: string]: CommentOnUser[] };
}) => {
  const utils = trpc.useContext();
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const childComments = commentsByParentId[comment.id] ?? [];
  const { mutate: createComment } = trpc.useMutation('comment.create', {
    onSuccess: () => {
      utils.invalidateQueries(['public-posts.by-slug']);
    },
  });

  return (
    <div className='my-4'>
      <div className='flex justify-start gap-2'>
        <div className='flex flex-col items-center'>
          <button>
            <ChevronUp />
          </button>
          <div className='text-sm'>23</div>
        </div>

        <div className='w-full'>
          {showContent && <div>{comment.content}</div>}

          <div className='flex items-center gap-2 my-2'>
            <Flex className='gap-2 max-h-fit items-center'>
              <div>
                <Image
                  className='rounded-full'
                  src='/avatar.webp'
                  height={32}
                  width={32}
                />
              </div>

              <div>{comment.user.username}</div>
            </Flex>

            <div>·</div>
            <div>
              {formatDistance(comment.createdAt, new Date(), {
                addSuffix: true,
              })}
            </div>
            <div>·</div>
            <div>
              <button
                onClick={() => setShowContent(!showContent)}
                className='hover:bg-red-500'
              >
                [-]
              </button>
            </div>

            <div>·</div>
            <button onClick={() => setShowReplyForm(true)}>reply</button>
          </div>
          {showReplyForm && (
            <CommentForm
              hasCancleButton
              onSubmit={(content) =>
                createComment({ content, postId, parentId: comment.id })
              }
              initialValue=''
              buttonLabel='post comment'
              onCancle={() => setShowReplyForm(false)}
            />
          )}
        </div>
      </div>
      {childComments && childComments?.length > 0 && (
        <div className='pl-6 bg-red-200'>
          <CommentList
            comments={childComments}
            commentsByParentId={commentsByParentId}
            postId={postId}
          />
        </div>
      )}
    </div>
  );
};

export const CommentList = ({
  comments,
  postId,
  commentsByParentId,
}: {
  comments: CommentOnUser[];
  postId: string;
  commentsByParentId: { [key: string]: CommentOnUser[] };
}) => {
  return (
    <div>
      <div className='space-y-10'>
        {comments.map((comment) => (
          <PostComment
            postId={postId}
            key={comment.id}
            comment={comment}
            commentsByParentId={commentsByParentId}
          />
        ))}
      </div>
    </div>
  );
};