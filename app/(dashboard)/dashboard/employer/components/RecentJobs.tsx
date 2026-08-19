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
    month: 'short'
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

export default function RecentJobs({ jobs }: RecentJobsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">Recent Jobs</h2>

          <p className="mt-1 text-xs text-muted-foreground">Your latest job postings.</p>
        </div>

        <Link
          href="/dashboard/employer/jobs"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {jobs.map(job => {
            const status = getStatusConfig(job.status);
            const StatusIcon = status.icon;
            const applications = job._count.applications;

            return (
              <article
                key={job.id}
                className="group rounded-xl border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BriefcaseBusiness className="size-4 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/employer/jobs/${job.id}`}
                        className="line-clamp-2 text-sm font-semibold hover:text-primary">
                        {job.title}
                      </Link>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {formatLabel(job.employmentType)} · {formatLabel(job.workMode)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${status.className}`}>
                    <StatusIcon className="size-3" />
                    {status.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted/40 p-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Users className="size-3" />
                      Applications
                    </div>

                    <p className="mt-1 text-sm font-bold tabular-nums">{applications}</p>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <CalendarDays className="size-3" />
                      Created
                    </div>

                    <p className="mt-1 text-xs font-semibold">{formatDate(job.createdAt)}</p>
                  </div>
                </div>

                {job.location && (
                  <div className="mt-3 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <Link
                    href={`/dashboard/employer/jobs/${job.id}/applications`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground">
                    <Users className="size-3.5" />
                    Applications
                  </Link>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/employer/jobs/${job.id}/edit`}
                      className="inline-flex size-8 items-center justify-center rounded-lg border hover:bg-muted"
                      aria-label={`Edit ${job.title}`}>
                      <Pencil className="size-3.5" />
                    </Link>

                    <Link
                      href={`/dashboard/employer/jobs/${job.id}`}
                      className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                      aria-label={`Manage ${job.title}`}>
                      <ArrowRight className="size-3.5" />
                    </Link>
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
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <BriefcaseBusiness className="size-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">No jobs posted yet</h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        Create your first job posting and start building your candidate pipeline.
      </p>

      <Link
        href="/dashboard/employer/jobs/create"
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90">
        <Plus className="size-3.5" />
        Create Job
      </Link>
    </div>
  );
}
