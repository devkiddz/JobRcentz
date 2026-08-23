'use client';

import { BriefcaseBusiness, Eye, FolderKanban, FileText, UserRound } from 'lucide-react';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

interface OverviewTabProps {
  dashboard: JobSeekerDashboardData;
}

export default function OverviewTab({ dashboard }: OverviewTabProps) {
  const { profile, stats } = dashboard;

  return (
    <section className="space-y-7">
      <div>
        <p className="text-sm font-medium text-primary">Professional overview</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight">Your professional dashboard</h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          A quick view of your profile strength, activity and professional presence.
        </p>
      </div>

      {/* Profile completion */}

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Profile completion</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Complete your profile to make it easier for employers to understand your experience.
            </p>
          </div>

          <div className="text-2xl font-bold">{profile.profileCompletion}%</div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${profile.profileCompletion}%`
            }}
          />
        </div>
      </section>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewStat icon={FileText} label="Applications" value={stats.applications} />

        <OverviewStat icon={FolderKanban} label="Portfolio projects" value={stats.portfolioProjects} />

        <OverviewStat icon={Eye} label="Profile views" value={stats.profileViews} />

        <OverviewStat icon={BriefcaseBusiness} label="Upcoming interviews" value={stats.upcomingInterviews} />
      </div>

      {/* Professional snapshot */}

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <UserRound className="size-4 text-primary" />

          <h3 className="font-semibold">Professional snapshot</h3>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SnapshotItem
            label="Current role"
            value={profile.currentRole ?? profile.headline ?? 'Not specified'}
          />

          <SnapshotItem label="Location" value={profile.location || 'Not specified'} />

          <SnapshotItem
            label="Experience"
            value={
              profile.yearsOfExperience !== null
                ? `${profile.yearsOfExperience} ${profile.yearsOfExperience === 1 ? 'year' : 'years'}`
                : 'Not specified'
            }
          />

          <SnapshotItem
            label="Availability"
            value={profile.isAvailable ? 'Available for work' : 'Not currently available'}
          />

          <SnapshotItem
            label="Discovery"
            value={profile.isDiscoverable ? 'Discoverable' : 'Hidden from discovery'}
          />

          <SnapshotItem
            label="Skills"
            value={
              profile.skills.length > 0
                ? `${profile.skills.length} ${profile.skills.length === 1 ? 'skill' : 'skills'}`
                : 'No skills added'
            }
          />
        </div>
      </section>
    </section>
  );
}

interface OverviewStatProps {
  icon: typeof FileText;
  label: string;
  value: number;
}

function OverviewStat({ icon: Icon, label, value }: OverviewStatProps) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

interface SnapshotItemProps {
  label: string;
  value: string;
}

function SnapshotItem({ label, value }: SnapshotItemProps) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
