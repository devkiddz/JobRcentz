'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { CurrentUser } from '@/server/actions/getCurrentUser';

import ActionButton from './ActionButton';
import LogoContainer from './LogoContainer';
import { authenticatedNavigation, publicNavigation, type NavigationItem } from './navigation';
import NotificationButton from './NotificationButton';

interface NavBarProps {
  user?: CurrentUser | null;
  unreadNotificationCount?: number;
}

export default function NavBar({ user, unreadNotificationCount = 0 }: NavBarProps) {
  const pathname = usePathname();

  const navigation: NavigationItem[] = user
    ? [...authenticatedNavigation, ...publicNavigation]
    : publicNavigation;

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-3xl">
      <nav className="mx-auto flex min-h-16 w-full items-center gap-4 px-4 sm:px-6 lg:px-8 md:max-w-[77%]">
        {/* =========================================================
            BRAND
        ========================================================= */}
        <div className="shrink-0">
          <LogoContainer href="/" />
        </div>

        {/* =========================================================
            DESKTOP NAVIGATION
        ========================================================= */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {navigation.map(item => {
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'relative flex items-center gap-2 whitespace-nowrap py-5 text-sm font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                ].join(' ')}>
                <Icon aria-hidden="true" className="size-4" />

                <span>{item.label}</span>

                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* =========================================================
            ACCOUNT ACTIONS
        ========================================================= */}
        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
          {user && <NotificationButton unreadCount={unreadNotificationCount} />}

          <ActionButton user={user ?? undefined} />
        </div>
      </nav>
    </header>
  );
}
