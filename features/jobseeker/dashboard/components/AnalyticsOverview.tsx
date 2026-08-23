import { Bookmark, Eye, FileText, TrendingUp } from 'lucide-react';

import type { JobSeekerAnalyticsData } from '@/server/actions/dashboard/jobseeker/getJobSeekerAnalytics';

interface AnalyticsOverviewProps {
  stats: JobSeekerAnalyticsData['stats'];
}

export default function AnalyticsOverview({ stats }: AnalyticsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsStatCard
        label="Profile Views"
        value={stats.totalProfileViews}
        description={`${stats.todayViews} today`}
        icon={Eye}
      />

      <AnalyticsStatCard
        label="Applications"
        value={stats.applications}
        description="Total applications"
        icon={FileText}
      />

      <AnalyticsStatCard
        label="Saved Jobs"
        value={stats.savedJobs}
        description="Jobs saved"
        icon={Bookmark}
      />

      <AnalyticsStatCard
        label="Profile Completion"
        value={`${stats.profileCompletion}%`}
        description="Profile completeness"
        icon={TrendingUp}
      />
    </div>
  );
}

interface AnalyticsStatCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function AnalyticsStatCard({ label, value, description, icon: Icon }: AnalyticsStatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
