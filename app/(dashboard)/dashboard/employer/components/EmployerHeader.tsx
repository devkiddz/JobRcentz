import { Building2, Globe, MapPin } from 'lucide-react';
import Image from 'next/image';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

type EmployerHeaderProps = {
  company: EmployerDashboardData['company'];
};

export function EmployerHeader({ company }: EmployerHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Banner */}
      <div className="relative h-40 bg-muted sm:h-48 lg:h-56">
        {company.bannerUrl ? (
          <Image
            src={company.bannerUrl}
            alt={`${company.companyName} banner`}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center" aria-label="Company banner not uploaded">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
              <Building2 className="size-10" />
              <span className="text-sm">Company banner not uploaded</span>
            </div>
          </div>
        )}
      </div>

      {/* Company identity */}
      <div className="px-5 pb-6 sm:px-6">
        <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end">
          {/* Logo */}
          <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-md sm:size-24">
            {company.companyLogoUrl ? (
              <Image
                src={company.companyLogoUrl}
                alt={`${company.companyName} logo`}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <Building2 className="size-9 text-muted-foreground" aria-hidden="true" />
            )}
          </div>

          {/* Company information */}
          <div className="min-w-0 flex-1 pb-1">
            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {company.companyName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {company.companyIndustry && <span>{company.companyIndustry}</span>}

              {company.companyLocation && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {company.companyLocation}
                </span>
              )}

              {company.companyWebsite && (
                <a
                  href={company.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground hover:underline">
                  <Globe className="size-4 shrink-0" aria-hidden="true" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
