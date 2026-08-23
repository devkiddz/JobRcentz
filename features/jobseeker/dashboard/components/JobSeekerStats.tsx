import Link from 'next/link';
import { ArrowRight, Bookmark, BriefcaseBusiness, Eye, FolderKanban, Video } from 'lucide-react';

interface JobSeekerStatsProps {
  stats: {
    applications: number;
    savedJobs: number;
    profileViews?: number;
    portfolioProjects?: number;
    upcomingInterviews?: number;
  };
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  href?: string;
}

function StatCard({ label, value, icon, href }: StatCardProps) {
  const content = (
    <div className="min-w-[230px] rounded-2xl border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>

      {href && (
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          View details
          <ArrowRight className="size-3.5" />
        </div>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export default function JobSeekerStats({ stats }: JobSeekerStatsProps) {
  return (
    <div className="flex gap-4">
      <StatCard
        label="Applications"
        value={stats.applications}
        icon={<BriefcaseBusiness className="size-5" />}
        href="/dashboard/applications"
      />

      <StatCard
        label="Saved Jobs"
        value={stats.savedJobs}
        icon={<Bookmark className="size-5" />}
        href="/dashboard/saved-jobs"
      />

      <StatCard
        label="Profile Views"
        value={stats.profileViews ?? 0}
        icon={<Eye className="size-5" />}
        href="/dashboard/analytics"
      />

      <StatCard
        label="Portfolio Projects"
        value={stats.portfolioProjects ?? 0}
        icon={<FolderKanban className="size-5" />}
        href="/dashboard/portfolio"
      />

      <StatCard
        label="Upcoming Interviews"
        value={stats.upcomingInterviews ?? 0}
        icon={<Video className="size-5" />}
        href="/dashboard/interviews"
      />
    </div>
  );
}
