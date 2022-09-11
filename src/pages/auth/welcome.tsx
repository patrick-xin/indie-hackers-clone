import { Category } from '@prisma/client';
import cn from 'clsx';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';

import { BasicLayout } from '@/features/layout/Basic';
import { Button, Flex, Input } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const categories = [
  { id: 'Tech', name: 'Tech' },
  { id: 'Food', name: 'Food' },
  { id: 'Art', name: 'Art' },
  { id: 'Startup', name: 'Startup' },
  { id: 'Programming', name: 'Programming' },
  { id: 'Science', name: 'science' },
];

const WelcomePage = () => {
  const router = useRouter();

  const { mutate: saveProfile, isLoading } = trpc.useMutation(
    ['user.edit-username'],
    {
      onSuccess: () => {
        router.push('/');
      },
    }
  );
  const [selectedCategories, setSelectedCategories] = useState<
    Omit<Category, 'userId'>[]
  >([]);
  const [username, setUsername] = useState('');
  return (
    <div className='mx-auto max-w-2xl'>
      <h1 className='my-4 text-3xl text-white lg:my-8'>Welcome onboard!</h1>
      <p className='my-4'>
        You will be able to share your thoughts, ideas, projects or products
        with others.
      </p>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <p className='text-gray-300'>
            Let&#39;s get started with an unique username.
          </p>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='username'
            required
          />
        </div>

        <div className='space-y-2'>
          <p className='text-gray-300'>What fields are you interested in?</p>
          <Flex className='flex-wrap gap-2'>
            {categories.map((ca) => (
              <Button
                size='small'
                className={cn('hover:text-white capitalize', {
                  'bg-[#4799eb] text-white': selectedCategories.find(
                    (p) => p.name === ca.name
                  ),
                  'text-brand-text': !selectedCategories.find(
                    (p) => p.name === ca.name
                  ),
                })}
                onClick={() =>
                  setSelectedCategories((prev) => {
                    if (prev.find((p) => p.name === ca.name)) {
                      return [...prev].filter((p) => p.name !== ca.name);
                    }
                    return [...prev, { name: ca.name, id: ca.id }];
                  })
                }
                variant='outline'
                key={ca.id}
              >
                {ca.name}
              </Button>
            ))}
          </Flex>
        </div>
        <Flex className='w-full justify-end'>
          <Button
            loading={isLoading}
            variant='gradient'
            onClick={() => {
              saveProfile({ username });
            }}
          >
            Next
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default WelcomePage;

WelcomePage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
