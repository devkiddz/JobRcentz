import Link from 'next/link';
import {
  AlertCircle,
  Bell,
  BellRing,
  CheckCheck,
  ChevronRight,
  CircleAlert,
  Info,
  ShieldAlert
} from 'lucide-react';

import { getNotifications } from '@/server/actions/dashboard/notifications/getNotifications';
import { markAllNotificationsRead } from '@/server/actions/dashboard/notifications/markAllNotificationsRead';
import { markNotificationRead } from '@/server/actions/dashboard/notifications/markNotificationRead';

function formatNotificationDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));
}

function formatNotificationType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case 'URGENT':
      return 'bg-destructive/10 text-destructive';

    case 'HIGH':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';

    case 'NORMAL':
      return 'bg-primary/10 text-primary';

    case 'LOW':
      return 'bg-muted text-muted-foreground';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

const notificationIconMap = {
  INTERVIEW: BellRing,
  APPLICATION: Info,
  APPLICATION_STATUS: Info,
  JOB: Bell,
  JOB_INVITATION: Bell,
  SUPPORT: ShieldAlert,
  SYSTEM: AlertCircle
} as const;

type NotificationIconType = keyof typeof notificationIconMap;

function NotificationIcon({ type, className }: { type: string; className?: string }) {
  const Icon = notificationIconMap[type as NotificationIconType] ?? Bell;

  return <Icon className={className} />;
}

export default async function NotificationsPage() {
  const { notifications, unreadCount } = await getNotifications();

  async function markAllReadAction(_formData: FormData): Promise<void> {
    await markAllNotificationsRead();
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Communication</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Notifications</h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Stay up to date with applications, interviews, jobs and activity across your JobMan workspace.
          </p>
        </div>

        {unreadCount > 0 && (
          <form action={markAllReadAction}>
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-xs font-medium hover:bg-muted">
              <CheckCheck className="size-3.5" />
              Mark all as read
            </button>
          </form>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="size-4.5 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Total notifications</p>

            <p className="mt-1 text-xl font-bold tabular-nums">{notifications.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <CircleAlert className="size-4.5 text-amber-600 dark:text-amber-400" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Unread</p>

            <p className="mt-1 text-xl font-bold tabular-nums">{unreadCount}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          notifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        )}
      </section>
    </main>
  );
}

type NotificationCardProps = {
  notification: {
    id: string;
    type: string;
    priority: string;
    title: string;
    message: string;
    href: string | null;
    isRead: boolean;
    readAt: Date | null;
    createdAt: Date;
  };
};

function NotificationCard({ notification }: NotificationCardProps) {
  async function markReadAction(_formData: FormData): Promise<void> {
    await markNotificationRead(notification.id);
  }

  return (
    <article
      className={[
        'flex gap-4 rounded-2xl border p-4 transition-colors sm:p-5',
        notification.isRead ? 'bg-card' : 'border-primary/20 bg-primary/[0.03]'
      ].join(' ')}>
      <div
        className={[
          'flex size-10 shrink-0 items-center justify-center rounded-xl',
          notification.isRead ? 'bg-muted' : 'bg-primary/10'
        ].join(' ')}>
        <NotificationIcon
          type={notification.type}
          className={['size-4.5', notification.isRead ? 'text-muted-foreground' : 'text-primary'].join(' ')}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={['text-sm', notification.isRead ? 'font-medium' : 'font-semibold'].join(' ')}>
                {notification.title}
              </h2>

              {!notification.isRead && <span className="size-1.5 rounded-full bg-primary" />}
            </div>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {formatNotificationType(notification.type)}
            </p>
          </div>

          <span
            className={`w-fit shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold ${getPriorityClasses(
              notification.priority
            )}`}>
            {notification.priority}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">{notification.message}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-muted-foreground">
            {formatNotificationDate(notification.createdAt)}
          </span>

          <div className="flex items-center gap-2">
            {!notification.isRead && (
              <form action={markReadAction}>
                <button
                  type="submit"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-[11px] font-medium hover:bg-muted">
                  <CheckCheck className="size-3.5" />
                  Mark as read
                </button>
              </form>
            )}

            {notification.href && (
              <Link
                href={notification.href}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary/10 px-2.5 text-[11px] font-medium text-primary hover:bg-primary/15">
                Open
                <ChevronRight className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyNotifications() {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">
        <Bell className="size-5 text-muted-foreground" />
      </div>

      <h2 className="mt-4 text-sm font-semibold">No notifications yet</h2>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        When there is activity on your applications, interviews, jobs or account, your notifications will
        appear here.
      </p>
    </div>
  );
}
