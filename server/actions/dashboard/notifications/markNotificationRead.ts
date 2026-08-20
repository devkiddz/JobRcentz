'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function markNotificationRead(notificationId: string) {
  const user = await requireAuth();

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId: user.id
    },
    select: {
      id: true,
      isRead: true
    }
  });

  if (!notification) {
    return {
      success: false,
      error: 'Notification not found.'
    };
  }

  if (notification.isRead) {
    return {
      success: true
    };
  }

  await prisma.notification.update({
    where: {
      id: notification.id
    },
    data: {
      isRead: true,
      readAt: new Date()
    }
  });

  revalidatePath('/dashboard/notifications');

  return {
    success: true
  };
}