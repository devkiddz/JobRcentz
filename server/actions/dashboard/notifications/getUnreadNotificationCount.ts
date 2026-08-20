'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getUnreadNotificationCount() {
  const user = await requireAuth();

  return prisma.notification.count({
    where: {
      userId: user.id,
      isRead: false
    }
  });
}