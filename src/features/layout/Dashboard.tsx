import React, { useState } from 'react';

import { CollapsedNav, MainNav } from '@/features/dashboad/components';

type Props = {
  children: React.ReactNode;
  loading?: boolean;
};

export const DashboardLayout: React.FC<Props> = ({ children, loading }) => {
  const [collapse, setCollapse] = useState(false);

  return (
    <div className='h-screen w-screen overflow-y-auto relative'>
      <MainNav onClose={() => setCollapse(true)} shown={!collapse} />

      <CollapsedNav onClose={() => setCollapse(false)} shown={collapse} />

      <div className='w-[calc(100vw - 16rem)] ml-64 p-12'>{children}</div>
    </div>
  );
};
