import EmployerProfileHero from './EmployerProfileHero';
import EmployerStats from './EmployerStats';
import RecentJobs from './RecentJobs';
import RecentApplications from './RecentApplications';
import UpcomingInterviews from './UpcomingInterviews';
import EmployerCompanyCard from './EmployerCompanyCard';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

interface EmployerDashboardProps {
  dashboard: EmployerDashboardData;
}

export default function EmployerDashboard({ dashboard }: EmployerDashboardProps) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <EmployerProfileHero user={dashboard.user} company={dashboard.company} profile={dashboard.profile} />

      <EmployerStats stats={dashboard.stats} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <RecentJobs jobs={dashboard.recentJobs} />

        <EmployerCompanyCard
          company={dashboard.company}
          stats={dashboard.stats}
          profile={dashboard.profile}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <RecentApplications applications={dashboard.recentApplications} />

        <UpcomingInterviews interviews={dashboard.upcomingInterviews} />
      </section>
    </div>
  );
}
