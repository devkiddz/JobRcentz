'use client';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

import type { JobSeekerTab } from './JobSeekerDashboard';

import ApplicationsTab from './tabs/ApplicationsTab';
import AboutTab from './tabs/AboutTab';
import GalleryTab from './tabs/GalleryTab';
import JobsTab from './tabs/JobsTab';
import PortfolioTab from './tabs/PortfolioTab';
import OverviewTab from '@/components/dashboard/jobseeker/tabs/OverviewTab';

interface JobSeekerTabContentProps {
  dashboard: JobSeekerDashboardData;
  activeTab: JobSeekerTab;
}

export default function JobSeekerTabContent({ dashboard, activeTab }: JobSeekerTabContentProps) {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab dashboard={dashboard} />;

    case 'applications':
      return <ApplicationsTab />;

    case 'jobs':
      return <JobsTab />;

    case 'portfolio':
      return <PortfolioTab />;

    case 'about':
      return <AboutTab dashboard={dashboard} />;

    case 'gallery':
      return <GalleryTab />;

    default:
      return null;
  }
}
