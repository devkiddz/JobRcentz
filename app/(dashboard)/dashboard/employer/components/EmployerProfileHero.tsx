'use client';

import Link from 'next/link';
import { Building2, ExternalLink, Eye, EyeOff, MapPin, Pencil, ShieldCheck, Sparkles } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';
import { cn } from '@/lib/utils';

type Company = EmployerDashboardData['company'];
type User = EmployerDashboardData['user'];
type Profile = EmployerDashboardData['profile'];

interface EmployerProfileHeroProps {
  user: User;
  company: Company;
  profile: Profile;
}

function formatVisibility(value: Company['visibility']) {
  if (!value) return '';
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function EmployerProfileHero({ user, company, profile }: EmployerProfileHeroProps) {
  const displayName = user.name?.trim() || 'Employer';
  const completion = Math.min(100, Math.max(0, profile.completion));
  const isVerified = company.onboardingStatus === 'APPROVED';

  // Circular progress calculations for SVG Arc
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completion / 100) * circumference;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Banner Section */}
      <div className="relative h-36 w-full overflow-hidden sm:h-48 lg:h-52">
        {company.bannerUrl ? (
          <img
            src={company.bannerUrl}
            alt={`${company.companyName} banner`}
            className="size-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="size-full bg-gradient-to-r from-primary/30 via-primary/10 to-accent/20" />
        )}

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-black/20" />

        {/* Edit Button */}
        <Link
          href="/dashboard/employer/company"
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-black/60 hover:shadow-lg active:scale-95">
          <Pencil className="size-3.5 text-white/80" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Main Profile Content */}
      <div className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          {/* Logo & Identity */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Company Logo Container with Verification Badge Overlay */}
            <div className="relative group size-24 shrink-0 sm:size-28">
              <div className="size-full overflow-hidden rounded-2xl border-4 border-card bg-card shadow-xl ring-1 ring-border/50">
                {company.companyLogoUrl ? (
                  <img
                    src={company.companyLogoUrl}
                    alt={company.companyName}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-muted/60">
                    <Building2 className="size-10 text-muted-foreground/60" />
                  </div>
                )}
              </div>

              {/* Verified Badge on Avatar */}
              {isVerified && (
                <div
                  title="Verified Company"
                  className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md ring-4 ring-card dark:bg-emerald-600">
                  <ShieldCheck className="size-4" />
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="min-w-0 space-y-1.5 pb-0.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {company.companyName}
                </h1>
              </div>

              <p className="text-sm font-medium text-muted-foreground">
                Welcome back, <span className="text-foreground">{displayName}</span>
              </p>

              {/* Sub Metadata Tags */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-muted-foreground">
                {company.companyIndustry && (
                  <span className="inline-flex items-center gap-1 font-medium">
                    {company.companyIndustry}
                  </span>
                )}

                {company.companyLocation && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 text-muted-foreground/70" />
                    {company.companyLocation}
                  </span>
                )}

                {company.companyWebsite && (
                  <a
                    href={company.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline hover:underline-offset-4">
                    <span>Website</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Profile Strength & Verification Status Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/20 p-3.5 sm:min-w-72 backdrop-blur-sm">
            {/* SVG Ring Progress */}
            <div className="relative flex size-14 shrink-0 items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 50 50">
                {/* Background Track */}
                <circle
                  cx="25"
                  cy="25"
                  r={radius}
                  className="stroke-muted"
                  strokeWidth="4"
                  fill="transparent"
                />
                {/* Progress Arc */}
                <circle
                  cx="25"
                  cy="25"
                  r={radius}
                  className="stroke-primary transition-all duration-1000 ease-out"
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-bold tabular-nums text-foreground">{completion}%</span>
            </div>

            {/* Profile Status & Verification Details */}
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">Profile strength</p>
                </div>

                {/* Verified Badge inside Profile Strength section */}
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-semibold',
                    profile.isDiscoverable
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                  )}>
                  {profile.isDiscoverable ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  {profile.isDiscoverable ? 'Discoverable' : 'Hidden'}
                </span>

                <span className="text-muted-foreground/40">•</span>

                <span className="text-xs font-medium text-muted-foreground">
                  {formatVisibility(profile.visibility)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
