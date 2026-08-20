'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function sendMessage(
  conversationId: string,
  body: string
) {
  const user = await requireAuth();
  const message = body.trim();

  if (!message) {
    throw new Error('Message cannot be empty.');
  }

  if (message.length > 5000) {
    throw new Error('Message must not exceed 5,000 characters.');
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: user.id
      }
    },
    select: { conversationId: true }
  });

  if (!participant) {
    throw new Error('You are not a participant in this conversation.');
  }

  await prisma.message.create({
    data: {
      conversationId,
      senderId: user.id,
      body: message
    }
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() }
  });

  revalidatePath('/dashboard/messages');
}
