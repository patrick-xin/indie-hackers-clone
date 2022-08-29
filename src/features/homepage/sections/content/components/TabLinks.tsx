import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useHover } from 'usehooks-ts';

import { useModalStore } from '@/lib/store/modal';

import { Button, ButtonLink, FilterLinks, Flex } from '@/features/UI';

export const TabLinks = () => {
  const { pathname } = useRouter();
  const { setOpen } = useModalStore();
  const ref = useRef<HTMLButtonElement | null>(null);
  const isHover = useHover(ref);
  return (
    <Flex className='justify-between'>
      <Flex className='gap-4'>
        <Button
          ref={ref}
          variant='link'
          size='noPadding'
          rounded='none'
          isActive={pathname === '/' || pathname.startsWith('/top')}
          className='relative'
        >
          Popular
          {isHover && <FilterLinks />}
        </Button>
        <ButtonLink
          href='/newest'
          variant='underline'
          isActive={pathname === '/newest'}
        >
          Newest
        </ButtonLink>

        <ButtonLink
          href='/following'
          variant='underline'
          isActive={pathname === '/following'}
        >
          Following
        </ButtonLink>
        <ButtonLink
          href='/groups'
          variant='underline'
          isActive={pathname === '/groups'}
        >
          Groups
        </ButtonLink>
      </Flex>
      <Button variant='gradient' size='small' onClick={setOpen}>
        New Post
      </Button>
    </Flex>
  );
};
