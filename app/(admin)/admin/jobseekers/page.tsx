import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, MapPin, Users } from 'lucide-react';
import { getJobSeekers } from '@/server/actions/admin/jobseekers/getJobSeekers';

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
    case 'APPROVED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
  }
}

export default async function AdminJobSeekersPage() {
  const jobSeekers = await getJobSeekers();

  const pendingCount = jobSeekers.filter(jobSeeker => jobSeeker.onboardingStatus === 'PENDING').length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <section>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Users className="size-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Job Seekers</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Review and manage registered JobMan candidates.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Job Seekers" value={jobSeekers.length} />

          <StatCard label="Pending Review" value={pendingCount} />

          <StatCard
            label="Approved"
            value={jobSeekers.filter(jobSeeker => jobSeeker.onboardingStatus === 'APPROVED').length}
          />
        </div>
      </section>

      {/* List */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-semibold">Registered Job Seekers</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a candidate to review their profile and onboarding status.
          </p>
        </div>

        {jobSeekers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto size-10 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">No Job Seekers yet</h3>

            <p className="mt-1 text-sm text-muted-foreground">Registered candidates will appear here.</p>
          </div>
        ) : (
          <div className="divide-y">
            {jobSeekers.map(jobSeeker => (
              <div
                key={jobSeeker.id}
                className="flex flex-col gap-5 p-6 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                {/* Candidate */}
                <div className="flex min-w-0 gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                    {jobSeeker.profilePhotoUrl ? (
                      <img
                        src={jobSeeker.profilePhotoUrl}
                        alt={jobSeeker.user.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground">
                        {jobSeeker.user.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{jobSeeker.user.name}</h3>

                    <p className="truncate text-sm text-muted-foreground">{jobSeeker.headline}</p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {jobSeeker.location}
                      </span>

                      {jobSeeker.currentRole && (
                        <span className="inline-flex items-center gap-1">
                          <BriefcaseBusiness className="size-3.5" />
                          {jobSeeker.currentRole}
                        </span>
                      )}

                      <span>Joined {formatDate(jobSeeker.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Status + action */}
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
                      jobSeeker.onboardingStatus
                    )}`}>
                    {formatLabel(jobSeeker.onboardingStatus)}
                  </span>

                  <Link
                    href={`/admin/jobseekers/${jobSeeker.id}`}
                    className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted">
                    Review
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
