import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Users,
  XCircle
} from 'lucide-react';

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

function formatDate(date: Date | null) {
  if (!date) return '—';

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

function getStatusConfig(status: RecentJob['status']) {
  switch (status) {
    case 'PUBLISHED':
      return {
        label: 'Published',
        icon: CheckCircle2,
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      };

    case 'CLOSED':
      return {
        label: 'Closed',
        icon: XCircle,
        className: 'bg-destructive/10 text-destructive'
      };

    case 'DRAFT':
    default:
      return {
        label: 'Draft',
        icon: Clock3,
        className: 'bg-muted text-muted-foreground'
      };
  }
}

function getApplicationLabel(count: number) {
  return `${count} ${count === 1 ? 'application' : 'applications'}`;
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="font-semibold">Recent Jobs</h2>

          <p className="mt-1 text-sm text-muted-foreground">Your latest job postings and hiring activity.</p>
        </div>

        <Link
          href="/dashboard/employer/jobs"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline">
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y">
          {jobs.map(job => {
            const status = getStatusConfig(job.status);
            const StatusIcon = status.icon;

            const applicationCount = job._count.applications;

            return (
              <article key={job.id} className="group p-5 transition-colors hover:bg-muted/20 sm:p-6">
                {/* Main content */}
                <div className="flex items-start gap-4">
                  {/* Job icon */}
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-primary/10">
                    <BriefcaseBusiness className="size-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Title + status */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <Link
                          href={`/dashboard/employer/jobs/${job.id}`}
                          className="block truncate font-semibold transition-colors hover:text-primary">
                          {job.title}
                        </Link>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3.5" />
                            Posted {formatDate(job.createdAt)}
                          </span>

                          {job.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="size-3.5" />
                              {job.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.className}`}>
                        <StatusIcon className="size-3.5" />
                        {status.label}
                      </span>
                    </div>

                    {/* Job metadata */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-md border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {formatLabel(job.workMode)}
                      </span>

                      <span className="rounded-md border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {formatLabel(job.employmentType)}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        <Users className="size-3.5" />
                        {getApplicationLabel(applicationCount)}
                      </span>
                    </div>

                    {/* Activity / footer */}
                    <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-muted-foreground">
                        {applicationCount > 0 ? (
                          <span>
                            {applicationCount === 1
                              ? '1 candidate has applied'
                              : `${applicationCount} candidates have applied`}
                          </span>
                        ) : (
                          <span>No applications yet</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-primary">
                        <Link
                          href={`/dashboard/employer/jobs/${job.id}/applications`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted">
                          <Users className="size-3.5 text-primary" />
                          Applications
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            {job._count.applications}
                          </span>
                        </Link>

                        <Link
                          href={`/dashboard/employer/jobs/${job.id}/edit`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted">
                          <Pencil className="size-3.5" />
                          Edit
                        </Link>

                        <Link
                          href={`/dashboard/employer/jobs/${job.id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 text-xs font-medium text-primary transition-colors hover:border-primary/50 hover:bg-primary/10">
                          Manage
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <BriefcaseBusiness className="size-6 text-muted-foreground" />
      </div>

      <h3 className="mt-5 font-semibold">No jobs posted yet</h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Create your first job posting and start building your candidate pipeline.
      </p>

      <Link
        href="/dashboard/employer/jobs/create"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        <Plus className="size-4" />
        Create Job
      </Link>
    </div>
  );
}
