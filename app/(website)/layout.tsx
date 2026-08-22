import type { ReactNode } from 'react';

import NavBar from '@/components/website/NavBar';
import { getOptionalCurrentUser } from '@/server/actions/getOptionalCurrentUser';
import { getUnreadNotificationCount } from '@/server/actions/dashboard/notifications/getUnreadNotificationCount';

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const user = await getOptionalCurrentUser();
  const unreadNotificationCount = user ? await getUnreadNotificationCount() : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={user ?? undefined} unreadNotificationCount={unreadNotificationCount} />

      <main className="flex-1">{children}</main>
    </div>
  );
}
