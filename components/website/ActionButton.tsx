'use client';

import Link from 'next/link';
import { ArrowRight, User2Icon } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

import type { CurrentUser } from '@/server/actions/getCurrentUser';

import UserHelperSheet from './UserHelperSheet';
import { ThemeToggle } from '../ui/ThemeToggle';

interface ActionButtonProps {
  user?: CurrentUser | null;
}

export default function ActionButton({ user }: ActionButtonProps) {
  /*
   * Guest
   */
  if (!user) {
    return (
      <div className="flex items-center justify-center gap-1">
        <ThemeToggle />
        <Link
          href="/register"
          aria-label="Join JobMan"
          className={buttonVariants({
            variant: 'default',
            className:
              'group relative inline-flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-2.5 text-sm font-semibold text-white/80 shadow-md transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-primary/25 active:scale-95 sm:px-5 sm:py-2.5'
          })}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"
          />

          <User2Icon className="relative size-4 shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 dark:text-black" />

          <span className="relative hidden whitespace-nowrap sm:inline-block dark:text-black">
            Join JobMan
          </span>

          <ArrowRight className="relative hidden size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:inline-block dark:text-black" />
        </Link>
      </div>
    );
  }

  /*
   * Authenticated user
   */
  const profileImage = user.jobSeeker?.profilePhotoUrl ?? user.company?.companyLogoUrl ?? user.image ?? null;

  return (
    <div className="flex min-w-0 shrink-0 items-center gap-3">
      <UserHelperSheet
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          profileImage,
          role: user.role,
          jobTitle:
            user.jobSeeker?.currentRole ?? user.jobSeeker?.headline ?? user.company?.companyIndustry ?? null,
          companyName: user.company?.companyName
        }}
      />

      {/* Desktop account identity */}
      <div className="hidden min-w-0 max-w-48 lg:block">
        <p className="truncate text-sm font-semibold leading-tight">{user.name || 'User'}</p>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
