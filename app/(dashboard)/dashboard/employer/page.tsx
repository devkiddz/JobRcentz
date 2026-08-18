import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BriefcaseBusiness, Building2, FileText, Plus, Users } from 'lucide-react';

import { getEmployerDashboard } from '@/server/actions/dashboard/employer/getEmployerDashboard';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

function getJobStatusClass(status: string) {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'CLOSED':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default async function EmployerDashboardPage() {
  const dashboard = await getEmployerDashboard();

  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  const { user, company, stats, recentJobs } = dashboard;

  const displayName = user.name?.trim() || 'Employer';

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* =========================================================
          WELCOME
      ========================================================= */}

      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {company.companyLogoUrl ? (
                <img
                  src={company.companyLogoUrl}
                  alt={company.companyName}
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-6 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Employer Dashboard</p>

              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {displayName} 👋
              </h1>

              <p className="mt-1 truncate text-sm text-muted-foreground">{company.companyName}</p>
            </div>
          </div>

          <Link
            href="/dashboard/jobs/create"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            <Plus className="size-4" />
            Post a Job
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span>{company.companyIndustry}</span>

          <span>{company.companyLocation}</span>

          <span>Company status: {formatLabel(company.onboardingStatus)}</span>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Jobs" value={stats.totalJobs} icon={BriefcaseBusiness} />

        <StatCard label="Published" value={stats.publishedJobs} icon={FileText} />

        <StatCard label="Drafts" value={stats.draftJobs} icon={FileText} />

        <StatCard label="Applications" value={stats.totalApplications} icon={Users} />
      </section>

      {/* =========================================================
          JOBS + COMPANY
      ========================================================= */}

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Recent Jobs */}

        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold">Recent Jobs</h2>

              <p className="mt-1 text-sm text-muted-foreground">Manage your latest job postings.</p>
            </div>

            <Link href="/dashboard/jobs" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <BriefcaseBusiness className="size-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No jobs posted yet</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create your first job posting and start receiving applications.
              </p>

              <Link
                href="/dashboard/jobs/create"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="size-4" />
                Create Job
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentJobs.map(job => (
                <article
                  key={job.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BriefcaseBusiness className="size-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">{job.title}</h3>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Created {formatDate(job.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getJobStatusClass(
                            job.status
                          )}`}>
                          {formatLabel(job.status)}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span>{job.location ?? 'Location not specified'}</span>

                        <span>{formatLabel(job.workMode)}</span>

                        <span>{formatLabel(job.employmentType)}</span>

                        <span>
                          {job._count.applications}{' '}
                          {job._count.applications === 1 ? 'application' : 'applications'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end border-t pt-4">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                      Manage Job
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Company */}

        <aside className="rounded-xl border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Company Profile</h2>

              <p className="mt-1 text-sm text-muted-foreground">Your employer identity on JobMan.</p>
            </div>

            <Building2 className="size-5 text-muted-foreground" />
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>

              <p className="mt-1 text-sm font-medium">{company.companyName}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Industry</p>

              <p className="mt-1 text-sm font-medium">{company.companyIndustry}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</p>

              <p className="mt-1 text-sm font-medium">{company.companyLocation}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Job Activity
              </p>

              <p className="mt-1 text-sm font-medium">
                {stats.publishedJobs} active {stats.publishedJobs === 1 ? 'job' : 'jobs'}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/company"
            className="mt-6 flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors hover:bg-muted">
            Manage Company
            <ArrowRight className="size-4" />
          </Link>
        </aside>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: number;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
