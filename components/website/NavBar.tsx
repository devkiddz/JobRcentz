'use client';

import Link from 'next/link';

import type { CurrentUser } from '@/server/actions/getCurrentUser';

import ActionButton from './ActionButton';
import LogoContainer from './LogoContainer';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navigation = [
  {
    href: '/jobs',
    label: 'Find Jobs'
  },
  {
    href: '/jobs/create',
    label: 'Post a Job'
  },
  {
    href: '/professionals',
    label: 'Professionals'
  },
  {
    href: '/projects',
    label: 'Projects'
  }
];

interface NavBarProps {
  user?: CurrentUser | null;
}

export default function NavBar({ user }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-3xl">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4">
        {/* Brand */}
        <div className="shrink-0">
          <LogoContainer href="/" />
        </div>

        {/* Navigation */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {navigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <ActionButton user={user ?? undefined} />
          {user && (
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-48 truncate text-sm font-semibold">{user.name || 'User'}</p>

              <p className="max-w-48 truncate text-xs text-muted-foreground">
                {user.jobSeeker?.currentRole ??
                  user.jobSeeker?.headline ??
                  user.company?.companyIndustry ??
                  'No active Job'}
              </p>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
