import JobSeekerOverviewCards from '@/features/jobseeker/dashboard/components/JobSeekerOverviewCards';
import RecentApplications from '@/features/jobseeker/dashboard/components/RecentApplications';
import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

// import JobSeekerOverviewCards from '../JobSeekerOverviewCards';
// import RecentApplications from '../RecentApplications';

interface OverviewTabProps {
  dashboard: JobSeekerDashboardData;
}

export default function OverviewTab({ dashboard }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <div>
          <p className="text-sm font-medium text-primary">Professional overview</p>

          <h2 className="mt-1 text-xl font-bold tracking-tight">Your career at a glance</h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Keep track of your applications, saved opportunities, profile visibility and portfolio progress.
          </p>
        </div>
      </div>

      <JobSeekerOverviewCards dashboard={dashboard} />

      <RecentApplications applications={dashboard.recentApplications} />
    </div>
  );
}
