'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BriefcaseBusiness, MapPin, WalletCards } from 'lucide-react';

import { getJobSeekerJobs } from '@/server/actions/dashboard/jobseeker/getJobSeekerJobs';

import type { JobSeekerJobsData } from '@/server/actions/dashboard/jobseeker/getJobSeekerJobs';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

function formatSalary(minimum: string | null, maximum: string | null, currency: string | null) {
  if (!minimum && !maximum) {
    return null;
  }

  const symbol = currency === 'NGN' ? '₦' : (currency ?? '');

  if (minimum && maximum) {
    return `${symbol}${Number(minimum).toLocaleString()} – ${symbol}${Number(maximum).toLocaleString()}`;
  }

  return `${symbol}${Number(minimum ?? maximum).toLocaleString()}`;
}

export default function JobsTab() {
  const [savedJobs, setSavedJobs] = useState<JobSeekerJobsData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      try {
        const data = await getJobSeekerJobs();

        if (mounted) {
          setSavedJobs(data);
        }
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Unable to load saved jobs.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <TabLoading />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Saved opportunities</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight">Jobs</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Keep the opportunities you want to revisit close at hand.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-14 text-center">
          <Bookmark className="mx-auto size-8 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">No saved jobs</h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Jobs you save while browsing opportunities will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {savedJobs.map(savedJob => {
            const job = savedJob.job;

            const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

            return (
              <article
                key={savedJob.id}
                className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                    {job.company.companyLogoUrl ? (
                      <img src={job.company.companyLogoUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <BriefcaseBusiness className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{job.title}</h3>

                    <p className="mt-1 text-sm text-muted-foreground">{job.company.companyName}</p>
                  </div>

                  <Bookmark className="size-4 shrink-0 fill-current text-primary" />
                </div>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {job.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </span>
                  )}

                  <span>{formatLabel(job.workMode)}</span>

                  <span>{formatLabel(job.employmentType)}</span>
                </div>

                {salary && (
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                    <WalletCards className="size-4 text-primary" />
                    {salary}
                  </div>
                )}

                {job.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 6).map(skill => (
                      <span key={skill} className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(savedJob.createdAt).toLocaleDateString('en-NG')}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TabLoading() {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-2xl border bg-muted/20">
      <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}

function TabError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
      <p className="text-sm font-medium text-destructive">Unable to load jobs.</p>

      <p className="mt-1 text-sm text-destructive/80">{message}</p>
    </div>
  );
}
