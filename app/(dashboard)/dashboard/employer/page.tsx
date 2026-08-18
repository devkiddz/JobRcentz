import { redirect } from 'next/navigation';

import EmployerDashboard from './components/EmployerDashboard';

import { getEmployerDashboard } from '@/server/actions/dashboard/employer/getEmployerDashboard';

export default async function EmployerDashboardPage() {
  const dashboard = await getEmployerDashboard();

  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  return <EmployerDashboard dashboard={dashboard} />;
}
