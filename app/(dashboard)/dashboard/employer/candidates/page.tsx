import Link from 'next/link';
import { Search, UserRound } from 'lucide-react';

import { getEmployerCandidates } from '@/server/actions/dashboard/employer/candidates/getEmployerCandidates';

export default async function EmployerCandidatesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const search = params.q ?? '';
  const data = await getEmployerCandidates(search);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Candidates</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Candidates who have interacted with your company through applications.
          </p>
        </div>

        <form className="flex w-full max-w-md items-center gap-2" method="get">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              defaultValue={search}
              placeholder="Search candidates..."
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted">
            Search
          </button>
        </form>
      </div>

      {data.candidates.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <UserRound className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-4 font-medium">No candidates found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Candidates will appear here as people apply to your jobs.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.candidates.map((candidate) => (
            <Link
              key={candidate.id}
              href={`/dashboard/employer/candidates/${candidate.id}`}
              className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                  {candidate.profile.profilePhotoUrl || candidate.image ? (
                    <img
                      src={candidate.profile.profilePhotoUrl ?? candidate.image ?? ''}
                      alt={candidate.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-5 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold group-hover:text-primary">
                    {candidate.name}
                  </h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {candidate.profile.currentRole ??
                      candidate.profile.headline}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {candidate.profile.location}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                <span>
                  {candidate.profile.yearsOfExperience
                    ? `${candidate.profile.yearsOfExperience} yrs experience`
                    : 'Experience not listed'}
                </span>
                <span>
                  {candidate.applications.length}{' '}
                  {candidate.applications.length === 1
                    ? 'application'
                    : 'applications'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
