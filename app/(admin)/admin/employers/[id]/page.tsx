import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, Globe, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { getEmployerById } from '@/components/dashboard/admin/getEmployerById';
import EmployerDecisionActions from '@/components/dashboard/admin/EmployerDecisionActions';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

function getStatusClass(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
  }
}

export default async function AdminEmployerReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const employer = await getEmployerById(id);

  if (!employer) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-6 lg:p-8">
      <Link
        href="/admin/employers"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Employers
      </Link>

      {/* Header */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {employer.companyLogoUrl ? (
                <img
                  src={employer.companyLogoUrl}
                  alt={employer.companyName}
                  className="size-full object-cover"
                />
              ) : (
                <BriefcaseBusiness className="size-7 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">Employer Review</p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{employer.companyName}</h1>

              <p className="mt-2 text-sm text-muted-foreground">{employer.companyIndustry}</p>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
              employer.onboardingStatus
            )}`}>
            {formatLabel(employer.onboardingStatus)}
          </span>
        </div>
      </section>

      {/* Company */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Company Information</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Info label="Company Name" value={employer.companyName} />

          <Info label="Industry" value={employer.companyIndustry} />

          <Info label="Company Size" value={employer.companySize ?? 'Not specified'} />

          <Info label="Location" value={employer.companyLocation} />

          <Info label="Address" value={employer.companyAddress ?? 'Not specified'} />

          <Info
            label="Contact Email"
            value={employer.companyContactEmail}
            icon={<Mail className="size-4" />}
          />

          <Info
            label="Contact Phone"
            value={employer.companyContactPhone ?? 'Not specified'}
            icon={<Phone className="size-4" />}
          />

          <Info
            label="Website"
            value={employer.companyWebsite ?? 'Not specified'}
            icon={<Globe className="size-4" />}
          />
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm font-medium">Company Description</p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {employer.companyDescription}
          </p>
        </div>
      </section>

      {/* Account */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Employer Account</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Info label="Name" value={employer.user.name} icon={<UserRound className="size-4" />} />

          <Info label="Email" value={employer.user.email} icon={<Mail className="size-4" />} />

          <Info label="Account Role" value={formatLabel(employer.user.role)} />

          <Info label="Account Created" value={formatDate(employer.user.createdAt)} />
        </div>
      </section>

      {/* Jobs */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-semibold">Company Jobs</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {employer.jobs.length} job
            {employer.jobs.length === 1 ? '' : 's'} associated with this company.
          </p>
        </div>

        {employer.jobs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No jobs have been created yet.</div>
        ) : (
          <div className="divide-y">
            {employer.jobs.map(job => (
              <div
                key={job.id}
                className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{job.title}</p>

                  <p className="mt-1 text-xs text-muted-foreground">Created {formatDate(job.createdAt)}</p>
                </div>

                <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                  {formatLabel(job.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="font-semibold">Administrative Decision</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Review the information above before changing the employer's onboarding status.
        </p>

        <div className="mt-6">
          <EmployerDecisionActions companyId={employer.id} status={employer.onboardingStatus} />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Approval actions will be enabled once the administrative mutation is connected.
        </p>
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
