import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  UserRound,
  Video
} from 'lucide-react';

import { getEmployerApplicationById } from '@/server/actions/dashboard/employer/applications/getEmployerApplicationById';
import ApplicationStatusActions from '@/app/(dashboard)/dashboard/employer/ApplicationStatusActions';

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
  }).format(date);
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

    default:
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  }
}

export default async function EmployerApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let application;

  try {
    application = await getEmployerApplicationById(id);
  } catch {
    notFound();
  }

  const candidateName = application.applicant.name?.trim() || 'Candidate';

  const profileImage = application.jobSeekerProfile.profilePhotoUrl ?? application.applicant.image;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back */}
      <Link
        href="/dashboard/employer/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Applications
      </Link>

      {/* Candidate header */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                {profileImage ? (
                  <img src={profileImage} alt={candidateName} className="size-full object-cover" />
                ) : (
                  <UserRound className="size-7 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-primary">Candidate Application</p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{candidateName}</h1>

                <p className="mt-1 text-sm text-muted-foreground">{application.jobSeekerProfile.headline}</p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  {application.jobSeekerProfile.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {application.jobSeekerProfile.location}
                    </span>
                  )}

                  {application.jobSeekerProfile.currentRole && (
                    <span>{application.jobSeekerProfile.currentRole}</span>
                  )}

                  {application.jobSeekerProfile.yearsOfExperience !== null && (
                    <span>
                      {application.jobSeekerProfile.yearsOfExperience}{' '}
                      {application.jobSeekerProfile.yearsOfExperience === 1 ? 'year' : 'years'} experience
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    Applied {formatDate(application.appliedAt)}
                  </span>
                </div>
              </div>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
                application.status
              )}`}>
              {formatLabel(application.status)}
            </span>
          </div>
        </div>

        {/* Job context */}
        <div className="grid border-t sm:grid-cols-3">
          <div className="flex items-center gap-2 px-6 py-4 text-xs text-muted-foreground sm:px-8">
            <BriefcaseBusiness className="size-3.5" />
            {application.job.title}
          </div>

          <div className="flex items-center gap-2 border-t px-6 py-4 text-xs text-muted-foreground sm:border-l sm:border-t-0 sm:px-8">
            <MapPin className="size-3.5" />
            {application.job.location ?? 'Location not specified'}
          </div>

          <div className="flex items-center gap-2 border-t px-6 py-4 text-xs text-muted-foreground sm:border-l sm:border-t-0 sm:px-8">
            <FileText className="size-3.5" />
            {formatLabel(application.job.employmentType)}
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Cover letter */}
          <section className="rounded-2xl border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />

              <h2 className="text-lg font-semibold">Cover Letter</h2>
            </div>

            {application.coverLetter ? (
              <div className="mt-5 whitespace-pre-wrap rounded-xl bg-muted/30 p-5 text-sm leading-7 text-muted-foreground">
                {application.coverLetter}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
                No cover letter was submitted with this application.
              </div>
            )}
          </section>

          {/* Candidate profile */}
          <section className="rounded-2xl border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Candidate Profile</h2>

            {application.jobSeekerProfile.bio && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {application.jobSeekerProfile.bio}
              </p>
            )}

            {application.jobSeekerProfile.skills.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium">Skills</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {application.jobSeekerProfile.skills.map(skill => (
                    <span
                      key={skill}
                      className="rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {application.jobSeekerProfile.linkedin && (
                <ExternalProfileLink href={application.jobSeekerProfile.linkedin} label="LinkedIn" />
              )}

              {application.jobSeekerProfile.github && (
                <ExternalProfileLink href={application.jobSeekerProfile.github} label="GitHub" />
              )}

              {application.jobSeekerProfile.x && (
                <ExternalProfileLink href={application.jobSeekerProfile.x} label="X" />
              )}

              {application.jobSeekerProfile.portfolio && (
                <ExternalProfileLink href={application.jobSeekerProfile.portfolio} label="Portfolio" />
              )}
            </div>
          </section>
        </div>

        {/* Hiring sidebar */}
        <aside className="space-y-6">
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="font-semibold">Application Status</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Move this candidate through your hiring process.
            </p>

            <div className="mt-5">
              <ApplicationStatusActions applicationId={application.id} currentStatus={application.status} />
            </div>
          </section>

          {/* CV */}
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="font-semibold">Candidate CV</h2>

            {application.cvUrl ? (
              <div className="mt-4 rounded-xl border bg-muted/30 p-4">
                <p className="truncate text-sm font-medium">{application.cvName ?? 'Candidate CV'}</p>

                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Download className="size-4" />
                  Open CV
                </a>
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                No CV was attached to this application.
              </p>
            )}
          </section>

          {/* Contact */}
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="font-semibold">Contact Candidate</h2>

            <a
              href={`mailto:${application.applicant.email}`}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium hover:bg-muted">
              <Mail className="size-4" />
              {application.applicant.email}
            </a>
          </section>

          {/* Interview */}
          <section className="rounded-2xl border bg-card p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Video className="size-4 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">Interview</h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Schedule an interview with this candidate.
                </p>
              </div>
            </div>

            <Link
              href={`/dashboard/employer/applications/${application.id}/interview/create`}
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Video className="size-4" />
              Schedule Interview
            </Link>
          </section>
        </aside>
      </section>
    </main>
  );
}

function ExternalProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-xs font-medium hover:bg-muted">
      <Globe className="size-3.5" />
      {label}
      <ExternalLink className="size-3" />
    </a>
  );
}
