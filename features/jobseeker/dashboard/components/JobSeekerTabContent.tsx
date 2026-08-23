'use client';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

import type { JobSeekerTab } from './JobSeekerDashboard';

import JobSeekerOverviewCards from './JobSeekerOverviewCards';
import RecentApplications from './RecentApplications';

interface JobSeekerTabContentProps {
  dashboard: JobSeekerDashboardData;
  activeTab: JobSeekerTab;
}

export default function JobSeekerTabContent({ dashboard, activeTab }: JobSeekerTabContentProps) {
  switch (activeTab) {
    case 'overview':
      return (
        <div className="space-y-6">
          <JobSeekerOverviewCards dashboard={dashboard} />

          <RecentApplications applications={dashboard.recentApplications} />
        </div>
      );

    case 'applications':
      return (
        <PlaceholderTab
          title="Applications"
          description="Track the jobs you have applied for and monitor their progress."
        />
      );

    case 'jobs':
      return (
        <PlaceholderTab
          title="Jobs"
          description="Your saved and relevant job opportunities will appear here."
        />
      );

    case 'portfolio':
      return (
        <PlaceholderTab
          title="Portfolio"
          description="Showcase your projects, technical work and professional achievements."
        />
      );

    case 'about':
      return (
        <PlaceholderTab
          title="About"
          description="Your professional background, skills, experience and career information."
        />
      );

    case 'gallery':
      return (
        <PlaceholderTab
          title="Gallery"
          description="Professional images, certificates and other supporting media."
        />
      );

    default:
      return null;
  }
}

interface PlaceholderTabProps {
  title: string;
  description: string;
}

function PlaceholderTab({ title, description }: PlaceholderTabProps) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-10 text-center">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
