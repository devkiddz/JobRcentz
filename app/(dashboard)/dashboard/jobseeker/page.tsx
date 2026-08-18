import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BriefcaseBusiness, Bookmark, MapPin, UserRound } from 'lucide-react';

import { getJobSeekerDashboard } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

function formatApplicationStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getStatusClass(status: string) {
  switch (status) {
    case 'SHORTLISTED':
    case 'INTERVIEW':
      return 'bg-primary/10 text-primary';

    case 'HIRED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default async function JobSeekerDashboardPage() {
  const dashboard = await getJobSeekerDashboard();

  if (dashboard.user.role !== 'JOB_SEEKER') {
    redirect('/dashboard');
  }

  const { user, profile, stats, recentApplications } = dashboard;

  const displayName = user.name?.trim() || 'Job Seeker';

  const professionalTitle = profile.currentRole ?? profile.headline ?? 'Job Seeker';

  const profileImage = profile.profilePhotoUrl ?? user.image ?? undefined;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* =========================================================
          WELCOME
      ========================================================= */}

      <section className="flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
              {profileImage ? (
                <img src={profileImage} alt={`${displayName}'s profile`} className="size-full object-cover" />
              ) : (
                <UserRound className="size-6 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Job Seeker Dashboard</p>

              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {displayName} 👋
              </h1>

              <p className="mt-1 truncate text-sm text-muted-foreground">{professionalTitle}</p>
            </div>
          </div>

          <Link
            href="/jobs"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Find Jobs
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" />
            {profile.location}
          </span>

          {profile.yearsOfExperience !== null && <span>{profile.yearsOfExperience} years experience</span>}

          <span>Profile status: {formatApplicationStatus(profile.onboardingStatus)}</span>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Applications</p>

              <p className="mt-2 text-3xl font-bold">{stats.applications}</p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
              <BriefcaseBusiness className="size-5 text-primary" />
            </div>
          </div>

          <Link
            href="/dashboard/applications"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View applications
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saved Jobs</p>

              <p className="mt-2 text-3xl font-bold">{stats.savedJobs}</p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-lg bg-muted">
              <Bookmark className="size-5 text-muted-foreground" />
            </div>
          </div>

          <Link
            href="/dashboard/saved-jobs"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View saved jobs
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================
          RECENT APPLICATIONS + PROFILE
      ========================================================= */}

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Recent applications */}

        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">Recent Applications</h2>

              <p className="text-sm text-muted-foreground">Track your latest job applications.</p>
            </div>

            {recentApplications.length > 0 && (
              <Link
                href="/dashboard/applications"
                className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            )}
          </div>

          {recentApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <BriefcaseBusiness className="size-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No applications yet</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Start exploring available jobs and submit your first application.
              </p>

              <Link
                href="/jobs"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Find Jobs
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentApplications.map(application => (
                <div key={application.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                    {application.job.company.companyLogoUrl ? (
                      <img
                        src={application.job.company.companyLogoUrl}
                        alt={application.job.company.companyName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <BriefcaseBusiness className="size-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{application.job.title}</p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {application.job.company.companyName}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {application.job.location ?? 'Location not specified'}
                      {' · '}
                      {formatApplicationStatus(application.job.workMode)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                      application.status
                    )}`}>
                    {formatApplicationStatus(application.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Professional Profile</h2>

              <p className="mt-1 text-sm text-muted-foreground">Keep your profile ready for employers.</p>
            </div>

            <UserRound className="size-5 text-muted-foreground" />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Headline</p>

              <p className="mt-1 text-sm font-medium">{profile.headline}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Current Role
              </p>

              <p className="mt-1 text-sm font-medium">{profile.currentRole ?? 'Not specified'}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</p>

              <p className="mt-1 text-sm font-medium">{profile.location}</p>
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="mt-6 flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors hover:bg-muted">
            Manage Profile
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
