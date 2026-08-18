import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  XCircle
} from 'lucide-react';

interface ApplicationCardProps {
  application: {
    id: string;
    status: string;
    appliedAt: Date;
    updatedAt: Date;
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
  };
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
      return 'bg-primary/10 text-primary';

    case 'HIRED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    case 'WITHDRAWN':
      return 'bg-muted text-muted-foreground';

    default:
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'HIRED':
      return CheckCircle2;

    case 'REJECTED':
    case 'WITHDRAWN':
      return XCircle;

    case 'INTERVIEW':
      return CalendarDays;

    default:
      return Clock3;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const StatusIcon = getStatusIcon(application.status);

  return (
    <article className="group flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 sm:p-6">
      <div className="flex gap-4">
        {/* Company logo */}
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
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

        {/* Job information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{application.job.title}</h3>

              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {application.job.company.companyName}
              </p>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                application.status
              )}`}>
              <StatusIcon className="size-3.5" />
              {formatLabel(application.status)}
            </span>
          </div>

          {/* Job metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {application.job.location ?? 'Location not specified'}
            </span>

            <span>{formatLabel(application.job.workMode)}</span>

            <span>{formatLabel(application.job.employmentType)}</span>

            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              Applied {formatDate(application.appliedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">Last updated {formatDate(application.updatedAt)}</p>

        <Link
          href={`/jobs/${application.job.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          View Job
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
