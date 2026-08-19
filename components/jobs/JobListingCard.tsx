import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Pencil,
  Users,
  XCircle
} from 'lucide-react';

import type { JobListingCardProps, JobListingCardRole } from './JobListingCard.types';

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

function formatSalary(min: number | null, max: number | null, currency: string | null) {
  if (min === null && max === null) {
    return 'Salary not specified';
  }

  const formatter = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0
  });

  const symbol = currency ?? 'NGN';

  if (min !== null && max !== null) {
    return `${symbol} ${formatter.format(min)} – ${formatter.format(max)}`;
  }

  if (min !== null) {
    return `From ${symbol} ${formatter.format(min)}`;
  }

  return `Up to ${symbol} ${formatter.format(max!)}`;
}

function getStatus(status: string, approvalStatus: string) {
  if (status === 'DRAFT') {
    return {
      label: 'Draft',
      icon: FileText,
      className: 'bg-muted text-muted-foreground'
    };
  }

  if (status === 'CLOSED') {
    return {
      label: 'Closed',
      icon: XCircle,
      className: 'bg-muted text-muted-foreground'
    };
  }

  if (approvalStatus === 'APPROVED') {
    return {
      label: 'Published',
      icon: CheckCircle2,
      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    };
  }

  if (approvalStatus === 'REJECTED') {
    return {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive'
    };
  }

  return {
    label: 'Pending Review',
    icon: Clock3,
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  };
}

function getPreviewHref(role: JobListingCardRole, jobId: string) {
  return role === 'EMPLOYER' ? `/dashboard/employer/jobs/${jobId}` : `/jobs/${jobId}`;
}

export function JobListingCard({
  job,
  role,
  showCompany = true,
  showDescription = false,
  showSalary = true
}: JobListingCardProps) {
  const state = getStatus(job.status, job.approvalStatus);
  const StateIcon = state.icon;

  const canApply = role === 'PUBLIC' || role === 'APPLICANT';
  const canEdit = role === 'EMPLOYER';
  const canManage = role === 'ADMIN';

  const previewHref = getPreviewHref(role, job.id);

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 gap-3.5 sm:gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/50 sm:size-12">
              {job.company.companyLogoUrl ? (
                <img
                  src={job.company.companyLogoUrl}
                  alt={`${job.company.companyName} logo`}
                  className="size-full object-cover"
                />
              ) : (
                <BriefcaseBusiness className="size-5 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              {showCompany && (
                <p className="truncate text-xs font-medium text-primary">{job.company.companyName}</p>
              )}

              <h3 className="mt-1 line-clamp-2 text-base font-semibold tracking-tight sm:text-lg">
                {job.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>{formatLabel(job.employmentType)}</span>

                <span>·</span>

                <span>{formatLabel(job.workMode)}</span>

                {job.location && (
                  <>
                    <span>·</span>

                    <span className="inline-flex min-w-0 items-center gap-1">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${state.className}`}>
            <StateIcon className="size-3.5" />
            {state.label}
          </span>
        </div>

        {/* Description */}
        {showDescription && (
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">{job.description}</p>
        )}

        {/* Salary */}
        {showSalary && (
          <div className="mt-5 rounded-xl bg-muted/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Compensation</p>

            <p className="mt-1 text-sm font-semibold">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </p>
          </div>
        )}

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 6).map(skill => (
              <span
                key={skill}
                className="rounded-md border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
                {skill}
              </span>
            ))}

            {job.skills.length > 6 && (
              <span className="rounded-md border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
                +{job.skills.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              Applications
            </div>

            <p className="mt-1 text-lg font-semibold tabular-nums">{job.applicationCount}</p>
          </div>

          <div className="rounded-xl bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Expires
            </div>

            <p className="mt-1 text-sm font-medium">{formatDate(job.expiresAt)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={previewHref}
            className="inline-flex h-9 items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:justify-start">
            {role === 'EMPLOYER' ? 'Preview' : 'View listing'}
            <ArrowRight className="size-3.5" />
          </Link>

          <div className="flex flex-wrap gap-2">
            {/* Applicant */}
            {canApply && (
              <Link
                href={`/jobs/${job.id}`}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Apply
              </Link>
            )}

            {/* Employer */}
            {canEdit && (
              <>
                <Link
                  href={`/dashboard/employer/jobs/${job.id}/edit`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted">
                  <Pencil className="size-3.5" />
                  Quick Edit
                </Link>

                <Link
                  href={`/dashboard/employer/jobs/${job.id}/applications`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted">
                  <Users className="size-3.5" />
                  Applications
                  <span className="min-w-5 rounded-full bg-muted px-1.5 py-0.5 text-center text-[10px] font-semibold tabular-nums">
                    {job.applicationCount}
                  </span>
                </Link>
              </>
            )}

            {/* Admin */}
            {canManage && (
              <Link
                href={`/dashboard/admin/jobs/${job.id}`}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted">
                Manage
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
