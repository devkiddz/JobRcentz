'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Bell, BellRing, CheckCheck, ChevronRight, Loader2 } from 'lucide-react';

import { getUnreadNotificationCount } from '@/server/actions/dashboard/notifications/getUnreadNotificationCount';
import { getNotifications } from '@/server/actions/dashboard/notifications/getNotifications';
import { markAllNotificationsRead } from '@/server/actions/dashboard/notifications/markAllNotificationsRead';
import { markNotificationRead } from '@/server/actions/dashboard/notifications/markNotificationRead';

import { Button } from '@/components/ui/button';

type NotificationItem = {
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

export default function NotificationBell() {
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /**
   * Load only the unread count.
   *
   * This runs periodically and does NOT touch the notification list.
   * That keeps the bell lightweight and prevents the dropdown from
   * constantly refreshing underneath the user.
   */
  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();

      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread notification count:', error);
    }
  }, []);

  /**
   * Load the dropdown notifications.
   *
   * Only called when the dropdown is opened or after an explicit
   * notification action.
   */
  const loadNotifications = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getNotifications();

      setNotifications(result.notifications.slice(0, 5));
      setUnreadCount(result.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial unread count + periodic polling.
   */
  useEffect(() => {
    void loadUnreadCount();

    const interval = window.setInterval(() => {
      void loadUnreadCount();
    }, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadUnreadCount]);

  /**
   * Toggle dropdown.
   *
   * Notifications are loaded only when opening.
   */
  async function handleToggle() {
    if (actionLoading) {
      return;
    }

    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  }

  /**
   * Mark one notification as read.
   *
   * Important:
   * We optimistically update the local notification state instead of
   * immediately re-fetching the entire notification list.
   *
   * This makes the UI much less sensitive/flickery.
   */
  async function handleMarkRead(notificationId: string) {
    if (actionLoading) {
      return false;
    }

    setActionLoading(notificationId);

    try {
      const result = await markNotificationRead(notificationId);

      if (!result.success) {
        console.error('Failed to mark notification as read.');

        return false;
      }

      setNotifications(current =>
        current.map(notification =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: true,
                readAt: new Date()
              }
            : notification
        )
      );

      setUnreadCount(current => Math.max(0, current - 1));

      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);

      return false;
    } finally {
      setActionLoading(null);
    }
  }

  /**
   * Mark every notification as read.
   */
  async function handleMarkAllRead() {
    if (actionLoading || unreadCount === 0) {
      return;
    }

    setActionLoading('ALL');

    try {
      const result = await markAllNotificationsRead();

      if (!result.success) {
        console.error('Failed to mark all notifications as read.');

        return;
      }

      setNotifications(current =>
        current.map(notification => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt ?? new Date()
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    } finally {
      setActionLoading(null);
    }
  }

  /**
   * Handle clicking an individual notification.
   *
   * Already-read notifications navigate immediately.
   * Unread notifications are marked as read first.
   */
  async function handleNotificationClick(notification: NotificationItem) {
    if (actionLoading) {
      return;
    }

    if (!notification.isRead) {
      const marked = await handleMarkRead(notification.id);

      if (!marked) {
        return;
      }
    }

    setOpen(false);

    if (notification.href) {
      router.push(notification.href);
    }
  }

  return (
    <div className="relative">
      {/* Bell */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => void handleToggle()}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        title="Notifications"
        className="relative size-9 rounded-lg text-muted-foreground hover:text-foreground">
        {unreadCount > 0 ? <BellRing className="size-4" /> : <Bell className="size-4" />}

        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 flex min-w-4 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold leading-4 text-primary-foreground">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-11 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-popover shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Notifications</h2>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
                </p>
              </div>

              {unreadCount > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleMarkAllRead()}
                  disabled={actionLoading !== null}
                  className="h-8 gap-1.5 px-2 text-[11px]">
                  {actionLoading === 'ALL' ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CheckCheck className="size-3.5" />
                  )}
                  Mark all read
                </Button>
              )}
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center px-4 py-10">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-muted">
                  <Bell className="size-4 text-muted-foreground" />
                </div>

                <p className="mt-3 text-sm font-medium">No notifications</p>

                <p className="mt-1 text-xs text-muted-foreground">New activity will appear here.</p>
              </div>
            ) : (
              <div className="max-h-[24rem] overflow-y-auto">
                {notifications.map(notification => {
                  const isActionLoading = actionLoading === notification.id;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      disabled={actionLoading !== null}
                      onClick={() => void handleNotificationClick(notification)}
                      className="block w-full text-left disabled:cursor-wait">
                      <div
                        className={[
                          'flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60',
                          notification.isRead ? '' : 'bg-primary/[0.04]'
                        ].join(' ')}>
                        {/* Icon */}
                        <div
                          className={[
                            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                            notification.isRead ? 'bg-muted' : 'bg-primary/10'
                          ].join(' ')}>
                          <Bell
                            className={[
                              'size-3.5',
                              notification.isRead ? 'text-muted-foreground' : 'text-primary'
                            ].join(' ')}
                          />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={[
                                'line-clamp-1 text-xs',
                                notification.isRead ? 'font-medium' : 'font-semibold'
                              ].join(' ')}>
                              {notification.title}
                            </p>

                            {!notification.isRead && (
                              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>

                          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                            {notification.message}
                          </p>

                          <p className="mt-1.5 text-[10px] text-muted-foreground">
                            {formatNotificationDate(notification.createdAt)}
                          </p>
                        </div>

                        {/* Loading state */}
                        {isActionLoading && (
                          <Loader2 className="mt-1 size-3.5 shrink-0 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="border-t p-2">
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10">
                View all notifications
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function formatNotificationDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));
}
