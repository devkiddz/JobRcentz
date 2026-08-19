import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Pencil,
  Users,
  XCircle,
  type LucideIcon
} from 'lucide-react';

import { getJobById } from '@/server/actions/jobs/getJobById';

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
  }).format(date);
}

function formatSalary(min: string | null, max: string | null, currency: string | null) {
  if (!min && !max) return 'Salary not specified';

  const symbol = currency ?? 'NGN';

  if (min && max) {
    return `${symbol} ${min} – ${max}`;
  }

  if (min) {
    return `From ${symbol} ${min}`;
  }

  return `Up to ${symbol} ${max}`;
}

function getStatus(status: string, approvalStatus: string) {
  if (status === 'DRAFT') {
    return {
      label: 'Draft',
      description: 'This job has not been published yet.',
      icon: FileText,
      className: 'bg-muted text-muted-foreground'
    };
  }

  if (status === 'CLOSED') {
    return {
      label: 'Closed',
      description: 'This listing is no longer accepting applications.',
      icon: XCircle,
      className: 'bg-muted text-muted-foreground'
    };
  }

  if (approvalStatus === 'APPROVED') {
    return {
      label: 'Published',
      description: 'This job is live and visible to applicants.',
      icon: CheckCircle2,
      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    };
  }

  if (approvalStatus === 'REJECTED') {
    return {
      label: 'Rejected',
      description: 'This listing requires changes before publication.',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive'
    };
  }

  return {
    label: 'Pending Review',
    description: 'This listing is waiting for administrator approval.',
    icon: Clock3,
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  };
}

export default async function EmployerJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await getJobById(id);

  if (!result || !result.isOwner) {
    notFound();
  }

  const { job } = result;
  const company = job.company;

  const status = getStatus(job.status, job.approvalStatus);
  const StatusIcon = status.icon;

  const applicationCount = job._count?.applications ?? 0;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back navigation */}
      <Link
        href="/dashboard/employer/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Jobs
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Job identity */}
            <div className="flex min-w-0 gap-5">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted/50 shadow-sm sm:size-20">
                {company.companyLogoUrl ? (
                  <img
                    src={company.companyLogoUrl}
                    alt={`${company.companyName} logo`}
                    className="size-full object-cover"
                  />
                ) : (
                  <BriefcaseBusiness className="size-7 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">{company.companyName}</p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  {job.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                  <span className="font-medium">{formatLabel(job.employmentType)}</span>

                  <span>•</span>

                  <span>{formatLabel(job.workMode)}</span>

                  {job.location && (
                    <>
                      <span>•</span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        {job.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={`w-full rounded-2xl px-4 py-3 sm:w-auto sm:min-w-48 ${status.className}`}>
              <div className="flex items-center gap-2">
                <StatusIcon className="size-4" />

                <span className="text-sm font-semibold">{status.label}</span>
              </div>

              <p className="mt-1 text-xs opacity-80">{status.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
            <Link
              href={`/dashboard/employer/jobs/${job.id}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              <Pencil className="size-4" />
              Edit Job
            </Link>

            <Link
              href={`/dashboard/employer/jobs/${job.id}/applications`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted">
              <Users className="size-4" />
              Applications
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{applicationCount}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section>
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">At a glance</p>
        </div>

        <div className="grid overflow-hidden rounded-2xl border bg-card shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={Users} label="Applications" value={String(applicationCount)} />

          <Metric icon={BriefcaseBusiness} label="Employment" value={formatLabel(job.employmentType)} />

          <Metric icon={CalendarDays} label="Created" value={formatDate(job.createdAt)} />

          <Metric icon={Clock3} label="Expires" value={formatDate(job.expiresAt)} />
        </div>
      </section>

      {/* Main workspace */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Primary content */}
        <div className="space-y-6">
          <ContentSection title="Job description">
            <div className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {job.description}
            </div>
          </ContentSection>

          <ContentSection title="Requirements">
            <div className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {job.requirements}
            </div>
          </ContentSection>

          {job.skills?.length > 0 && (
            <ContentSection title="Skills & expertise">
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="rounded-lg border bg-muted/40 px-3 py-1.5 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </ContentSection>
          )}
        </div>

        {/* Employer sidebar */}
        <aside className="space-y-6">
          {/* Compensation */}
          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <p className="text-sm font-semibold">Compensation</p>
            </div>

            <div className="p-5">
              <p className="text-2xl font-bold tracking-tight">
                {formatSalary(
                  job.salaryMin?.toString() ?? null,
                  job.salaryMax?.toString() ?? null,
                  job.salaryCurrency
                )}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">Compensation range for this position.</p>
            </div>
          </section>

          {/* Listing lifecycle */}
          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <p className="text-sm font-semibold">Listing lifecycle</p>
            </div>

            <div className="p-5">
              <TimelineItem label="Created" value={formatDate(job.createdAt)} active />

              <TimelineItem
                label="Published"
                value={formatDate(job.publishedAt)}
                active={Boolean(job.publishedAt)}
              />

              <TimelineItem label="Expires" value={formatDate(job.expiresAt)} active last />
            </div>
          </section>

          {/* Management */}
          <section className="rounded-2xl border bg-muted/30 p-5">
            <p className="text-sm font-semibold">Manage this listing</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Update the job details or review applications from your employer workspace.
            </p>

            <div className="mt-4 grid gap-2">
              <Link
                href={`/dashboard/employer/jobs/${job.id}/edit`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border bg-background text-xs font-medium transition-colors hover:bg-muted">
                <Pencil className="size-3.5" />
                Edit Job
              </Link>

              <Link
                href={`/dashboard/employer/jobs/${job.id}/applications`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <Users className="size-3.5" />
                View Applications
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 border-b p-5 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="size-4.5 text-primary" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-1 truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4 sm:px-7">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      </div>

      <div className="px-6 py-6 sm:px-7 sm:py-7">{children}</div>
    </section>
  );
}

function TimelineItem({
  label,
  value,
  active,
  last = false
}: {
  label: string;
  value: string;
  active: boolean;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-3">
      {!last && <div className="absolute left-[7px] top-4 h-full w-px bg-border" />}

      <div
        className={`relative mt-1 size-4 shrink-0 rounded-full border-2 ${
          active ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-background'
        }`}
      />

      <div className="pb-5">
        <p className="text-xs font-medium">{label}</p>

        <p className="mt-0.5 text-xs text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
