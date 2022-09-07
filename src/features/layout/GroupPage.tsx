import { Group } from '@prisma/client';
import React from 'react';

import {
  GroupDetailHeader,
  GroupDetailInfo,
} from '@/features/group/components';

import { Footer, FullScreenLoader, Header } from '../UI';

type IGroup = {
  groupInfo:
    | Group & {
        members: {
          username: string;
        }[];
        _count: {
          members: number;
        };
        createdBy: {
          username: string;
        };
      };

  isMember:
    | boolean
    | {
        username: string;
      };
};

export const GroupPageLayout: React.FC<{
  children: React.ReactNode;
  group: IGroup | undefined;
  loadingGroup: boolean;
}> = ({ children, group, loadingGroup }) => {
  if (loadingGroup || !group) return <FullScreenLoader />;
  const { groupInfo, isMember } = group;
  return (
    <div>
      <Header isTransparent />
      <main className='p-4 md:p-0'>
        <div className='mx-auto max-w-5xl space-y-6'>
          <GroupDetailHeader
            name={groupInfo.name}
            isMember={isMember}
            image={groupInfo.image}
            description={groupInfo.description}
          />

          <div className='grid-cols-8 gap-10 md:grid'>
            <div className='col-span-5'>{children}</div>
            <GroupDetailInfo
              createdBy={groupInfo.createdBy.username}
              membersCount={groupInfo._count.members}
              description={groupInfo.description}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
