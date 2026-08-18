import Link from 'next/link';
import { BriefcaseBusiness, MapPin, UserRound } from 'lucide-react';

import { getEmployers } from '@/server/actions/admin/getEmployers';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getStatusClass(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    case 'PENDING':
    default:
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
  }
}

export default async function AdminEmployersPage() {
  const employers = await getEmployers();

  const pending = employers.filter(employer => employer.onboardingStatus === 'PENDING');

  const approved = employers.filter(employer => employer.onboardingStatus === 'APPROVED');

  const rejected = employers.filter(employer => employer.onboardingStatus === 'REJECTED');

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8">
      <section>
        <p className="text-sm font-medium text-primary">Administration</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">Employers</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review and manage companies registered on JobMan.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Pending" value={pending.length} />

        <SummaryCard label="Approved" value={approved.length} />

        <SummaryCard label="Rejected" value={rejected.length} />
      </section>

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Employer Accounts</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {pending.length} employer
            {pending.length === 1 ? '' : 's'} currently awaiting review.
          </p>
        </div>

        {employers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <UserRound className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">No employers found</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Employer accounts will appear here when companies register.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {employers.map(employer => (
              <article key={employer.id} className="p-5 transition-colors hover:bg-muted/30 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                      {employer.companyLogoUrl ? (
                        <img
                          src={employer.companyLogoUrl}
                          alt={employer.companyName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <BriefcaseBusiness className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{employer.companyName}</h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                            employer.onboardingStatus
                          )}`}>
                          {formatLabel(employer.onboardingStatus)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">{employer.companyIndustry}</p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {employer.companyLocation}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <UserRound className="size-3.5" />
                          {employer.user.name}
                        </span>

                        <span>
                          {employer._count.jobs} job
                          {employer._count.jobs === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/admin/employers/${employer.id}`}
                    className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted">
                    Review Employer
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
