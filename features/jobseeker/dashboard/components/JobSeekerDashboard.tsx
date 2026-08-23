'use client';

import { useState } from 'react';

import JobSeekerWelcome from './JobSeekerWelcome';
import JobSeekerTabContent from './JobSeekerTabContent';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

export type JobSeekerTab = 'overview' | 'applications' | 'jobs' | 'portfolio' | 'about' | 'gallery';

interface JobSeekerDashboardProps {
  dashboard: JobSeekerDashboardData;
}

export default function JobSeekerDashboard({ dashboard }: JobSeekerDashboardProps) {
  const [activeTab, setActiveTab] = useState<JobSeekerTab>('overview');

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-6 md:px-4 lg:px-8">
      {/* ============================================================
          PROFILE HEADER + TABS
      ============================================================ */}

      <JobSeekerWelcome
        user={dashboard.user}
        profile={dashboard.profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ============================================================
          ACTIVE TAB CONTENT
      ============================================================ */}

      <JobSeekerTabContent dashboard={dashboard} activeTab={activeTab} />
    </div>
  );
}
