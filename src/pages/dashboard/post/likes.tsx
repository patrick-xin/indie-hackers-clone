import { ReactElement } from 'react';

import { DashboardLayout } from '@/features/layout/Dashboard';

const DashboardPostLikesPage = () => {
  return <div>DashboardPostLikesPage</div>;
};

export default DashboardPostLikesPage;

DashboardPostLikesPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
