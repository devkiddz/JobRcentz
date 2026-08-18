'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, User2Icon } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

import type { CurrentUser } from '@/server/actions/getCurrentUser';

import UserHelperSheet from './UserHelperSheet';
import { ThemeToggle } from '../ui/ThemeToggle';

interface ActionButtonProps {
  user?: CurrentUser;
}

export default function ActionButton({ user }: ActionButtonProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Link
          href="/login"
          aria-label="Get Started"
          className={buttonVariants({
            variant: 'default',
            className:
              'group relative inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-2.5 text-sm font-semibold text-white/80 hover:text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-95 sm:px-5 sm:py-2.5'
          })}>
          {/* Subtle shine effect on hover */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />

          {/* Sparkle icon - visible on mobile icon-only view and desktop */}
          <User2Icon className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />

          {/* Text and arrow hidden on mobile, shown on tablet/desktop */}
          <span className="hidden sm:inline-block">Get Started</span>

          <ArrowRight className="hidden size-4 transition-transform duration-300 group-hover:translate-x-1 sm:inline-block" />
        </Link>
      </div>
    );
  }

  const profileImage = user.jobSeeker?.profilePhotoUrl ?? user.company?.companyLogoUrl ?? user.image;

  const jobTitle =
    user.jobSeeker?.currentRole ?? user.jobSeeker?.headline ?? user.company?.companyIndustry ?? null;

  return (
    <UserHelperSheet
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        profileImage,
        role: user.role,
        jobTitle,
        companyName: user.company?.companyName
      }}
    />
  );
}
