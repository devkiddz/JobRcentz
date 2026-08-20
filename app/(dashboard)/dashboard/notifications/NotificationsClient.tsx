'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Bell, BellRing, CheckCheck, ChevronRight, CircleAlert, Info, ShieldAlert } from 'lucide-react';

import { markAllNotificationsRead } from '@/server/actions/dashboard/notifications/markAllNotificationsRead';
import { markNotificationRead } from '@/server/actions/dashboard/notifications/markNotificationRead';
import type { NotificationsData } from '@/server/actions/dashboard/notifications/getNotifications';

type Props = { initialData: NotificationsData };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(date));
}

function iconFor(type: string) {
  switch (type) {
    case 'INTERVIEW': return BellRing;
    case 'APPLICATION':
    case 'APPLICATION_STATUS': return Info;
    case 'SUPPORT': return ShieldAlert;
    case 'SYSTEM': return AlertCircle;
    default: return Bell;
  }
}

export default function NotificationsClient({ initialData }: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialData.notifications);
  const [busy, setBusy] = useState<string | null>(null);
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  async function markRead(id: string) {
    if (busy) return;
    setBusy(id);
    try {
      const result = await markNotificationRead(id);
      if (result.success) {
        setNotifications(current => current.map(item => item.id === id ? { ...item, isRead: true, readAt: new Date() } : item));
      }
    } finally {
      setBusy(null);
    }
  }

  async function markAllRead() {
    setBusy('all');
    try {
      await markAllNotificationsRead();
      const now = new Date();
      setNotifications(current => current.map(item => ({ ...item, isRead: true, readAt: item.readAt ?? now })));
    } finally {
      setBusy(null);
    }
  }

  async function openNotification(id: string, href: string) {
    const notification = notifications.find(item => item.id === id);
    if (notification && !notification.isRead) {
      await markRead(id);
    }
    router.push(href);
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Communication</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Notifications</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Stay up to date with applications, interviews, jobs, messages and account activity.</p>
        </div>
        {unreadCount > 0 && <button type="button" disabled={busy === 'all'} onClick={() => void markAllRead()} className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-xs font-medium hover:bg-muted disabled:opacity-50"><CheckCheck className="size-3.5" />{busy === 'all' ? 'Updating…' : 'Mark all as read'}</button>}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10"><Bell className="size-4 text-primary" /></div><div><p className="text-xs text-muted-foreground">Total notifications</p><p className="mt-1 text-xl font-bold tabular-nums">{notifications.length}</p></div></div>
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm"><div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10"><CircleAlert className="size-4 text-amber-600 dark:text-amber-400" /></div><div><p className="text-xs text-muted-foreground">Unread</p><p className="mt-1 text-xl font-bold tabular-nums">{unreadCount}</p></div></div>
      </section>

      <section className="space-y-3">
        {notifications.length === 0 ? <div className="rounded-2xl border border-dashed bg-card p-12 text-center"><Bell className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-4 text-sm font-semibold">No notifications yet</h2><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">Activity from your JobMan workspace will appear here.</p></div> : notifications.map(notification => {
          const Icon = iconFor(notification.type);
          return (
            <article key={notification.id} className={`flex gap-4 rounded-2xl border p-4 transition-colors sm:p-5 ${notification.isRead ? 'bg-card' : 'border-primary/20 bg-primary/[0.03]'}`}>
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${notification.isRead ? 'bg-muted' : 'bg-primary/10'}`}><Icon className={`size-4 ${notification.isRead ? 'text-muted-foreground' : 'text-primary'}`} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><h2 className={`text-sm ${notification.isRead ? 'font-medium' : 'font-semibold'}`}>{notification.title}</h2>{!notification.isRead && <span className="size-1.5 rounded-full bg-primary" />}</div><p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{notification.type.replace(/_/g, ' ')}</p></div><span className="rounded-lg bg-muted px-2 py-1 text-[9px] font-semibold">{notification.priority}</span></div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{notification.message}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-[11px] text-muted-foreground">{formatDate(notification.createdAt)}</span><div className="flex items-center gap-2">{!notification.isRead && <button type="button" disabled={busy === notification.id} onClick={() => void markRead(notification.id)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50"><CheckCheck className="size-3.5" />Mark as read</button>}{notification.href && <button type="button" onClick={() => void openNotification(notification.id, notification.href!)} className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary/10 px-2.5 text-[11px] font-medium text-primary hover:bg-primary/15">Open<ChevronRight className="size-3.5" /></button>}</div></div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
