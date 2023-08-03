import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/future/image';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'tabler-icons-react';
import z from 'zod';

import { Button, Footer, Header, IconButton, Input } from '@/features/UI';
import { TextArea } from '@/features/UI/Input';
import { LocationSearchBox } from '@/features/user/auth/components';
import { BirthdaySelect } from '@/features/userpage/components/BirthdaySelect';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { trpc } from '@/utils/trpc';

const BioSchema = z.object({
  fullName: z.string().optional(),
  twitter: z.string().url().optional(),
  publicEmail: z.string().email().optional(),
  bio: z.string().optional(),
});
export type BioSchemaField = z.infer<typeof BioSchema>;

const UserEditPage = ({ username }: { username: string }) => {
  const utils = trpc.useContext();
  const { push } = useRouter();
  const { data } = trpc.useQuery(['auth.me', { postId: undefined }]);
  const { mutate: editBio } = trpc.useMutation('auth.edit-bio', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');

      push(`/@${username}`);
    },
  });
  const [location, setLocation] = useState(data?.user.profile?.location ?? '');
  const [birthday, setBirthday] = useState({
    day: data?.user.profile?.birthday?.split(' ')[1] ?? '',
    month: data?.user.profile?.birthday?.split(' ')[0] ?? '',
    year: data?.user.profile?.birthday?.split(' ')[2] ?? '',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BioSchemaField>({
    resolver: zodResolver(BioSchema),
  });
  const onSubmit = (data: BioSchemaField) => {
    editBio({
      ...data,
      location,
      birthday: `${birthday.month} ${birthday.day} ${birthday.year}`,
    });
  };

  useEffect(() => {
    if (data) {
      reset({
        bio: data?.user?.profile?.bio ?? '',
        fullName: data?.user?.profile?.fullName ?? '',
        publicEmail: data?.user?.profile?.publicEmail ?? '',
        twitter: data?.user?.profile?.twitter ?? '',
      });
    }
  }, [data, reset]);

  return (
    <div>
      <Header />
      <main className='p-4 md:p-0'>
        <div className='user-content'>
          <header className='user-header rounded rounded-b-none bg-[#1f364d] px-4 pb-8 md:pt-8 md:pb-28'>
            <div className='mx-auto max-w-5xl items-center gap-6 md:flex md:px-10 lg:items-start lg:gap-8'>
              <div className='flex items-center justify-center gap-6'>
                <div className='-mt-8 h-32 w-32 rounded-full bg-[#294057] p-2 lg:-mt-0 lg:h-40 lg:w-40'>
                  <Image
                    className='rounded-full'
                    height={160}
                    width={160}
                    src={data?.user?.image ?? '/avatar.webp'}
                    alt='user-avatar'
                  />
                </div>
                <div>
                  <div className='flex items-center gap-5'>
                    <h1 className='text-3xl font-bold text-white'>
                      Editing Profile
                    </h1>
                    <IconButton
                      onClick={() => push(`/@${username}`)}
                      size='medium'
                      icon={<X className='h-6 w-6' />}
                      variant='gradient'
                    />
                  </div>

                  <p className='my-4 text-lg'>
                    Click your avatar to upload a new one.
                  </p>
                </div>
              </div>
            </div>
          </header>
          <div className='user-body md:mx-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-12 space-y-8'>
              <Input
                label='FULL NAME'
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <p className='text-red-500'>{errors.fullName?.message}</p>
              <BirthdaySelect birthday={birthday} onSelect={setBirthday} />
              <LocationSearchBox
                location={data?.user?.profile?.location ?? ''}
                onSelectAddress={(location) => setLocation(location)}
              />
              <Input
                label='TWITTER HANDLE'
                error={errors.twitter?.message}
                {...register('twitter')}
              />
              <p className='text-red-500'>{errors.twitter?.message}</p>
              <Input
                label='PUBLIC EMAIL'
                description='Use an address you don&#39;t mind other indie hackers contacting
                you at.'
                error={errors.publicEmail?.message}
                {...register('publicEmail')}
              />
              <p className='text-red-500'>{errors.publicEmail?.message}</p>
              <TextArea
                error={errors.bio?.message}
                rows={6}
                label='BIO'
                description="Say a few words about who you are, what you're working on, or why you're here!"
                {...register('bio')}
              />
              <p className='text-red-500'>{errors.bio?.message}</p>
              <div className='flex items-center gap-3'>
                <Button variant='gradient' type='submit'>
                  Save
                </Button>
                <Button variant='outline' onClick={() => push(`/@${username}`)}>
                  Cancle
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserEditPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const usernameParam = context.params?.['@username'] as string;
  const username = usernameParam.split('@')[1];
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session || session.user.username !== username) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      username,
    },
  };
}
