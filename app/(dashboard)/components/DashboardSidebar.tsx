'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Clock3 } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import LogoContainer from '@/components/website/LogoContainer';
import { cn } from '@/lib/utils';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';
import { getDashboardNavigation } from '@/server/actions/onboarding/navigation/dashboard-navigation';

interface DashboardSidebarProps {
  user: DashboardUser;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navigation = getDashboardNavigation(user.role);

  const workspaceName =
    user.role === 'EMPLOYER'
      ? (user.company?.companyName ?? 'Employer')
      : user.role === 'ADMIN'
        ? 'Administration'
        : 'Job Seeker';

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <LogoContainer href="/" />
      </div>

      {/* Workspace */}
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
                    !item.inactive &&
                    (item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname === item.href || pathname.startsWith(`${item.href}/`));

                  if (item.inactive) {
                    return <ComingSoonNavigationItem key={item.href} label={item.label} icon={Icon} />;
                  }

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

interface ComingSoonNavigationItemProps {
  label: string;
  icon: React.ElementType;
}

function ComingSoonNavigationItem({ label, icon: Icon }: ComingSoonNavigationItemProps) {
  return (
    <Dialog>
      <DialogTrigger className="group flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-muted-foreground/60 transition-colors hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400">
        <Icon className="size-4 shrink-0 opacity-70 group-hover:opacity-100" />

        <span className="flex-1 line-through decoration-muted-foreground/30 group-hover:no-underline">
          {label}
        </span>

        <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Dev
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-amber-500/10">
            <Clock3 className="size-5 text-amber-600 dark:text-amber-400" />
          </div>

          <DialogTitle>{label} is under development</DialogTitle>

          <DialogDescription className="leading-6">
            We’re currently building this part of the JobMan workspace. It will be live soon!
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Under Active Development</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            For now, continue using the available workspace features. We’ll bring this section online as soon
            as it&lsquo;s completed.
          </p>
        </div>

        <DialogClose
          className={buttonVariants({
            variant: 'outline',
            className: 'ml-auto flex items-center gap-2'
          })}>
          Got it
          <ArrowRight className="size-3.5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
