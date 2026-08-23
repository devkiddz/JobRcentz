import NavBar from '@/components/website/NavBar';
import MobileNav from '@/components/website/MobileNav';

import { getOptionalCurrentUser } from '@/server/actions/getOptionalCurrentUser';
import { getUnreadNotificationCount } from '@/server/actions/dashboard/notifications/getUnreadNotificationCount';

export default async function GlobalNavigation() {
  const user = await getOptionalCurrentUser();

  const unreadNotificationCount = user ? await getUnreadNotificationCount() : 0;

  return (
    <>
      <NavBar user={user ?? undefined} unreadNotificationCount={unreadNotificationCount} />

      <MobileNav user={user ?? undefined} />
    </>
  );
}
