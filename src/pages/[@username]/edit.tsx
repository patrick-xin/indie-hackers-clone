import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/future/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Footer, Header, Input } from '@/features/UI';
import { LocationSearchBox } from '@/features/user/components';
import { trpc } from '@/utils/trpc';

const schema = z.object({
  fullname: z.string(),
  city: z.string(),
  twitter: z.string().url(),
  publicEmail: z.string().email(),
  bio: z.string(),
});
type Field = z.infer<typeof schema>;

const UserEditPage = () => {
  const { data } = trpc.useQuery(['auth.me', { postId: undefined }]);
  const [address, setAddress] = useState('');

  const {
    register,
    handleSubmit,
    setFocus,

    formState: { errors },
  } = useForm<Field>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: Field) => {
    console.log(data);
  };
  useEffect(() => {
    setFocus('fullname');
  }, [setFocus]);
  return (
    <div>
      <Header />
      <main className='p-4 md:p-0'>
        <div className='user-content'>
          <header className='user-header rounded rounded-b-none bg-[#1f364d] px-4 pb-8 md:pt-8 md:pb-28'>
            <div className='mx-auto max-w-5xl items-center gap-6 md:flex md:px-10 lg:items-start lg:gap-8'>
              <div className='flex items-center justify-center'>
                <div className='-mt-8 h-32 w-32 rounded-full bg-[#294057] p-2 lg:-mt-0 lg:h-40 lg:w-40'>
                  <Image
                    className='rounded-full'
                    height={160}
                    width={160}
                    src='/avatar.webp'
                    alt='user-avatar'
                  />
                </div>
              </div>
            </div>
          </header>
          <div className='user-body md:mx-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <Input
                {...register('fullname')}
                label='FULL NAME
'
              />
              <LocationSearchBox
                onSelectAddress={(address) => setAddress(address)}
              />
              <Input
                {...register('twitter')}
                label='TWITTER HANDLE
'
              />
              <Input
                {...register('publicEmail')}
                label='PUBLIC EMAIL'
                description='Use an address you don&#39;t mind other indie hackers contacting
                you at.'
              />

              <Input
                {...register('bio')}
                textarea
                rows={6}
                label='BIO'
                description="Say a few words about who you are, what you're working on, or why you're here!"
              />
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserEditPage;
