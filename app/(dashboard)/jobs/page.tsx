import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CalendarDays, MapPin, Search } from 'lucide-react';

import { getPublishedJobs } from '@/server/actions/jobs/getPublishedJobs';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(date: Date | null) {
  if (!date) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

export default async function JobsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; location?: string }>;
}) {
  const { q, location } = await searchParams;
  const jobs = await getPublishedJobs({ query: q, location });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-primary">JobMan Opportunities</p>

        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Find Your Next Opportunity</h1>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {q || location
              ? `Showing opportunities matching ${[q, location].filter(Boolean).join(' in ')}.`
              : 'Explore published jobs from companies looking for talented professionals.'}
            </p>
          </div>

          <div className="inline-flex h-10 items-center gap-2 rounded-md border bg-card px-4 text-sm text-muted-foreground">
            <Search className="size-4" />
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section>
        {jobs.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border bg-card px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <BriefcaseBusiness className="size-6 text-muted-foreground" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">No jobs available</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              There are currently no published opportunities. Check back later for new openings.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <article
                key={job.id}
                className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/30 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Company */}
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                      {job.company.companyLogoUrl ? (
                        <img
                          src={job.company.companyLogoUrl}
                          alt={job.company.companyName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <BriefcaseBusiness className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-semibold sm:text-lg">{job.title}</h2>

                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {job.company.companyName}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {job.location ?? 'Location not specified'}
                        </span>

                        <span>{formatLabel(job.workMode)}</span>

                        <span>{formatLabel(job.employmentType)}</span>

                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          {formatDate(job.publishedAt)}
                        </span>
                      </div>

                      {job.company.companyIndustry && (
                        <p className="mt-3 text-xs text-muted-foreground">{job.company.companyIndustry}</p>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex shrink-0 items-center sm:items-start">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto">
                      View Job
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
