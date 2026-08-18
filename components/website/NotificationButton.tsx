'use client';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotificationButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Notifications"
      className="relative size-10 shrink-0 rounded-full">
      <Bell className="size-5" />

      {/* Unread indicator */}
      <span
        aria-hidden="true"
        className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background"
      />
    </Button>
  );
}
