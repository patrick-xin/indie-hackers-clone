import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import z from 'zod';

import { UserPageLayout } from '@/features/layout/UserPage';
import { Alert, Button, ConfirmModal, CustomToast, Input } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const UserPage = () => {
  const { data } = trpc.useQuery(['auth.me', { postId: undefined }]);

  return (
    <div>
      {data && (
        <UserPageLayout user={data.user}>
          <div className='mb-8'>
            <h3 className='text-3xl text-white'>Account</h3>
          </div>
          <div className='space-y-4'>
            <ChangeUsername username={data.user.username} />
            <DeleteAccount username={data.user.username} />
          </div>
        </UserPageLayout>
      )}
    </div>
  );
};

export default UserPage;

const ChangeUsername = ({ username }: { username: string }) => {
  const schema = z
    .object({
      username: z
        .string()
        .min(3, { message: 'Username must be at least 3 characters' })
        .regex(/^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/, {
          message: 'username format invalid',
        }),
      repeatUsername: z.string(),
    })
    .refine((data) => data.username === data.repeatUsername, {
      message: "Usernames don't match",
      path: ['repeatUsername'],
    });
  const { mutate: changeUsername } = trpc.useMutation('auth.change-username', {
    onSuccess: (data) => {
      utils.invalidateQueries('auth.me');
      toast.custom((t) => (
        <CustomToast
          message={data.message}
          onClose={() => toast.dismiss(t.id)}
          type='success'
          visible={t.visible}
        />
      ));
      setShowInpunt(false);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
  type Field = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Field>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: Field) => {
    changeUsername({ username: data.username });
  };
  const [showInput, setShowInpunt] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (showInput) setFocus('username');
  }, [setFocus, showInput]);
  const utils = trpc.useContext();

  return (
    <>
      {!showInput ? (
        <div className='flex items-center justify-between rounded bg-[#1f364d] p-4 hover:bg-[#253d56]'>
          <div className='space-y-2'>
            <div className='text-xl text-white'>Username</div>
            <div>@{username}</div>
          </div>
          <div>
            <Button onClick={() => setShowInpunt(true)} variant='gradient'>
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className='border-2 border-[#1f364d] p-6'>
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <Input label='Curent Username' value={username} disabled />
            <Input
              error={errorMessage ? errorMessage : undefined}
              label='New Username'
              placeholder='Enter new username'
              {...register('username')}
            />
            <p className='text-red-500'>{errors.username?.message}</p>
            {errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : null}
            <Input
              error={errors.repeatUsername?.message}
              label='Repeat New Username'
              placeholder='Type your new username again'
              {...register('repeatUsername')}
            />
            <p className='text-red-500'>{errors.repeatUsername?.message}</p>
            <p className='text-lg text-yellow-500'>
              You can only change your username once every 90 days, so choose
              wisely!
            </p>
            <div className='flex items-center gap-3'>
              <Button variant='gradient' type='submit'>
                Change Username
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setShowInpunt(false);
                  setErrorMessage(null);
                }}
              >
                Cancle
              </Button>
            </div>
          </form>
        </div>
      )}
      <Toaster position='bottom-right' />
    </>
  );
};

const DeleteAccount = ({ username }: { username: string }) => {
  const [openModal, setOpenModal] = useState(false);
  const [inputUsername, setInputUsername] = useState('');
  const match = inputUsername === username;
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (openModal && ref.current) ref.current.focus();
  }, [openModal]);
  return (
    <>
      <div className='flex items-center justify-between rounded bg-[#1f364d] p-4 hover:bg-[#253d56]'>
        <div className='space-y-2'>
          <div className='text-xl text-white'>Deletion</div>
          <div>Permanently delete your account, posts, and comments.</div>
        </div>
        <div>
          <Button onClick={() => setOpenModal(true)} variant='gradient'>
            Delete
          </Button>
        </div>
      </div>
      <ConfirmModal open={openModal} onClose={() => setOpenModal(false)}>
        <Alert
          message={
            <p>
              Enter your username <span className='text-white'>{username}</span>{' '}
              to permanently delete your Indie Hackers account. This is
              irreversible!
            </p>
          }
          type='error'
        />
        <form className='space-y-8'>
          <Input
            ref={ref}
            label='Please enter your username'
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
          />
          <div className='flex justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setOpenModal(false);
                setInputUsername('');
              }}
            >
              Cancle
            </Button>
            <Button type='submit' variant='gradient' disabled={!match}>
              Delete
            </Button>
          </div>
        </form>
      </ConfirmModal>
    </>
  );
};
