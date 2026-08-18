import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, ExternalLink, Globe, MapPin, Users } from 'lucide-react';

import { getJobById } from '@/server/actions/jobs/getJobById';

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
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

function formatSalary(min: unknown, max: unknown, currency: string | null) {
  if (min == null && max == null) {
    return 'Salary not specified';
  }

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency ?? 'NGN',
    maximumFractionDigits: 0
  });

  if (min != null && max != null) {
    return `${formatter.format(Number(min))} – ${formatter.format(Number(max))}`;
  }

  if (min != null) {
    return `From ${formatter.format(Number(min))}`;
  }

  return `Up to ${formatter.format(Number(max))}`;
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await getJobById(id);

  if (!result) {
    notFound();
  }

  const { job, isOwner, existingApplication, isSaved } = result;

  const { company } = job;
  const canApply = job.status === 'PUBLISHED' && !isOwner && !existingApplication;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back */}
      <Link
        href={isOwner ? '/dashboard/jobs' : '/jobs'}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        {isOwner ? 'Back to My Jobs' : 'Back to Jobs'}
      </Link>

      {/* Hero */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {company.companyLogoUrl ? (
                <img
                  src={company.companyLogoUrl}
                  alt={company.companyName}
                  className="size-full object-cover"
                />
              ) : (
                <BriefcaseBusiness className="size-7 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{job.title}</h1>

                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {formatLabel(job.status)}
                </span>
              </div>

              <p className="mt-2 text-base font-medium">{company.companyName}</p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {job.location ?? 'Location not specified'}
                </span>

                <span>{formatLabel(job.workMode)}</span>

                <span>{formatLabel(job.employmentType)}</span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  Posted {formatDate(job.publishedAt ?? job.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            {canApply && (
              <Link
                href={`/jobs/${job.id}/apply`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
                Apply Now
              </Link>
            )}

            {existingApplication && (
              <div className="rounded-md bg-muted px-4 py-2.5 text-center text-sm font-medium">
                Application: {formatLabel(existingApplication.status)}
              </div>
            )}

            {isOwner && (
              <Link
                href={`/dashboard/jobs/${job.id}/applications`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted">
                <Users className="size-4" />
                Applications ({job._count.applications})
              </Link>
            )}

            {!isOwner && job.status === 'CLOSED' && (
              <div className="rounded-md bg-muted px-4 py-2.5 text-center text-sm font-medium text-muted-foreground">
                This position is closed
              </div>
            )}

            {!isOwner && job.status === 'DRAFT' && (
              <div className="rounded-md bg-muted px-4 py-2.5 text-center text-sm font-medium text-muted-foreground">
                This position is not published
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Job content */}
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">About the Role</h2>

            <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {job.description}
            </div>
          </section>

          {job.requirements && (
            <section className="rounded-xl border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold">Requirements</h2>

              <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {job.requirements}
              </div>
            </section>
          )}

          {job.skills.length > 0 && (
            <section className="rounded-xl border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold">Skills & Technologies</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span
                    key={skill}
                    className="rounded-full border bg-muted/40 px-3 py-1.5 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Job Information</h2>

            <div className="mt-5 space-y-4">
              <InfoRow label="Employment" value={formatLabel(job.employmentType)} />

              <InfoRow label="Work Mode" value={formatLabel(job.workMode)} />

              <InfoRow label="Location" value={job.location ?? 'Not specified'} />

              <InfoRow
                label="Salary"
                value={formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              />

              <InfoRow label="Applications" value={String(job._count.applications)} />

              <InfoRow label="Posted" value={formatDate(job.publishedAt ?? job.createdAt)} />

              {job.expiresAt && <InfoRow label="Expires" value={formatDate(job.expiresAt)} />}
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">About {company.companyName}</h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">{company.companyDescription}</p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{company.companyLocation}</span>
              </div>

              {company.companyWebsite && (
                <a
                  href={company.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline">
                  <Globe className="size-4" />
                  Company Website
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}
