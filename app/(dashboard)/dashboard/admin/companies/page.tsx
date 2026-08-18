import Link from 'next/link';
import { ArrowRight, Building2, Clock3, MapPin } from 'lucide-react';

import { getPendingCompanies } from '@/server/actions/admin/companies/getPendingCompanies';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

export default async function AdminCompaniesPage() {
  const companies = await getPendingCompanies();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section>
        <p className="text-sm font-medium text-primary">Administration</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Company Reviews</h1>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Review employer company profiles before they can publish job opportunities.
        </p>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="border-b px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Pending Companies</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {companies.length} {companies.length === 1 ? 'company' : 'companies'} awaiting review
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock3 className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Building2 className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">No pending companies</h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              All employer company profiles have been reviewed.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {companies.map(company => (
              <article key={company.id} className="p-5 transition-colors hover:bg-muted/30 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                      {company.companyLogoUrl ? (
                        <img
                          src={company.companyLogoUrl}
                          alt={company.companyName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Building2 className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold">{company.companyName}</h3>

                      <p className="mt-0.5 text-sm text-muted-foreground">{company.companyIndustry}</p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {company.companyLocation}
                        </span>

                        <span>Submitted {formatDate(company.createdAt)}</span>

                        <span>{company.user.name}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/admin/companies/${company.id}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Review
                    <ArrowRight className="size-4" />
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
