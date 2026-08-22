'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function NotificationButton() {
  return (
    <Link
      href="/dashboard/notifications"
      aria-label="Notifications"
      className={buttonVariants({ variant: 'outline', size: 'icon', className: 'relative size-10 shrink-0 rounded-full' })}>
      <Bell className="size-5" />
    </Link>
  );
}
