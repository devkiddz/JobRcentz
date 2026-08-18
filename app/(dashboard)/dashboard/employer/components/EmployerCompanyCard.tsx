import Link from 'next/link';
import { ArrowRight, Eye, Globe2, ShieldCheck, Users } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

type Company = EmployerDashboardData['company'];
type Stats = EmployerDashboardData['stats'];
type Profile = EmployerDashboardData['profile'];

interface EmployerCompanyCardProps {
  company: Company;
  stats: Stats;
  profile: Profile;
}

export default function EmployerCompanyCard({ company, stats, profile }: EmployerCompanyCardProps) {
  return (
    <aside className="rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Company Presence</h2>

          <p className="mt-1 text-sm text-muted-foreground">How candidates see your company.</p>
        </div>

        <ShieldCheck className="size-5 text-muted-foreground" />
      </div>

      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <Eye className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium">Profile views</p>
              <p className="text-xs text-muted-foreground">Candidate visits</p>
            </div>
          </div>

          <span className="font-semibold">{profile.profileViews}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <Users className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium">Active jobs</p>
              <p className="text-xs text-muted-foreground">Currently published</p>
            </div>
          </div>

          <span className="font-semibold">{stats.jobs.published}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <Globe2 className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium">Discoverability</p>
              <p className="text-xs text-muted-foreground">Candidate visibility</p>
            </div>
          </div>

          <span
            className={
              profile.isDiscoverable
                ? 'text-sm font-medium text-green-600 dark:text-green-400'
                : 'text-sm font-medium text-muted-foreground'
            }>
            {profile.isDiscoverable ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-muted/50 p-4">
        <p className="text-sm font-medium">{company.companyName}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {company.companyIndustry} · {company.companyLocation}
        </p>
      </div>

      <Link
        href="/dashboard/employer/company"
        className="mt-5 flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors hover:bg-muted">
        Manage Company
        <ArrowRight className="size-4" />
      </Link>
    </aside>
  );
}
