import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  Users,
  XCircle
} from 'lucide-react';

import { getEmployerApplications } from '@/server/actions/dashboard/employer/applications/getEmployerApplications';

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

function getStatusClass(status: string) {
  switch (status) {
    case 'HIRED':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    case 'SHORTLISTED':
    case 'INTERVIEW':
      return 'bg-primary/10 text-primary';

    case 'REVIEWING':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';

    default:
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'HIRED':
      return CheckCircle2;

    case 'REJECTED':
      return XCircle;

    case 'INTERVIEW':
      return FileText;

    case 'SHORTLISTED':
      return CheckCircle2;

    default:
      return Clock3;
  }
}

export default async function EmployerApplicationsPage() {
  const { company, applications } = await getEmployerApplications();

  const total = applications.length;

  const pending = applications.filter(application => application.status === 'PENDING').length;

  const shortlisted = applications.filter(
    application => application.status === 'SHORTLISTED' || application.status === 'INTERVIEW'
  ).length;

  const hired = applications.filter(application => application.status === 'HIRED').length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-primary">Employer Dashboard</p>

        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Applications</h1>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Review candidates, evaluate applications, and manage your hiring pipeline for{' '}
              {company.companyName}.
            </p>
          </div>

          <Link
            href="/dashboard/employer/jobs"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted">
            <BriefcaseBusiness className="size-4" />
            Manage Jobs
          </Link>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Applications" value={total} icon={Users} />

        <SummaryCard label="Awaiting Review" value={pending} icon={Clock3} />

        <SummaryCard label="Shortlisted" value={shortlisted} icon={CheckCircle2} />

        <SummaryCard label="Hired" value={hired} icon={CheckCircle2} />
      </section>

      {/* Applications */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold">Candidate Applications</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review submitted applications and candidate profiles.
            </p>
          </div>

          <div className="inline-flex h-9 items-center gap-2 rounded-md border bg-muted/30 px-3 text-xs text-muted-foreground">
            <Search className="size-3.5" />
            {total} {total === 1 ? 'application' : 'applications'}
          </div>
        </div>

        {applications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y">
            {applications.map(application => {
              const candidateName = application.applicant.name?.trim() || 'Candidate';

              const profileImage =
                application.jobSeekerProfile.profilePhotoUrl ?? application.applicant.image;

              const StatusIcon = getStatusIcon(application.status);

              return (
                <Link
                  key={application.id}
                  href={`/dashboard/employer/applications/${application.id}`}
                  className="group block p-5 transition-colors hover:bg-muted/30 sm:p-6">
                  <div className="flex gap-4">
                    {/* Candidate */}
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                      {profileImage ? (
                        <img src={profileImage} alt={candidateName} className="size-full object-cover" />
                      ) : (
                        <Users className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">{candidateName}</h3>

                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {application.jobSeekerProfile.headline}
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

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{application.job.title}</span>

                        {application.jobSeekerProfile.currentRole && (
                          <span>{application.jobSeekerProfile.currentRole}</span>
                        )}

                        {application.jobSeekerProfile.location && (
                          <span>{application.jobSeekerProfile.location}</span>
                        )}

                        {application.jobSeekerProfile.yearsOfExperience != null && (
                          <span>
                            {application.jobSeekerProfile.yearsOfExperience}{' '}
                            {application.jobSeekerProfile.yearsOfExperience === 1 ? 'year' : 'years'}{' '}
                            experience
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-2 border-t pt-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <span>Applied {formatDate(application.appliedAt)}</span>

                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          Review application
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Users className="size-6 text-muted-foreground" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">No applications yet</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Applications from candidates will appear here once someone applies to one of your published jobs.
      </p>

      <Link
        href="/dashboard/employer/jobs"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        View My Jobs
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
