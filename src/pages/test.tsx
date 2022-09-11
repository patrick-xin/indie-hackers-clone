import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const schema = z.object({
  fullName: z.string(),
  location: z.string(),
  twitter: z.string().url(),
  publicEmail: z.string().email(),
  bio: z.string(),
});
export type BioSchemaField = z.infer<typeof schema>;

const UserEditPage = () => {
  const { data } = trpc.useQuery(['auth.me', { postId: undefined }]);
  const [location, setLocation] = useState('');

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<BioSchemaField>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: BioSchemaField) => {
    console.log(data);
  };
  useEffect(() => {
    setFocus('fullName');
  }, [setFocus]);
  console.log(errors);

  return (
    <div>
      <div className=''>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <input placeholder='Full Name' {...register('fullName')} />

          <div className='flex items-center gap-3'>
            <button type='submit'>Save</button>
            <Button variant='outline' onClick={() => alert('?')}>
              Cancle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
