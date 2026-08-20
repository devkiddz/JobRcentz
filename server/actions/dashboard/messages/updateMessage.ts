'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function updateMessage(messageId: string, body: string) {
  const user = await requireAuth();
  const message = body.trim();

  if (!message) return { success: false, error: 'Message cannot be empty.' };
  if (message.length > 5000) return { success: false, error: 'Message must not exceed 5,000 characters.' };

  const existing = await prisma.message.findFirst({
    where: { id: messageId, senderId: user.id, deletedAt: null },
    select: { id: true, conversationId: true }
  });

  if (!existing) return { success: false, error: 'Message not found.' };

  await prisma.message.update({ where: { id: existing.id }, data: { body: message } });
  revalidatePath('/dashboard/messages');
  return { success: true };
}
