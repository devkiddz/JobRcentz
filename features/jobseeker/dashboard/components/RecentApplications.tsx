import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CalendarDays, ChevronRight, MapPin, Clock3 } from 'lucide-react';

interface RecentApplicationsProps {
  applications: Array<{
    id: string;
    status: string;
    appliedAt: Date;

    job: {
      id: string;
      title: string;
      location: string | null;
      workMode: string;
      employmentType: string;

      company: {
        companyName: string;
        companyLogoUrl: string | null;
      };
    };
  }>;
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getStatusClass(status: string) {
  switch (status) {
    case 'SHORTLISTED':
    case 'INTERVIEW':
      return 'border-primary/20 bg-primary/10 text-primary';

    case 'HIRED':
      return 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'border-destructive/20 bg-destructive/10 text-destructive';

    case 'REVIEWING':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400';

    case 'WITHDRAWN':
      return 'border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400';

    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}

export default function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex items-start justify-between gap-4 border-b px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <BriefcaseBusiness className="size-4 text-primary" />
            </div>

            <h2 className="font-semibold tracking-tight">Recent Applications</h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Keep track of your latest job applications and their progress.
          </p>
        </div>

        {applications.length > 0 && (
          <Link
            href="/dashboard/applications"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-primary transition hover:bg-primary/10">
            <span className="hidden sm:inline">View all</span>
            <span className="sm:hidden">All</span>

            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* ============================================================
          EMPTY STATE
      ============================================================ */}

      {applications.length === 0 ? (
        <div className="px-6 py-14">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border bg-muted/60">
              <BriefcaseBusiness className="size-7 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-base font-semibold">No applications yet</h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              You have not applied to any jobs yet. Explore available opportunities and start building your
              application history.
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
              Find Jobs
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* ============================================================
           APPLICATION CARDS
        ============================================================ */

        <div className="p-3 sm:p-4">
          <div className="space-y-3">
            {applications.map(application => (
              <Link
                key={application.id}
                href={`/dashboard/applications/${application.id}`}
                className="group block rounded-xl border bg-background p-4 transition-all hover:border-primary/30 hover:bg-muted/30 hover:shadow-sm sm:p-5">
                <div className="flex items-start gap-4">
                  {/* ------------------------------------------------
                      COMPANY LOGO
                  ------------------------------------------------ */}

                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted sm:size-14">
                    {application.job.company.companyLogoUrl ? (
                      <img
                        src={application.job.company.companyLogoUrl}
                        alt={application.job.company.companyName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <BriefcaseBusiness className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* ------------------------------------------------
                      MAIN CONTENT
                  ------------------------------------------------ */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary sm:text-base">
                          {application.job.title}
                        </h3>

                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {application.job.company.companyName}
                        </p>
                      </div>

                      {/* STATUS */}

                      <span
                        className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                          application.status
                        )}`}>
                        {formatLabel(application.status)}
                      </span>
                    </div>

                    {/* ------------------------------------------------
                        JOB META
                    ------------------------------------------------ */}

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />

                        {application.job.location ?? 'Location not specified'}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <BriefcaseBusiness className="size-3.5" />

                        {formatLabel(application.job.workMode)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="size-3.5" />

                        {formatLabel(application.job.employmentType)}
                      </span>
                    </div>

                    {/* ------------------------------------------------
                        APPLICATION DATE
                    ------------------------------------------------ */}

                    <div className="mt-4 flex items-center justify-between gap-4 border-t pt-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        Applied {formatDate(application.appliedAt)}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                        View application
                        <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
