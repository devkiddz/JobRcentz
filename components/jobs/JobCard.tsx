import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CalendarDays, Edit3, MapPin, Users } from 'lucide-react';

import { JobSkills } from './JobSkills';
import { JobStatusBadge } from './JobStatusBadge';

export type JobCardData = {
  id: string;
  title: string;
  description?: string | null;

  location?: string | null;
  workMode: string;
  employmentType: string;

  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  salaryCurrency?: string | null;

  skills: string[];

  status: string;
  approvalStatus: string;

  publishedAt?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;

  applicationsCount?: number;

  company?: {
    companyName: string;
    companyLogoUrl?: string | null;
  } | null;
};

export type JobCardAction =
  | {
      type: 'VIEW';
      href: string;
      label?: string;
    }
  | {
      type: 'EDIT';
      href: string;
      label?: string;
    }
  | {
      type: 'APPLICATIONS';
      href: string;
      label?: string;
    };

type JobCardProps = {
  job: JobCardData;
  actions?: JobCardAction[];
  showCompany?: boolean;
  showStatus?: boolean;
};

export function JobCard({ job, actions = [], showCompany = true, showStatus = true }: JobCardProps) {
  return (
    <article className="group rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      {/* Identity */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
            {job.company?.companyLogoUrl ? (
              <img src={job.company.companyLogoUrl} alt="" className="size-full rounded-xl object-cover" />
            ) : (
              <BriefcaseBusiness className="size-5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            {showCompany && job.company && (
              <p className="mb-1 text-xs font-medium text-primary">{job.company.companyName}</p>
            )}

            <h3 className="truncate font-semibold tracking-tight">{job.title}</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {formatLabel(job.employmentType)}

              <span className="mx-1.5">·</span>

              {formatLabel(job.workMode)}
            </p>
          </div>
        </div>

        {showStatus && <JobStatusBadge status={job.status} approvalStatus={job.approvalStatus} />}
      </div>

      {/* Description */}
      {job.description && (
        <p className="mt-5 line-clamp-2 text-sm leading-6 text-muted-foreground">{job.description}</p>
      )}

      {/* Skills */}
      <div className="mt-5">
        <JobSkills skills={job.skills} />
      </div>

      {/* Metadata */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {job.location && <InfoItem icon={MapPin} label="Location" value={job.location} />}

        {job.applicationsCount !== undefined && (
          <InfoItem icon={Users} label="Applications" value={String(job.applicationsCount)} />
        )}

        <InfoItem icon={CalendarDays} label="Created" value={formatDate(job.createdAt)} />
      </div>

      {/* Secondary metadata */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {job.salaryMin !== null && job.salaryMin !== undefined && (
          <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
        )}

        {job.expiresAt && <span>Expires {formatDate(job.expiresAt)}</span>}
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div className="flex flex-wrap items-center gap-4">
            {actions
              .filter(action => action.type !== 'EDIT')
              .map(action => (
                <ActionLink key={`${action.type}-${action.href}`} action={action} />
              ))}
          </div>

          {actions.some(action => action.type === 'EDIT') && (
            <div>
              {actions
                .filter(action => action.type === 'EDIT')
                .map(action => (
                  <ActionLink key={`${action.type}-${action.href}`} action={action} primary />
                ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ActionLink({ action, primary = false }: { action: JobCardAction; primary?: boolean }) {
  const label =
    action.label ??
    {
      VIEW: 'View listing',
      EDIT: 'Quick Edit',
      APPLICATIONS: 'Applications'
    }[action.type];

  const isEdit = action.type === 'EDIT';

  return (
    <Link
      href={action.href}
      className={
        primary
          ? 'inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
          : 'inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
      }>
      {isEdit && <Edit3 className="size-3.5" />}

      {label}

      {!isEdit && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
    </Link>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>

      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
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

function formatSalary(
  min: number | string,
  max: number | string | null | undefined,
  currency: string | null | undefined
) {
  const formatter = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0
  });

  const prefix = currency ? `${currency} ` : '';

  const minimum = formatter.format(Number(min));

  if (max === null || max === undefined) {
    return `${prefix}${minimum}+`;
  }

  return `${prefix}${minimum} – ${formatter.format(Number(max))}`;
}
