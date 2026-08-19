import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Globe2, ShieldCheck, Users } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

type Company = EmployerDashboardData['company'];
type Stats = EmployerDashboardData['stats'];
type Profile = EmployerDashboardData['profile'];

interface EmployerCompanyCardProps {
  company: Company;
  stats: Stats;
  profile: Profile;
}

function formatVisibility(value: Company['visibility']) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function EmployerCompanyCard({ company, stats, profile }: EmployerCompanyCardProps) {
  const discoverable = profile.isDiscoverable;

  return (
    <aside className="rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Company Presence</h2>

            <p className="mt-1 text-xs text-muted-foreground">How candidates currently see your company.</p>
          </div>

          <ShieldCheck className="size-5 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-background">
              {discoverable ? (
                <Eye className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <EyeOff className="size-4 text-muted-foreground" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium">Discoverability</p>
              <p className="text-xs text-muted-foreground">Candidate discovery</p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold ${
              discoverable ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
            }`}>
            {discoverable ? 'On' : 'Off'}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-background">
              <Globe2 className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium">Profile visibility</p>
              <p className="text-xs text-muted-foreground">Who can access the profile</p>
            </div>
          </div>

          <span className="text-xs font-semibold">{formatVisibility(profile.visibility)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-xl bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Profile views</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{profile.profileViews}</p>
          </div>

          <div className="rounded-xl bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              Active jobs
            </div>

            <p className="mt-1 text-lg font-bold tabular-nums">{stats.jobs.published}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-3">
          <p className="text-sm font-medium">{company.companyName}</p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {company.companyIndustry} · {company.companyLocation}
          </p>
        </div>

        <Link
          href="/dashboard/employer/company"
          className="flex h-9 items-center justify-center gap-2 rounded-lg border text-xs font-medium transition-colors hover:bg-muted">
          Manage Company
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
