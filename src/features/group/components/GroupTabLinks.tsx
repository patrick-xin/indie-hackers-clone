import { useModalStore } from '@/lib/store/modal';

import { Button, Flex } from '@/features/UI';

export const GroupTabLinks = () => {
  const { setOpen } = useModalStore();
  return (
    <Flex className='justify-between items-center'>
      <Flex className='gap-4'>
        <Button variant='link' isActive size='noPadding' rounded='none'>
          New
        </Button>
        <Button variant='link' size='noPadding' rounded='none'>
          Popular
        </Button>
      </Flex>
      <Button variant='gradient' onClick={setOpen} size='small'>
        New Post
      </Button>
    </Flex>
  );
};
