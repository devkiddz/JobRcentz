'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function NotificationButton({ unreadCount = 0 }: { unreadCount?: number }) {
  const label = unreadCount ? `Notifications (${unreadCount} unread)` : 'Notifications';

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={label}
      title={label}
      className={buttonVariants({ variant: 'outline', size: 'icon', className: 'relative size-10 shrink-0 rounded-full' })}>
      <Bell className="size-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground ring-2 ring-background">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
