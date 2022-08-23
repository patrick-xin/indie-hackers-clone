import { useRouter } from 'next/router';
import React from 'react';

import { GroupSection } from '@/features/group/components';
import { BasicLayout } from '@/features/layout/Basic';

const GroupPage = () => {
  const { push } = useRouter();
  return (
    <div>
      <div className='grid grid-cols-1 gap-4 -mx-4 md:grid-cols-2 md:-mx-0 lg:grid-cols-3 lg:gap-6'>
        <GroupSection
          title='Fast Growing'
          description='Up-and-coming groups whose membership counts grew the highest percentage in the past week.'
          updatedAt='List updated daily at midnight PST.'
        />
        <GroupSection
          title='Most Popular'
          description='Extremely active groups with the most people making posts and comments in the past week.'
          updatedAt='List updated daily at midnight PST.'
        />
        <GroupSection
          title='All Active Groups'
          description='Every group on Indie Hackers that hosted active discussions in the past week.'
          updatedAt='List updated daily at midnight PST.'
        />
        <GroupSection
          title='Recently Launched'
          description='Groups that recently opened their doors to the public, sorted from newest to oldest.'
          updatedAt='List updated daily at midnight PST.'
        />
        <GroupSection
          title='New Proposals'
          description='Ideas for new groups. Join a group to help it reach the point where it can launch.'
          updatedAt='List updated daily at midnight PST.'
        />
        <GroupSection
          title='Inactive Groups'
          description='Groups with no recent discussion. Reach out and offer the moderators a helping hand.'
          updatedAt='List updated daily at midnight PST.'
        />
      </div>
    </div>
  );
};

export default GroupPage;

GroupPage.getLayout = (page: React.ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
