import { redirect } from 'next/navigation';

import { getJobSeekerDashboard } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

import JobSeekerDashboard from '@/features/jobseeker/dashboard/components/JobSeekerDashboard';

export default async function JobSeekerDashboardPage() {
  const dashboard = await getJobSeekerDashboard();

  if (dashboard.user.role !== 'JOB_SEEKER') {
    redirect('/dashboard');
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <JobSeekerDashboard dashboard={dashboard} />
    </main>
  );
}
