'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import LogoContainer from '@/components/website/LogoContainer';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';
import { getDashboardNavigation } from '@/server/actions/onboarding/navigation/dashboard-navigation';

interface DashboardSidebarProps {
  user: DashboardUser;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navigation = getDashboardNavigation(user.role);

  const workspaceName = user.role === 'EMPLOYER' ? (user.company?.companyName ?? 'Employer') : 'Job Seeker';

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <LogoContainer href="/" />
      </div>

      {/* Workspace identity */}
      <div className="border-b px-4 py-3">
        <div className="rounded-xl bg-muted/40 px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Workspace</p>

          <p className="mt-0.5 truncate text-sm font-semibold">{workspaceName}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {navigation.map(group => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}>
                      <Icon className="size-4 shrink-0" />

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t p-4">
        <p className="px-2 text-xs text-muted-foreground">JobMan</p>
      </div>
    </aside>
  );
}
