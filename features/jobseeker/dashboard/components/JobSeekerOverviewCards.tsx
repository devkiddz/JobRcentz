'use client';

import Link from 'next/link';
import { Bookmark, BriefcaseBusiness, Eye, FileCheck2, FolderKanban } from 'lucide-react';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

interface JobSeekerOverviewCardsProps {
  dashboard: JobSeekerDashboardData;
}

export default function JobSeekerOverviewCards({ dashboard }: JobSeekerOverviewCardsProps) {
  const { stats } = dashboard;

  const cards = [
    {
      title: 'Applications',
      value: stats.applications,
      description: 'Total applications',
      icon: FileCheck2,
      href: '/dashboard/applications',
      tone: 'primary'
    },
    {
      title: 'Profile Views',
      value: stats.profileViews,
      description: 'People viewed your profile',
      icon: Eye,
      href: '/dashboard/analytics',
      tone: 'blue'
    },
    {
      title: 'Saved Jobs',
      value: stats.savedJobs,
      description: 'Jobs saved for later',
      icon: Bookmark,
      href: '/dashboard/saved-jobs',
      tone: 'amber'
    },
    {
      title: 'Portfolio Projects',
      value: stats.portfolioProjects,
      description: 'Projects in your portfolio',
      icon: FolderKanban,
      href: '/dashboard/portfolio',
      tone: 'green'
    }
  ] as const;

  return (
    <section aria-label="Job seeker overview">
      {/* Mobile carousel */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none sm:hidden">
        {cards.map(card => (
          <div key={card.title} className="w-[82%] shrink-0 snap-start first:ml-0 last:mr-4">
            <OverviewCard {...card} />
          </div>
        ))}
      </div>

      {/* Tablet / Desktop grid */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => (
          <OverviewCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

interface OverviewCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  tone: 'primary' | 'blue' | 'amber' | 'green';
}

function OverviewCard({ title, value, description, icon: Icon, href, tone }: OverviewCardProps) {
  const toneStyles = {
    primary: {
      icon: 'bg-primary/10 text-primary',
      accent: 'bg-primary'
    },
    blue: {
      icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      accent: 'bg-blue-500'
    },
    amber: {
      icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      accent: 'bg-amber-500'
    },
    green: {
      icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      accent: 'bg-emerald-500'
    }
  };

  const styles = toneStyles[tone];

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        <BriefcaseBusiness className="size-3.5" />
        <span>View details</span>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${styles.accent}`}
      />
    </Link>
  );
}
