'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import { ChevronDown, Menu } from 'lucide-react';

import { DashboardSidebarToggle } from './DashboardSidebar';

import {
  getDashboardHeaderNavigation,
  getPageContext,
  isNavigationItemActive
} from '@/components/website/navigation';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';

interface DashboardHeaderProps {
  user: DashboardUser;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const headerContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -6
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export default function DashboardHeader({ user, sidebarOpen, onSidebarToggle }: DashboardHeaderProps) {
  const pathname = usePathname();

  const page = getPageContext(pathname);
  const navigation = getDashboardHeaderNavigation(user.role);

  return (
    <header className="w-full max-w-[87%] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <motion.div
        variants={headerContentVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-16 w-full items-center justify-between gap-4 px-4">
        {/* ============================================================= */}
        {/* LEFT — SIDEBAR + PAGE CONTEXT                                */}
        {/* ============================================================= */}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <DashboardSidebarToggle open={sidebarOpen} onClick={onSidebarToggle} />

            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{page.title}</h1>

              <p className="mt-0.5 hidden max-w-xl truncate text-xs text-muted-foreground lg:block">
                {page.description}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* DESKTOP — WORKSPACE SHORTCUTS                                */}
        {/* ============================================================= */}

        <nav aria-label="Workspace navigation" className="hidden items-center gap-1 xl:flex">
          {navigation.map(item => {
            const Icon = item.icon;
            const isActive = isNavigationItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                ].join(' ')}>
                {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ============================================================= */}
        {/* MOBILE / TABLET — WORKSPACE MENU                             */}
        {/* ============================================================= */}

        <details className="relative xl:hidden">
          <summary
            className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden"
            aria-label="Open dashboard menu">
            <Menu className="size-4" />
            <span className="hidden sm:inline">Menu</span>
            <ChevronDown className="size-3.5" />
          </summary>

          <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-popover p-2 shadow-lg">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>
            </div>

            <div className="space-y-1">
              {navigation.map(item => {
                const Icon = item.icon;
                const isActive = isNavigationItemActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    ].join(' ')}>
                    {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </details>
      </motion.div>
    </header>
  );
}
