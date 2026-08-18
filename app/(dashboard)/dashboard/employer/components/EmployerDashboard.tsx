import EmployerProfileHero from './EmployerProfileHero';
import EmployerStats from './EmployerStats';
import RecentApplications from './RecentApplications';
import RecentJobs from './RecentJobs';
import UpcomingInterviews from './UpcomingInterviews';
import EmployerCompanyCard from './EmployerCompanyCard';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

interface EmployerDashboardProps {
  dashboard: EmployerDashboardData;
}

export default function EmployerDashboard({ dashboard }: EmployerDashboardProps) {
  const { user, company, profile, stats, recentJobs, recentApplications, upcomingInterviews } = dashboard;

  return (
    <div className="space-y-8">
      {/* Employer identity */}
      <EmployerProfileHero user={user} company={company} profile={profile} />

      {/* Analytics */}
      <EmployerStats stats={stats} />

      {/* Jobs + company */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <RecentJobs jobs={recentJobs} />

        <EmployerCompanyCard company={company} stats={stats} profile={profile} />
      </section>

      {/* Applications + interviews */}
      <section className="grid gap-6 xl:grid-cols-2">
        <RecentApplications applications={recentApplications} />

        <UpcomingInterviews interviews={upcomingInterviews} />
      </section>
    </div>
  );
}
