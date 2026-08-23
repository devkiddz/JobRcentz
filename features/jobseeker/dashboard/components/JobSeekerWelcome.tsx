'use client';

import Link from 'next/link';

import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  Grid2X2,
  Image,
  Info,
  MapPin,
  Star,
  UserRound
} from 'lucide-react';

import type { JobSeekerTab } from './JobSeekerDashboard';

interface JobSeekerWelcomeProps {
  applicationsCount: number;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };

  profile: {
    headline: string;
    currentRole: string | null;
    location: string;
    yearsOfExperience: number | null;

    profilePhotoUrl: string | null;
    bannerUrl?: string | null;

    averageRating?: number;
    ratingCount?: number;

    isAvailable?: boolean;
    isDiscoverable?: boolean;
  };

  activeTab: JobSeekerTab;

  onTabChange: (tab: JobSeekerTab) => void;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

const profileTabs: Array<{
  id: JobSeekerTab;
  label: string;
  icon: typeof Grid2X2;
}> = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Grid2X2
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: FileText
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: BriefcaseBusiness
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: FolderKanban
  },
  {
    id: 'about',
    label: 'About',
    icon: Info
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: Image
  }
];

export default function JobSeekerWelcome({
  user,
  profile,
  activeTab,
  onTabChange,
  applicationsCount
}: JobSeekerWelcomeProps) {
  const displayName = user.name?.trim() || 'Job Seeker';

  const profileImage = profile.profilePhotoUrl ?? user.image;

  return (
    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* =========================================================
          COVER BANNER
      ========================================================= */}

      <div className="relative h-44 overflow-hidden sm:h-56">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="relative size-full overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-muted">
            {/* Decorative grid */}

            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }}
            />

            {/* Decorative glow */}

            <div className="absolute -right-20 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />

            <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-primary/10 blur-3xl" />

            {/* Subtle content */}

            <div className="absolute inset-0 flex items-center justify-end px-8 sm:px-12">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-foreground/40">
                  Professional Profile
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight text-foreground/10">JOB SEEKER</p>
              </div>
            </div>
          </div>
        )}

        {/* Banner overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
      </div>

      {/* =========================================================
          PROFILE BODY
      ========================================================= */}

      <div className="relative px-5 sm:px-7">
        {/* =======================================================
            PROFILE IDENTITY + ACTIONS
        ======================================================= */}

        <div className="-mt-14 flex flex-col gap-5 pb-6 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          {/* =====================================================
              PROFILE IDENTITY
          ===================================================== */}

          <div className="flex min-w-0 items-end gap-4">
            {/* Profile image */}

            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted shadow-lg sm:size-28">
              {profileImage ? (
                <img src={profileImage} alt={`${displayName}'s profile`} className="size-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-muted-foreground">{getInitials(displayName)}</span>
              )}
            </div>

            {/* Identity */}

            <div className="min-w-0 pb-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Job Seeker Dashboard
              </p>

              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {displayName} 👋
              </h1>

              <p className="mt-1 truncate text-sm text-muted-foreground">
                {profile.currentRole ?? profile.headline ?? 'Job Seeker'}
              </p>
            </div>
          </div>

          {/* =====================================================
              ACTIONS
          ===================================================== */}

          <div className="flex shrink-0 gap-2">
            <Link
              href="/dashboard/profile"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition hover:bg-muted">
              <UserRound className="size-4" />
              Profile
            </Link>

            <Link
              href="/jobs"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
              Find Jobs
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* =========================================================
            PROFILE META
        ========================================================= */}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-6 text-sm text-muted-foreground">
          {/* Location */}

          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" />
            {profile.location}
          </span>

          {/* Experience */}

          {profile.yearsOfExperience !== null && profile.yearsOfExperience !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-4" />
              {profile.yearsOfExperience} {profile.yearsOfExperience === 1 ? 'year' : 'years'} experience
            </span>
          )}

          {/* Rating */}

          {typeof profile.averageRating === 'number' &&
            profile.ratingCount !== undefined &&
            profile.ratingCount > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-current" />

                {profile.averageRating.toFixed(1)}

                <span>({profile.ratingCount})</span>
              </span>
            )}

          {/* Availability */}

          {profile.isAvailable !== undefined && (
            <span
              className={
                profile.isAvailable
                  ? 'inline-flex items-center gap-2 text-green-600 dark:text-green-400'
                  : 'inline-flex items-center gap-2 text-muted-foreground'
              }>
              <span
                className={
                  profile.isAvailable
                    ? 'size-2 rounded-full bg-green-500'
                    : 'size-2 rounded-full bg-muted-foreground'
                }
              />

              {profile.isAvailable ? 'Available for work' : 'Not currently available'}
            </span>
          )}
        </div>

        {/* =========================================================
            PROFILE TABS
        ========================================================= */}

        <nav
          aria-label="Profile sections"
          role="tablist"
          className="-mx-5 flex overflow-x-auto border-t scrollbar-none sm:-mx-7">
          {profileTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange(tab.id)}
                className={[
                  'relative flex shrink-0 items-center gap-2 px-4 py-4',
                  'text-sm font-medium transition-colors',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-primary/50',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  'sm:px-6'
                ].join(' ')}>
                <Icon className="size-4" />

                <span>{tab.label}</span>

                {/* Application count */}

                {tab.id === 'applications' && (
                  <span
                    className={[
                      'min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold',
                      active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    ].join(' ')}>
                    {applicationsCount}
                  </span>
                )}

                {/* Active indicator */}

                {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
