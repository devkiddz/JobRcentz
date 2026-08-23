'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import LogoContainer from '@/components/website/LogoContainer';
import {
  getRoleNavigation,
  getWorkspaceName,
  isNavigationItemActive,
} from '@/components/website/navigation';
import { cn } from '@/lib/utils';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';

interface DashboardSidebarProps {
  user: DashboardUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SidebarNavigation({
  user,
  onNavigate,
}: {
  user: DashboardUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const navigation = getRoleNavigation(user.role);
  const workspaceName = getWorkspaceName(user.role, user.company?.companyName);

  return (
    <>
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <LogoContainer href="/" />
      </div>

      <div className="border-b px-4 py-3">
        <div className="rounded-xl bg-muted/40 px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold">{workspaceName}</p>
        </div>
      </div>

      <nav aria-label="Dashboard navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {navigation.map(group => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                        isNavigationItemActive(pathname, item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {Icon && <Icon className="size-4 shrink-0" />}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t px-5 py-4 text-xs text-muted-foreground">
        Job Rcentz
      </div>
    </>
  );
}

export default function DashboardSidebar({
  user,
  open,
  onOpenChange,
}: DashboardSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <>
      <aside
        aria-label="Dashboard sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card shadow-xl transition-transform duration-200 lg:flex',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="absolute right-3 top-3 z-10">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close sidebar"
            onClick={() => onOpenChange(false)}
          >
            <PanelLeftClose className="size-4" />
          </Button>
        </div>

        <SidebarNavigation user={user} />
      </aside>

      {isMobile && (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="left" className="w-[min(20rem,calc(100vw-2rem))] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Dashboard navigation</SheetTitle>
            </SheetHeader>

            <div className="flex h-full flex-col">
              <SidebarNavigation
                user={user}
                onNavigate={() => onOpenChange(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

export function DashboardSidebarToggle({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={open}
      onClick={onClick}
      className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
    >
      {open ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
    </Button>
  );
}
