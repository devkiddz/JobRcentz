'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { CurrentUser } from '@/server/actions/getCurrentUser';

import ActionButton from './ActionButton';
import LogoContainer from './LogoContainer';
import MobileNavSheet from './MobileNavSheet';
import { publicNavigation } from './navigation';
import NotificationButton from './NotificationButton';

interface NavBarProps {
  user?: CurrentUser | null;
}

export default function NavBar({ user }: NavBarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-3xl">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-1 pl-4">
        {/* Mobile navigation */}
        <div className="flex items-center justify-start gap-0">
          <div className="md:hidden">
            <MobileNavSheet navigation={publicNavigation} />
          </div>

          {/* Brand */}
          <div className="shrink-0">
            <LogoContainer href="/" />
          </div>
        </div>
        {/* Desktop navigation */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {publicNavigation.map(item => {
            const isActive =
              pathname === item.href || (item.href !== '/jobs' && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap py-5 text-sm font-medium transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}>
                {item.label}

                {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </div>

        {/* Account actions */}
        {/* Actions */}
        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
          {user && <NotificationButton />}

          <ActionButton user={user ?? undefined} />
        </div>
      </nav>
    </header>
  );
}
