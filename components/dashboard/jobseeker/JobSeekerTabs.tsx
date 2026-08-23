'use client';

import { BriefcaseBusiness, FileText, FolderKanban, Grid2X2, Image, Info, UserRound } from 'lucide-react';
import { useState } from 'react';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

import OverviewTab from './tabs/OverviewTab';
import PortfolioTab from './tabs/PortfolioTab';

interface JobSeekerTabsProps {
  dashboard: JobSeekerDashboardData;
}

type TabId = 'overview' | 'applications' | 'jobs' | 'portfolio' | 'about' | 'gallery';

const tabs: Array<{
  id: TabId;
  label: string;
  icon: typeof Grid2X2;
}> = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Grid2X2
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: FileText
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: BriefcaseBusiness
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: FolderKanban
  },
  {
    id: 'about',
    label: 'About',
    icon: Info
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: Image
  }
];

export default function JobSeekerTabs({ dashboard }: JobSeekerTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* Tab navigation */}

      <div className="border-b">
        <div
          className="flex overflow-x-auto px-2 sm:px-4"
          role="tablist"
          aria-label="Professional profile sections">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'relative flex shrink-0 items-center gap-2 px-4 py-4 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                ].join(' ')}>
                <Icon className="size-4" />

                <span>{tab.label}</span>

                {tab.id === 'applications' && dashboard.stats.applications > 0 && (
                  <span
                    className={[
                      'min-w-5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    ].join(' ')}>
                    {dashboard.stats.applications}
                  </span>
                )}

                {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}

      <div className="p-5 sm:p-7">
        {activeTab === 'overview' && <OverviewTab dashboard={dashboard} />}

        {activeTab === 'portfolio' && <PortfolioTab dashboard={dashboard} />}

        {activeTab === 'portfolio' && <PortfolioTab dashboard={dashboard} />}

        {activeTab === 'jobs' && (
          <PlaceholderTab
            icon={BriefcaseBusiness}
            title="Jobs"
            description="Your saved and relevant job opportunities will live here."
          />
        )}

        {activeTab === 'about' && (
          <PlaceholderTab
            icon={UserRound}
            title="About"
            description="Your professional background, skills and experience will live here."
          />
        )}

        {activeTab === 'gallery' && (
          <PlaceholderTab
            icon={Image}
            title="Gallery"
            description="Professional images, certificates and other media will live here."
          />
        )}
      </div>
    </section>
  );
}

interface PlaceholderTabProps {
  icon: typeof FileText;
  title: string;
  description: string;
}

function PlaceholderTab({ icon: Icon, title, description }: PlaceholderTabProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border bg-background text-muted-foreground shadow-sm">
        <Icon className="size-5" />
      </div>

      <h2 className="mt-4 text-lg font-semibold">{title}</h2>

      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
