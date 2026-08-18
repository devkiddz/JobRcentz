import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Users
} from 'lucide-react';
import type { ReactNode } from 'react';

import { getJobById } from '@/server/actions/admin/jobs/getJobById';
import JobDecisionActions from '@/components/dashboard/admin/JobDecisionActions';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(date: Date | null) {
  if (!date) return 'Not specified';

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

function formatSalary(amount: unknown, currency: string | null) {
  if (amount === null || amount === undefined) {
    return null;
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return null;
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency || 'NGN',
    maximumFractionDigits: 0
  }).format(numericAmount);
}

function getApprovalClass(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
  }
}

export default async function AdminJobReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  const minimumSalary = formatSalary(job.salaryMin, job.salaryCurrency);

  const maximumSalary = formatSalary(job.salaryMax, job.salaryCurrency);

  let salary = 'Not specified';

  if (minimumSalary && maximumSalary) {
    salary = `${minimumSalary} – ${maximumSalary}`;
  } else if (minimumSalary) {
    salary = `From ${minimumSalary}`;
  } else if (maximumSalary) {
    salary = `Up to ${maximumSalary}`;
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-6 lg:p-8">
      {/* Back */}
      <Link
        href="/admin/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Jobs
      </Link>

      {/* Header */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {job.company.companyLogoUrl ? (
                <img
                  src={job.company.companyLogoUrl}
                  alt={job.company.companyName}
                  className="size-full object-cover"
                />
              ) : (
                <BriefcaseBusiness className="size-7 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">Job Review</p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{job.title}</h1>

              <p className="mt-2 text-sm text-muted-foreground">{job.company.companyName}</p>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {job.location || 'Location not specified'}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusiness className="size-3.5" />
                  {formatLabel(job.employmentType)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  {job.applications.length} {job.applications.length === 1 ? 'application' : 'applications'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${getApprovalClass(
                job.approvalStatus
              )}`}>
              {formatLabel(job.approvalStatus)}
            </span>

            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
              {formatLabel(job.status)}
            </span>
          </div>
        </div>
      </section>

      {/* Job Information */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Job Information</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Employment Type"
            value={formatLabel(job.employmentType)}
            icon={<BriefcaseBusiness className="size-4" />}
          />

          <Info label="Work Mode" value={formatLabel(job.workMode)} />

          <Info
            label="Location"
            value={job.location || 'Not specified'}
            icon={<MapPin className="size-4" />}
          />

          <Info label="Salary" value={salary} />

          <Info
            label="Published"
            value={formatDate(job.publishedAt)}
            icon={<CalendarDays className="size-4" />}
          />

          <Info
            label="Expires"
            value={formatDate(job.expiresAt)}
            icon={<CalendarDays className="size-4" />}
          />
        </div>
      </section>

      {/* Description */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Job Description</h2>

        <div className="mt-6">
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="mt-8 border-t pt-6">
            <h3 className="font-medium">Requirements</h3>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {job.requirements}
            </p>
          </div>
        )}
      </section>

      {/* Skills */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Skills</h2>

        {job.skills.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No skills specified.</p>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2">
            {job.skills.map(skill => (
              <span key={skill} className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Employer */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Building2 className="size-5 text-primary" />

          <h2 className="text-lg font-semibold">Employer Information</h2>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Info label="Company" value={job.company.companyName} />

          <Info label="Industry" value={job.company.companyIndustry} />

          <Info label="Location" value={job.company.companyLocation} icon={<MapPin className="size-4" />} />

          <Info
            label="Contact Email"
            value={job.company.companyContactEmail}
            icon={<Mail className="size-4" />}
          />

          <Info label="Contact Phone" value={job.company.companyContactPhone || 'Not specified'} />

          <Info label="Employer Approval" value={formatLabel(job.company.onboardingStatus)} />
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm font-medium">Company Description</p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {job.company.companyDescription}
          </p>
        </div>

        {job.company.companyWebsite && (
          <a
            href={
              /^https?:\/\//i.test(job.company.companyWebsite)
                ? job.company.companyWebsite
                : `https://${job.company.companyWebsite}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <GlobeIcon />
            Visit company website
          </a>
        )}
      </section>

      {/* Posted By */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Posted By</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Info label="Name" value={job.postedBy.name} />

          <Info label="Email" value={job.postedBy.email} icon={<Mail className="size-4" />} />

          <Info label="Account Role" value={formatLabel(job.postedBy.role)} />

          <Info label="Account Created" value={formatDate(job.postedBy.createdAt)} />
        </div>
      </section>

      {/* Applications */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-semibold">Applications</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {job.applications.length} {job.applications.length === 1 ? 'application' : 'applications'}{' '}
            submitted for this job.
          </p>
        </div>

        {job.applications.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No applications have been submitted yet.
          </div>
        ) : (
          <div className="divide-y">
            {job.applications.map(application => (
              <div
                key={application.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Application</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted {formatDate(application.appliedAt)}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                  {formatLabel(application.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Decision */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="font-semibold">Administrative Decision</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Review the job and employer information before changing the job's approval status.
        </p>

        <div className="mt-6">
          <JobDecisionActions jobId={job.id} status={job.approvalStatus} />
        </div>
      </section>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <div className="mt-2 flex items-start gap-2 text-sm font-medium">
        {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}

        <span>{value}</span>
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}
