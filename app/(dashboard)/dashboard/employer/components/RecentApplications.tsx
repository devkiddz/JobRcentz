import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, UserRound } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

type Application = EmployerDashboardData['recentApplications'][number];

interface RecentApplicationsProps {
  applications: Application[];
}

function formatStatus(status: Application['status']) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getStatusClass(status: Application['status']) {
  switch (status) {
    case 'HIRED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    case 'INTERVIEW':
    case 'SHORTLISTED':
      return 'bg-primary/10 text-primary';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(date));
}

export default function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-semibold">Recent Applications</h2>

          <p className="mt-1 text-sm text-muted-foreground">Candidates who recently applied.</p>
        </div>

        <Link
          href="/dashboard/employer/applications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <UserRound className="size-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 font-semibold">No applications yet</h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Applications from candidates will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {applications.map(application => {
            const candidateName = application.applicant.name?.trim() || 'Candidate';

            const profileImage = application.jobSeekerProfile.profilePhotoUrl ?? application.applicant.image;

            return (
              <Link
                key={application.id}
                href={`/dashboard/employer/applications/${application.id}`}
                className="flex items-center gap-4 p-5 transition-colors hover:bg-muted/30 sm:px-6">
                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                  {profileImage ? (
                    <img src={profileImage} alt={candidateName} className="size-full object-cover" />
                  ) : (
                    <UserRound className="size-5 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="truncate text-sm font-semibold">{candidateName}</p>

                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                        application.status
                      )}`}>
                      {formatStatus(application.status)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-muted-foreground">{application.job.title}</p>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {application.jobSeekerProfile.currentRole && (
                      <span>{application.jobSeekerProfile.currentRole}</span>
                    )}

                    {application.jobSeekerProfile.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" />
                        {application.jobSeekerProfile.location}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3" />
                      {formatDate(application.appliedAt)}
                    </span>
                  </div>
                </div>

                <ArrowRight className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
