import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Loader } from 'tabler-icons-react';

import { GROUP_MEMBER_COUNT } from '@/lib/constants';

import { GroupPageLayout } from '@/features/layout/GroupPage';
import { Button, Flex } from '@/features/UI';
import { AvatarPopover } from '@/features/user/components';
import { trpc } from '@/utils/trpc';

const GroupMembersPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const [page, setPage] = useState(0);

  const { data, isLoading: loadingMembers } = trpc.useQuery(
    [
      'group.by-slug-members',
      {
        slug,
        pageCount: GROUP_MEMBER_COUNT,
        page,
      },
    ],
    {
      enabled: Boolean(query),
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,

      onSuccess: (data) => {
        setMembers((prev) => {
          if (prev) return [...prev, ...data];
          return data;
        });
      },
    }
  );
  const [members, setMembers] = useState(data);
  const { data: group, isLoading: loadingGroup } = trpc.useQuery(
    [
      'group.by-slug',
      {
        slug,
      },
    ],
    { enabled: Boolean(query) }
  );

  return (
    <GroupPageLayout loadingGroup={loadingGroup} group={group}>
      <div className='rounded bg-[#182E43] p-6'>
        <h3 className='pb-3 uppercase'>Members</h3>
        {loadingMembers || !data ? (
          <Flex center>
            <Loader className='animate-spin ' />
          </Flex>
        ) : (
          <>
            {' '}
            <div className='space-y-4 border-y border-[#0E2439] py-6'>
              <AnimatePresence initial={false}>
                {members?.map((member) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={member.id}
                    transition={{
                      opacity: { duration: 0.2 },
                      height: { duration: 0.2 },
                    }}
                    className='flex items-center gap-4'
                  >
                    <AvatarPopover user={member} />
                    <div className='text-white'>{member.username}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button
              loading={loadingMembers}
              disabled={data?.length === 0}
              className='my-6'
              onClick={() => {
                setPage((p) => p + 1);
              }}
              variant='gradient'
            >
              load more
            </Button>
          </>
        )}
      </div>
    </GroupPageLayout>
  );
};

export default GroupMembersPage;
