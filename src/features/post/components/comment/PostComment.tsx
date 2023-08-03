import { formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import Image from 'next/future/image';
import { useState } from 'react';
import { ChevronUp } from 'tabler-icons-react';

import { container } from '@/lib/animation';

import { useComment } from '@/features/post/components/comment/api';
import { CommentForm } from '@/features/post/components/comment/CommentForm';
import { CommentOnUser } from '@/features/post/types';
import { Alert, Button, ConfirmModal, Flex, Separator } from '@/features/UI';
import { useMe } from '@/features/user/auth/api';

export const PostComment = ({
  comment,
  commentsByParentId,
  postId,
}: {
  comment: CommentOnUser;
  postId: string;
  commentsByParentId: { [key: string]: CommentOnUser[] };
}) => {
  const { data: user } = useMe({});
  const isCommentOwner = comment.userId === user?.user.id;
  const [showContent, setShowContent] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const childComments = commentsByParentId[comment.id] ?? [];
  const { createComment, updateComment, deleteComment } = useComment(() =>
    setShowReplyForm(false)
  );

  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <ConfirmModal open={openModal} onClose={() => setOpenModal(false)}>
        <Alert
          message={<p>Are you sure to delete this comment?</p>}
          type='error'
        />
        <Flex className='mt-12 justify-end gap-4 xl:mt-20'>
          <Button variant='outline' onClick={() => setOpenModal(false)}>
            Cancle
          </Button>
          <Button
            variant='danger'
            onClick={() => deleteComment({ commentId: comment.id })}
          >
            Delete
          </Button>
        </Flex>
      </ConfirmModal>
      <li id={comment.id}>
        <div className='mt-4'>
          <div className='flex gap-2'>
            <div className='flex translate-y-[2px] flex-col items-center self-start'>
              <button>
                <ChevronUp />
              </button>
              <div className='text-sm'>23</div>
            </div>

            <div className='w-full text-sm'>
              {showContent && <div className='text-lg'>{comment.content}</div>}

              <div className='my-2 flex items-center gap-2 xl:text-lg'>
                <Flex className='max-h-fit items-center gap-2'>
                  <div>
                    <Image
                      className='rounded-full'
                      src={comment.user.image ?? '/avatar.webp'}
                      height={32}
                      width={32}
                      alt={`${comment.user.username}-avatar`}
                    />
                  </div>

                  <div>{comment.user.username}</div>
                </Flex>

                <Separator />
                <div className='text-sm font-normal'>
                  {formatDistance(comment.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </div>
                <Separator />
                <div>
                  <button
                    onClick={() => setShowContent(!showContent)}
                    className='hover:bg-red-500'
                  >
                    [-]
                  </button>
                </div>

                <Separator />
                {isCommentOwner ? (
                  <button onClick={() => setShowReplyForm(true)}>edit</button>
                ) : (
                  <button onClick={() => setShowReplyForm(true)}>reply</button>
                )}

                {isCommentOwner ? (
                  <div>
                    <Separator />{' '}
                    <button onClick={() => setOpenModal(true)}>delete</button>
                  </div>
                ) : null}
              </div>
              {showReplyForm && (
                <div className='my-4'>
                  {isCommentOwner ? (
                    <CommentForm
                      username={comment.user.username}
                      hasCancleButton
                      onSubmit={(content) =>
                        updateComment({ commentId: comment.id, content })
                      }
                      initialValue={comment.content}
                      buttonLabel='update comment'
                      onCancle={() => setShowReplyForm(false)}
                    />
                  ) : (
                    <CommentForm
                      username={comment.user.username}
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
              )}
            </div>
          </div>
          {childComments && childComments?.length > 0 && (
            <div className='pl-6'>
              <CommentList
                comments={childComments}
                commentsByParentId={commentsByParentId}
                postId={postId}
              />
            </div>
          )}
        </div>
      </li>
    </>
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
    <motion.ol
      className='post-page-comments relative space-y-10 hover:before:block hover:before:border-l-[#22384f]'
      variants={container}
      initial='hidden'
      animate='show'
    >
      {comments.map((comment) => (
        <PostComment
          postId={postId}
          key={comment.id}
          comment={comment}
          commentsByParentId={commentsByParentId}
        />
      ))}
    </motion.ol>
  );
};
