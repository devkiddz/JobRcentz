import Link from 'next/link';
import { Building2, Globe, MapPin, Pencil, ShieldCheck } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

type Company = EmployerDashboardData['company'];
type User = EmployerDashboardData['user'];
type Profile = EmployerDashboardData['profile'];

interface EmployerProfileHeroProps {
  user: User;
  company: Company;
  profile: Profile;
}

export default function EmployerProfileHero({ user, company, profile }: EmployerProfileHeroProps) {
  const displayName = user.name?.trim() || 'Employer';

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden sm:h-52 lg:h-60">
        {company.bannerUrl ? (
          <img src={company.bannerUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="size-full bg-linear-to-br from-primary/20 via-primary/5 to-background" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

        <Link
          href="/dashboard/employer/company"
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/30 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/50">
          <Pencil className="size-3.5" />
          Edit company
        </Link>
      </div>

      {/* Identity */}
      <div className="relative px-5 pb-6 sm:px-7 lg:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            {/* Logo */}
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-lg sm:size-28">
              {company.companyLogoUrl ? (
                <img
                  src={company.companyLogoUrl}
                  alt={company.companyName}
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-10 text-muted-foreground" />
              )}
            </div>

            {/* Company identity */}
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                  {company.companyName}
                </h1>

                {company.onboardingStatus === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    <ShieldCheck className="size-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">Welcome back, {displayName}</p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span>{company.companyIndustry}</span>

                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {company.companyLocation}
                </span>

                {company.companyWebsite && (
                  <a
                    href={company.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-foreground">
                    <Globe className="size-3.5" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Profile status */}
          <div className="w-full shrink-0 rounded-xl border bg-muted/30 p-4 sm:w-56">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Profile completion</span>

              <span className="text-sm font-semibold">{profile.completion}%</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${profile.completion}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {profile.isDiscoverable
                ? 'Your company is discoverable by candidates.'
                : 'Your company is currently hidden.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
