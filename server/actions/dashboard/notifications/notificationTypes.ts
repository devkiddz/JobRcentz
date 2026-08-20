// server/notifications/notificationTypes.ts

import {
  NotificationPriority,
  NotificationType
} from '@/lib/generated/prisma/browser';

export type NotificationPayload = {
  userId: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  href?: string | null;
};

export type NotificationResult = {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  href: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
};