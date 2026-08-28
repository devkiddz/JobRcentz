'use client';

import Link from 'next/link';
import { Bell, CheckCheck, ChevronRight } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { buttonVariants } from '@/components/ui/button';

type NotificationButtonProps = {
  unreadCount?: number;
};

export default function NotificationButton({ unreadCount = 0 }: NotificationButtonProps) {
  const label = unreadCount ? `Notifications (${unreadCount} unread)` : 'Notifications';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({
          variant: 'outline',
          size: 'icon',
          className: 'relative size-10 shrink-0 rounded-full'
        })}
        aria-label={label}
        title={label}>
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-[360px] overflow-hidden rounded-2xl p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                : 'You are all caught up'}
            </p>
          </div>

          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Notification content */}
        {unreadCount === 0 ? (
          <div className="px-6 py-9 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted">
              <CheckCheck className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-medium">You're all caught up</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              New notifications will appear here when there is activity on your account.
            </p>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="size-4 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">You have new activity</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  You have {unreadCount} unread notification
                  {unreadCount === 1 ? '' : 's'} waiting for you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t p-2">
          <Link
            href="/dashboard/notifications"
            className="flex h-9 w-full items-center justify-between rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted">
            <span>View all notifications</span>

            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
