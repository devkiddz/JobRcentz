import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Users,
  XCircle
} from 'lucide-react';

import { getEmployerApplicationsByJobId } from '@/server/actions/dashboard/employer/applications/getEmployerApplicationsByJobId';

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

export default async function EmployerJobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await getEmployerApplicationsByJobId(id);

  if (!result) {
    notFound();
  }

  const { company, job } = result;
  const applications = job.applications;

  const total = applications.length;

  const pending = applications.filter(application => application.status === 'PENDING').length;

  const shortlisted = applications.filter(
    application => application.status === 'SHORTLISTED' || application.status === 'INTERVIEW'
  ).length;

  const hired = applications.filter(application => application.status === 'HIRED').length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href={`/dashboard/employer/jobs/${job.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Job
      </Link>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/50">
                {company.companyLogoUrl ? (
                  <img
                    src={company.companyLogoUrl}
                    alt={`${company.companyName} logo`}
                    className="size-full object-cover"
                  />
                ) : (
                  <BriefcaseBusiness className="size-6 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-primary">{company.companyName}</p>

                <h1 className="mt-1 truncate text-2xl font-bold tracking-tight sm:text-3xl">{job.title}</h1>

                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted-foreground">
                  <span>{formatLabel(job.employmentType)}</span>

                  <span>•</span>

                  <span>{formatLabel(job.workMode)}</span>

                  {job.location && (
                    <>
                      <span>•</span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {job.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Link
              href={`/dashboard/employer/jobs/${job.id}`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border bg-background px-3 text-xs font-medium hover:bg-muted">
              View Job
            </Link>
          </div>
        </div>

        <div className="grid border-t sm:grid-cols-4">
          <Metric icon={Users} label="Applications" value={total} />

          <Metric icon={Clock3} label="Awaiting Review" value={pending} />

          <Metric icon={CheckCircle2} label="Shortlisted" value={shortlisted} />

          <Metric icon={CheckCircle2} label="Hired" value={hired} />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="font-semibold">Applications for this job</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Review candidates who applied specifically to this position.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <Users className="size-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">No applications yet</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Applications submitted for this job will appear here.
            </p>
          </div>
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
                            {application.jobSeekerProfile.headline ||
                              application.jobSeekerProfile.currentRole ||
                              'Candidate'}
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

                      <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                        <span>Applied {formatDate(application.appliedAt)}</span>

                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          Review
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

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 border-b p-5 last:border-b-0 sm:border-r sm:last:border-r-0 sm:border-b-0">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
