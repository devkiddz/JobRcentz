'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function markAllNotificationsRead() {
  const user = await requireAuth();

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      isRead: false
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