import { redirect } from 'next/navigation';

import EmployerJobsView from '../EmployerJobsView';
import { getEmployerJobs } from '@/server/actions/dashboard/employer/getEmployerJobs';

export default async function EmployerRejectedJobsPage() {
  const dashboard = await getEmployerJobs('REJECTED');

  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  return <EmployerJobsView dashboard={dashboard} filter="REJECTED" />;
}
