'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, FileText, MapPin, XCircle } from 'lucide-react';

import { getJobSeekerApplications } from '@/server/actions/dashboard/jobseeker/getJobSeekerApplications';

import type { JobSeekerApplicationsData } from '@/server/actions/dashboard/jobseeker/getJobSeekerApplications';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function statusIcon(status: string) {
  switch (status) {
    case 'HIRED':
      return <CheckCircle2 className="size-4" />;

    case 'REJECTED':
    case 'WITHDRAWN':
      return <XCircle className="size-4" />;

    case 'INTERVIEW':
      return <CalendarDays className="size-4" />;

    default:
      return <Clock3 className="size-4" />;
  }
}

function statusClasses(status: string) {
  switch (status) {
    case 'HIRED':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';

    case 'REJECTED':
    case 'WITHDRAWN':
      return 'bg-destructive/10 text-destructive';

    case 'INTERVIEW':
    case 'SHORTLISTED':
      return 'bg-primary/10 text-primary';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default function ApplicationsTab() {
  const [applications, setApplications] = useState<JobSeekerApplicationsData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadApplications() {
      try {
        const data = await getJobSeekerApplications();

        if (mounted) {
          setApplications(data);
        }
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Unable to load applications.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <TabLoading label="Loading your applications..." />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Career activity</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight">Your applications</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Track every application you have submitted and the current stage of each opportunity.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-14 text-center">
          <FileText className="mx-auto size-8 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">No applications yet</h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Once you apply for a job, your application history will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(application => (
            <article
              key={application.id}
              className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                    {application.job.company.companyLogoUrl ? (
                      <img
                        src={application.job.company.companyLogoUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">
                        {application.job.company.companyName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{application.job.title}</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {application.job.company.companyName}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      {application.job.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {application.job.location}
                        </span>
                      )}

                      <span>{formatLabel(application.job.workMode)}</span>

                      <span>{formatLabel(application.job.employmentType)}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(
                    application.status
                  )}`}>
                  {statusIcon(application.status)}
                  {formatLabel(application.status)}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
                <span>Applied {formatDate(application.appliedAt)}</span>

                {application.interviews.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <CalendarDays className="size-3.5" />
                    {application.interviews.length} interview
                    {application.interviews.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function TabLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-2xl border bg-muted/20">
      <div className="text-center">
        <div className="mx-auto size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />

        <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function TabError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
      <p className="text-sm font-medium text-destructive">Unable to load this section.</p>

      <p className="mt-1 text-sm text-destructive/80">{message}</p>
    </div>
  );
}
