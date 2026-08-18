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
  UserRound
} from 'lucide-react';

import { getEmployerApplicationById } from '@/server/actions/dashboard/employer/applications/getEmployerApplicationById';

import { GithubIcon, LinkedInIcon, XIcon } from '@/components/icons/SocialIcons';
import ApplicationStatusActions from '../../employer/ApplicationStatusActions';

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
    case 'SHORTLISTED':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';

    case 'INTERVIEW':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';

    case 'HIRED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    case 'REVIEWING':
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default async function EmployerApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let application;

  try {
    application = await getEmployerApplicationById(id);
  } catch {
    notFound();
  }

  if (!application) {
    notFound();
  }

  const profile = application.jobSeekerProfile;

  const photo = profile.profilePhotoUrl ?? application.applicant.image;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-6 lg:p-8">
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Applications
      </Link>

      {/* Candidate Header */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-5">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
              {photo ? (
                <img src={photo} alt={application.applicant.name} className="size-full object-cover" />
              ) : (
                <UserRound className="size-8 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">Candidate Application</p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {application.applicant.name}
              </h1>

              <p className="mt-2 text-muted-foreground">{profile.headline}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {application.applicant.email}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {profile.location}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  Applied {formatDate(application.appliedAt)}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
              application.status
            )}`}>
            {formatLabel(application.status)}
          </span>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Professional Information */}
          <section className="rounded-xl border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Professional Information</h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Info
                label="Current Role"
                value={profile.currentRole ?? 'Not specified'}
                icon={<BriefcaseBusiness className="size-4" />}
              />

              <Info
                label="Experience"
                value={
                  profile.yearsOfExperience !== null
                    ? `${profile.yearsOfExperience} year${profile.yearsOfExperience === 1 ? '' : 's'}`
                    : 'Not specified'
                }
              />

              <Info label="Location" value={profile.location} icon={<MapPin className="size-4" />} />

              <Info
                label="Applied"
                value={formatDate(application.appliedAt)}
                icon={<CalendarDays className="size-4" />}
              />
            </div>

            <div className="mt-8 border-t pt-6">
              <p className="text-sm font-medium">Professional Bio</p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {profile.bio}
              </p>
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-xl border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Skills</h2>

            {profile.skills.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No skills provided.</p>
            ) : (
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Cover Letter */}
          <section className="rounded-xl border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Cover Letter</h2>

            {application.coverLetter ? (
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {application.coverLetter}
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No cover letter was provided.</p>
            )}
          </section>

          {/* CV */}
          <section className="rounded-xl border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">CV / Resume</h2>

            {application.cvUrl ? (
              <a
                href={application.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/40">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">{application.cvName ?? 'Candidate CV'}</p>

                  <p className="mt-1 text-xs text-muted-foreground">Open CV</p>
                </div>

                <Download className="ml-auto size-4 text-muted-foreground" />
              </a>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No CV was attached to this application.</p>
            )}
          </section>

          {/* Social / Portfolio */}
          <section className="rounded-xl border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Portfolio & Social Profiles</h2>

            <div className="mt-5 flex flex-wrap gap-3">
              <SocialLink label="Portfolio" value={profile.portfolio} icon={<Globe className="size-4" />} />

              <SocialLink
                label="LinkedIn"
                value={profile.linkedin}
                icon={<LinkedInIcon className="size-4" />}
              />

              <SocialLink label="GitHub" value={profile.github} icon={<GithubIcon className="size-4" />} />

              <SocialLink label="X" value={profile.x} icon={<XIcon className="size-4" />} />
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Job */}
          <section className="rounded-xl border bg-card p-6">
            <p className="text-xs font-medium text-muted-foreground">Applied For</p>

            <h2 className="mt-2 text-lg font-semibold">{application.job.title}</h2>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="size-4" />
                {formatLabel(application.job.employmentType)}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                {application.job.location ?? formatLabel(application.job.workMode)}
              </div>
            </div>

            <Link
              href={`/dashboard/jobs/${application.job.id}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              View Job
              <ExternalLink className="size-3.5" />
            </Link>
          </section>

          {/* Decision */}
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Application Decision</h2>

            <p className="mt-2 text-sm text-muted-foreground">Update the candidate's application status.</p>

            <div className="mt-5">
              <ApplicationStatusActions applicationId={application.id} currentStatus={application.status} />
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
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

function SocialLink({ label, value, icon }: { label: string; value?: string | null; icon: React.ReactNode }) {
  if (!value) return null;

  const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
      {icon}
      {label}
      <ExternalLink className="size-3.5 text-muted-foreground" />
    </a>
  );
}
