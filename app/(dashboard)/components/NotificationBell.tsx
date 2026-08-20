'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

import { getUnreadNotificationCount } from '@/server/actions/dashboard/notifications/getUnreadNotificationCount';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadUnreadCount() {
      try {
        const count = await getUnreadNotificationCount();

        if (active) {
          setUnreadCount(count);
        }
      } catch (error) {
        console.error('Failed to load unread notification count:', error);
      }
    }

    loadUnreadCount();

    const interval = window.setInterval(loadUnreadCount, 30_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
      title="Notifications"
      className="relative inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      <Bell className="size-4" />

      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-1 top-1 flex min-w-4 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold leading-4 text-primary-foreground">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
