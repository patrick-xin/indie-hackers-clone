import React from 'react';

import { ButtonLink, Flex } from '@/features/UI';

export const TabLinks = ({ path }: { path: string }) => {
  return (
    <Flex className='gap-4'>
      <ButtonLink
        href='/'
        variant='underline'
        isActive={path === '/' || path.startsWith('/top')}
      >
        Popular
      </ButtonLink>
      <ButtonLink
        href='/newest'
        variant='underline'
        isActive={path === '/newest'}
      >
        Newest
      </ButtonLink>
      <ButtonLink
        href='/following'
        variant='underline'
        isActive={path === '/following'}
      >
        Following
      </ButtonLink>
      <ButtonLink
        href='/groups'
        variant='underline'
        isActive={path === '/groups'}
      >
        Groups
      </ButtonLink>
    </Flex>
  );
};
