import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BriefcaseBusiness, CalendarDays, FileText, MapPin, Plus, Users } from 'lucide-react';

import { getEmployerJobs } from '@/server/actions/dashboard/employer/getEmployerJobs';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(date: Date | null) {
  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

function getStatusClass(status: string) {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'CLOSED':
      return 'bg-destructive/10 text-destructive';

    case 'DRAFT':
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default async function EmployerJobsPage() {
  const dashboard = await getEmployerJobs();

  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  const { company, jobs } = dashboard;

  const published = jobs.filter(job => job.status === 'PUBLISHED').length;
  const drafts = jobs.filter(job => job.status === 'DRAFT').length;
  const closed = jobs.filter(job => job.status === 'CLOSED').length;

  const totalApplications = jobs.reduce((total, job) => total + job._count.applications, 0);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">{company.companyName}</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Jobs</h1>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Manage the opportunities your company has created on JobMan.
            </p>
          </div>

          <Link
            href="/jobs/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            <Plus className="size-4" />
            Post a Job
          </Link>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Jobs" value={jobs.length} icon={BriefcaseBusiness} />

        <SummaryCard label="Published" value={published} icon={FileText} />

        <SummaryCard label="Drafts" value={drafts} icon={FileText} />

        <SummaryCard label="Applications" value={totalApplications} icon={Users} />
      </section>

      {/* Jobs */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Your Jobs</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {published} published · {drafts} drafts · {closed} closed
              </p>
            </div>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <BriefcaseBusiness className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">No jobs yet</h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create your first job listing to start receiving applications from professionals.
            </p>

            <Link
              href="/jobs/create"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="size-4" />
              Create Your First Job
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {jobs.map(job => (
              <article key={job.id} className="p-5 transition-colors hover:bg-muted/30 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Job identity */}
                  <div className="flex min-w-0 gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-muted">
                      <BriefcaseBusiness className="size-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{job.title}</h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                            job.status
                          )}`}>
                          {formatLabel(job.status)}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {job.location ?? 'Location not specified'}
                        </span>

                        <span>{formatLabel(job.workMode)}</span>

                        <span>{formatLabel(job.employmentType)}</span>

                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          Created {formatDate(job.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="flex shrink-0 items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                    <Users className="size-4 text-muted-foreground" />

                    <div>
                      <p className="text-sm font-semibold">{job._count.applications}</p>

                      <p className="text-xs text-muted-foreground">
                        {job._count.applications === 1 ? 'Application' : 'Applications'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span>Published: {formatDate(job.publishedAt)}</span>

                    <span>Expires: {formatDate(job.expiresAt)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                      View Job
                      <ArrowRight className="size-3.5" />
                    </Link>

                    <Link
                      href={`/dashboard/jobs/${job.id}/applications`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline">
                      Applications
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({
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
