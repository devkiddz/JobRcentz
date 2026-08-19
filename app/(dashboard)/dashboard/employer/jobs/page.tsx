import { redirect } from 'next/navigation';

import EmployerJobsView from './EmployerJobsView';
import { getEmployerJobs } from '@/server/actions/dashboard/employer/getEmployerJobs';

export default async function EmployerJobsPage() {
  const dashboard = await getEmployerJobs('ALL');

  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  return <EmployerJobsView dashboard={dashboard} filter="ALL" />;
}
