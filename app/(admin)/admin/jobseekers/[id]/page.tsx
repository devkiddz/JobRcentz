import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  Globe,
  Mail,
  MapPin,
  UserRound,
  ExternalLink
} from 'lucide-react';
import type { ReactNode } from 'react';

import { getJobSeekerById } from '@/server/actions/admin/jobseekers/getJobSeekerById';
import JobSeekerDecisionActions from '@/components/dashboard/admin/JobSeekerDecisionActions';
import { GithubIcon, LinkedInIcon, XIcon } from '@/components/icons/SocialIcons';

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

export default async function AdminJobSeekerReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const jobSeeker = await getJobSeekerById(id);

  if (!jobSeeker) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-6 lg:p-8">
      {/* Back */}
      <Link
        href="/admin/jobseekers"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Job Seekers
      </Link>

      {/* Header */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
              {jobSeeker.profilePhotoUrl ? (
                <img
                  src={jobSeeker.profilePhotoUrl}
                  alt={jobSeeker.user.name}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-muted-foreground">
                  {jobSeeker.user.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">Job Seeker Review</p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{jobSeeker.user.name}</h1>

              <p className="mt-2 text-sm text-muted-foreground">{jobSeeker.headline}</p>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {jobSeeker.user.email}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {jobSeeker.location}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
              jobSeeker.onboardingStatus
            )}`}>
            {formatLabel(jobSeeker.onboardingStatus)}
          </span>
        </div>
      </section>

      {/* Professional Information */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Professional Information</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Info
            label="Current Role"
            value={jobSeeker.currentRole ?? 'Not specified'}
            icon={<BriefcaseBusiness className="size-4" />}
          />

          <Info
            label="Years of Experience"
            value={
              jobSeeker.yearsOfExperience !== null
                ? `${jobSeeker.yearsOfExperience} year${jobSeeker.yearsOfExperience === 1 ? '' : 's'}`
                : 'Not specified'
            }
          />

          <Info label="Location" value={jobSeeker.location} icon={<MapPin className="size-4" />} />

          <Info label="Profile Created" value={formatDate(jobSeeker.createdAt)} />
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm font-medium">Professional Bio</p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{jobSeeker.bio}</p>
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Skills</h2>

        {jobSeeker.skills.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No skills provided.</p>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2">
            {jobSeeker.skills.map(skill => (
              <span key={skill} className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Links & CV */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Portfolio & Documents</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ResourceLink label="Portfolio" value={jobSeeker.portfolio} icon={<Globe className="size-4" />} />

          <ResourceLink
            label="LinkedIn"
            value={jobSeeker.linkedin}
            icon={<LinkedInIcon className="size-4" />}
          />

          <ResourceLink label="GitHub" value={jobSeeker.github} icon={<GithubIcon className="size-4" />} />

          <ResourceLink label="X" value={jobSeeker.x} icon={<XIcon className="size-4" />} />

          <ResourceLink
            label={jobSeeker.cvName || 'CV'}
            value={jobSeeker.cvUrl}
            icon={<FileText className="size-4" />}
          />
        </div>
      </section>

      {/* Account */}
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Account Information</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Info label="Name" value={jobSeeker.user.name} icon={<UserRound className="size-4" />} />

          <Info label="Email" value={jobSeeker.user.email} icon={<Mail className="size-4" />} />

          <Info label="Account Role" value={formatLabel(jobSeeker.user.role)} />

          <Info label="Account Created" value={formatDate(jobSeeker.user.createdAt)} />
        </div>
      </section>

      {/* Applications */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-semibold">Applications</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {jobSeeker.applications.length} application
            {jobSeeker.applications.length === 1 ? '' : 's'} submitted.
          </p>
        </div>

        {jobSeeker.applications.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            This candidate has not submitted any applications yet.
          </div>
        ) : (
          <div className="divide-y">
            {jobSeeker.applications.map(application => (
              <div
                key={application.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{application.job.title}</p>

                  <p className="mt-1 text-sm text-muted-foreground">{application.job.company.companyName}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Applied {formatDate(application.appliedAt)}
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
          Review the candidate&apos;s information before changing their onboarding status.
        </p>

        <div className="mt-6">
          <JobSeekerDecisionActions jobSeekerId={jobSeeker.id} status={jobSeeker.onboardingStatus} />
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

function ResourceLink({ label, value, icon }: { label: string; value?: string | null; icon: ReactNode }) {
  function getUrl(value: string) {
    const trimmed = value.trim();

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }

  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      {value ? (
        <a
          href={getUrl(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex max-w-full items-center gap-2 text-sm font-medium text-primary hover:underline">
          {icon}

          <span className="truncate">{value}</span>

          <ExternalLink className="size-3.5 shrink-0" />
        </a>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Not provided</p>
      )}
    </div>
  );
}
