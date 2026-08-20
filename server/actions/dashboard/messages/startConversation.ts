'use server';

import { redirect } from 'next/navigation';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function startConversation(targetUserId: string) {
  const user = await requireAuth();

  if (!targetUserId || targetUserId === user.id) {
    throw new Error('Invalid conversation participant.');
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true }
  });

  if (!target) {
    throw new Error('User not found.');
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      type: 'DIRECT',
      participants: {
        every: {
          userId: {
            in: [user.id, targetUserId]
          }
        }
      }
    },
    select: {
      id: true,
      participants: {
        select: { userId: true }
      }
    }
  });

  if (
    existing &&
    existing.participants.length === 2 &&
    existing.participants.some((participant) => participant.userId === user.id) &&
    existing.participants.some((participant) => participant.userId === targetUserId)
  ) {
    redirect(`/dashboard/messages?conversationId=${existing.id}`);
  }

  const conversation = await prisma.conversation.create({
    data: {
      type: 'DIRECT',
      participants: {
        create: [
          { userId: user.id },
          { userId: targetUserId }
        ]
      }
    },
    select: { id: true }
  });

  redirect(`/dashboard/messages?conversationId=${conversation.id}`);
}
