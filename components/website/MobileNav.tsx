'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BriefcaseBusiness,
  Home,
  LayoutDashboard,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface MobileNavProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const primaryItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Jobs', href: '/jobs', icon: BriefcaseBusiness },
  { label: 'Search', href: '/jobs', icon: Search },
];

export default function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardHref = user ? '/dashboard' : '/login';
  const dashboardLabel = user ? 'Dashboard' : 'Sign in';
  const dashboardActive = Boolean(user && pathname.startsWith('/dashboard'));

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 shadow-[0_-8px_30px_-18px_hsl(var(--foreground)/0.35)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto flex h-16 max-w-lg items-stretch px-2">
          {primaryItems.map(item => {
            const Icon = item.icon;
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                  />
                )}
                <Icon className="size-[19px]" strokeWidth={active ? 2.3 : 1.9} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href={dashboardHref}
            aria-current={dashboardActive ? 'page' : undefined}
            className={[
              'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-colors',
              dashboardActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {dashboardActive && (
              <span
                aria-hidden="true"
                className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
              />
            )}
            <LayoutDashboard
              className="size-[19px]"
              strokeWidth={dashboardActive ? 2.3 : 1.9}
            />
            <span>{dashboardLabel}</span>
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(current => !current)}
            className={[
              'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-colors',
              menuOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {menuOpen ? (
              <X className="size-[19px]" strokeWidth={2.1} />
            ) : (
              <Menu className="size-[19px]" strokeWidth={1.9} />
            )}
            <span>Menu</span>
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-[2px] md:hidden"
          />

          <div className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border bg-background/95 p-2 shadow-2xl backdrop-blur-xl md:hidden">
            <div className="px-3 pb-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Job Rcentz
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Find opportunities and manage your career.
              </p>
            </div>

            <div className="grid gap-1">
              <Link
                href="/jobs"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Search className="size-4 text-primary" />
                Search jobs
              </Link>

              <Link
                href="/onboarding"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <LayoutDashboard className="size-4 text-primary" />
                Build your profile
              </Link>

              {user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard className="size-4 text-primary" />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/applications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <BriefcaseBusiness className="size-4 text-primary" />
                    My applications
                  </Link>
                </>
              )}

              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <LayoutDashboard className="size-4 text-primary" />
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
