'use client';

import {
  BriefcaseBusiness,
  FileText,
  Clock3,
  Users,
  TrendingUp,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

import MetricCard from '@/components/dashboard/MetricCard';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

interface EmployerStatsProps {
  stats: EmployerDashboardData['stats'];
  applicationTrend: EmployerDashboardData['analytics']['applicationTrend'];
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) {
    return (
      <div className="flex h-8 items-end gap-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-1.5 flex-1 rounded-full bg-muted" />
        ))}
      </div>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data);

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const normalized = max === min ? 50 : 92 - ((value - min) / (max - min)) * 72;

      return `${x},${normalized}`;
    })
    .join(' ');

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-8 w-full overflow-visible"
      aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
    </svg>
  );
}

export default function EmployerStats({ stats, applicationTrend }: EmployerStatsProps) {
  const totalJobs = stats.jobs.total;
  const totalApplications = stats.applications.total;

  const publishedRate = totalJobs > 0 ? Math.round((stats.jobs.published / totalJobs) * 100) : 0;

  const draftRate = totalJobs > 0 ? Math.round((stats.jobs.drafts / totalJobs) * 100) : 0;

  const hiredRate =
    totalApplications > 0 ? Math.round((stats.applications.hired / totalApplications) * 100) : 0;

  const applicationTrendData = applicationTrend.map(item => item.applications);

  const items = [
    {
      label: 'Total Jobs',
      value: totalJobs,
      context: `${stats.jobs.closed} closed`,
      icon: 'briefcase' as const,
      contextIcon: 'briefcase' as const,
      href: '/dashboard/employer/jobs',

      visual: (
        <div className="flex h-8 items-end gap-1">
          <div className="h-[45%] flex-1 rounded-sm bg-muted" />
          <div className="h-[60%] flex-1 rounded-sm bg-muted" />
          <div className="h-[50%] flex-1 rounded-sm bg-muted" />
          <div className="h-[75%] flex-1 rounded-sm bg-muted" />
          <div className="h-[85%] flex-1 rounded-sm bg-primary/50" />
          <div className="h-full flex-1 rounded-sm bg-primary" />
        </div>
      )
    },
    {
      label: 'Published',
      value: stats.jobs.published,
      context: `${publishedRate}% of total jobs`,
      icon: 'file' as const,
      contextIcon: 'check' as const,
      href: '/dashboard/employer/jobs?status=published',

      visual: (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Published rate</span>
            <span className="font-medium text-foreground">{publishedRate}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${publishedRate}%` }} />
          </div>
        </div>
      )
    },
    {
      label: 'Drafts',
      value: stats.jobs.drafts,
      context: `${draftRate}% of total jobs`,
      icon: 'clock' as const,
      contextIcon: 'clock' as const,
      href: '/dashboard/employer/jobs?status=draft',

      visual: (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Pipeline</span>
            <span className="font-medium text-foreground">{draftRate}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${draftRate}%` }} />
          </div>
        </div>
      )
    },
    {
      label: 'Applications',
      value: totalApplications,
      context:
        stats.applications.hired > 0
          ? `${stats.applications.hired} hired • ${hiredRate}% conversion`
          : `${stats.applications.shortlisted} shortlisted`,
      icon: 'users' as const,
      contextIcon: stats.applications.hired > 0 ? ('userCheck' as const) : ('trending' as const),
      href: '/dashboard/employer/applications',

      visual: <MiniSparkline data={applicationTrendData} />
    }
  ];

  return (
    <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map(item => (
        <MetricCard key={item.label} {...item} />
      ))}
    </section>
  );
}
