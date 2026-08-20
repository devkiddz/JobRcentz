'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function markNotificationsReadByHref(href: string) {
  const user = await requireAuth();

  const result = await prisma.notification.updateMany({
    where: {
      userId: user.id,
      href,
      isRead: false
    },
    data: {
      isRead: true,
      readAt: new Date()
    }
  });

  if (result.count > 0) {
    revalidatePath('/dashboard/notifications');
  }

  return {
    success: true,
    count: result.count
  };
}