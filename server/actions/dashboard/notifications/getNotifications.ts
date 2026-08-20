'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getNotifications() {
  const user = await requireAuth();

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50,
    select: {
      id: true,
      type: true,
      priority: true,
      title: true,
      message: true,
      href: true,
      isRead: true,
      readAt: true,
      createdAt: true
    }
  });

  const unreadCount = notifications.filter(
    notification => !notification.isRead
  ).length;

  return {
    notifications,
    unreadCount
  };
}

export type NotificationsData = Awaited<
  ReturnType<typeof getNotifications>
>;