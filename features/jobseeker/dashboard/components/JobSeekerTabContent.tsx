'use client';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

import type { JobSeekerTab } from './JobSeekerDashboard';

import AboutTab from './tabs/AboutTab';
import ApplicationsTab from './tabs/ApplicationsTab';
import GalleryTab from './tabs/GalleryTab';
import JobsTab from './tabs/JobsTab';
import PortfolioTab from './tabs/PortfolioTab';
import OverviewTab from '@/components/dashboard/jobseeker/tabs/OverviewTab';

interface JobSeekerTabContentProps {
  dashboard: JobSeekerDashboardData;
  activeTab: JobSeekerTab;
}

export default function JobSeekerTabContent({ dashboard, activeTab }: JobSeekerTabContentProps) {
  return (
    <section key={activeTab} className="min-w-0 animate-in fade-in-0 slide-in-from-right-2 duration-200">
      {activeTab === 'overview' && <OverviewTab dashboard={dashboard} />}

      {activeTab === 'applications' && <ApplicationsTab />}

      {activeTab === 'jobs' && <JobsTab />}

      {activeTab === 'portfolio' && <PortfolioTab dashboard={dashboard} />}

      {activeTab === 'about' && <AboutTab dashboard={dashboard} />}

      {activeTab === 'gallery' && <GalleryTab />}
    </section>
  );
}
