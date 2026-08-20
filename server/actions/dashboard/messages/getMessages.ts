'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getMessages(conversationId: string) {
  const user = await requireAuth();

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
    throw new Error('Conversation not found.');
  }

  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      body: true,
      senderId: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });
}
