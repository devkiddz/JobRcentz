import { redirect } from 'next/navigation';

import EmployerDashboard from './components/EmployerDashboard';

import { getEmployerDashboard } from '@/server/actions/dashboard/employer/getEmployerDashboard';

export default async function EmployerDashboardPage() {
  const dashboard = await getEmployerDashboard();

  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <EmployerDashboard dashboard={dashboard} />
    </main>
  );
}
