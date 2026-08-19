import { redirect } from 'next/navigation';

import EmployerJobsView from '../EmployerJobsView';
import { getEmployerJobs } from '@/server/actions/dashboard/employer/getEmployerJobs';

export default async function EmployerPublishedJobsPage() {
  const dashboard = await getEmployerJobs('PUBLISHED');

  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  return <EmployerJobsView dashboard={dashboard} filter="PUBLISHED" />;
}
