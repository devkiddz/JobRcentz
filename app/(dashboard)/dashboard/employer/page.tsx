import { redirect } from 'next/navigation';

import EmployerDashboard from './components/EmployerDashboard';

import { getEmployerDashboard } from '@/server/actions/dashboard/employer/getEmployerDashboard';

export default async function EmployerDashboardPage() {
  const dashboard = await getEmployerDashboard();

  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <EmployerDashboard dashboard={dashboard} />
    </main>
  );
}
