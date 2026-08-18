import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CalendarDays, MapPin, Plus } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

type RecentJob = EmployerDashboardData['recentJobs'][number];

interface RecentJobsProps {
  jobs: RecentJob[];
}

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

function getStatusClass(status: RecentJob['status']) {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'CLOSED':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-semibold">Recent Jobs</h2>

          <p className="mt-1 text-sm text-muted-foreground">Your latest job postings.</p>
        </div>

        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {jobs.length === 0 ? (
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
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus className="size-4" />
            Create Job
          </Link>
        </div>
      ) : (
        <div className="divide-y">
          {jobs.map(job => (
            <article key={job.id} className="p-5 transition-colors hover:bg-muted/30 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BriefcaseBusiness className="size-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{job.title}</h3>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        Created {formatDate(job.createdAt)}
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                        job.status
                      )}`}>
                      {formatLabel(job.status)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {job.location ?? 'Location not specified'}
                    </span>

                    <span>{formatLabel(job.workMode)}</span>

                    <span>{formatLabel(job.employmentType)}</span>

                    <span>
                      {job._count.applications}{' '}
                      {job._count.applications === 1 ? 'application' : 'applications'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end border-t pt-4">
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
    </section>
  );
}
