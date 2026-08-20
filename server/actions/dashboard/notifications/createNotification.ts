// server/notifications/createNotification.ts

import {
  NotificationPriority,
  NotificationType
} from '@/lib/generated/prisma/browser';

import { prisma } from '@/server/db/prisma';

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  href?: string | null;
};

export async function createNotification({
  userId,
  type,
  priority = NotificationPriority.NORMAL,
  title,
  message,
  href = null
}: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      priority,
      title,
      message,
      href
    },
    select: {
      id: true,
      userId: true,
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
}