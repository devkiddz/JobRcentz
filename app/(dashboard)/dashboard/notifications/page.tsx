import { getNotifications } from '@/server/actions/dashboard/notifications/getNotifications';
import NotificationsClient from './NotificationsClient';

export default async function NotificationsPage() {
  const data = await getNotifications();
  return <NotificationsClient initialData={data} />;
}
