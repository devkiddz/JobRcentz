'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export type MessageAttachmentInput = {
  fileName: string;
  mimeType: string;
  url: string;
  publicId?: string | null;
  size?: number | null;
};

export async function sendMessage(
  conversationId: string,
  body: string,
  replyToId: string | null = null,
  attachments: MessageAttachmentInput[] = []
) {
  try {
    const user = await requireAuth();

    const message = body.trim();

    if (!message && attachments.length === 0) {
      return {
        success: false,
        error: 'Message cannot be empty.'
      };
    }

    if (message.length > 5000) {
      return {
        success: false,
        error: 'Message must not exceed 5,000 characters.'
      };
    }

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id
        }
      },
      select: {
        conversationId: true
      }
    });

    if (!participant) {
      return {
        success: false,
        error: 'You are not a participant in this conversation.'
      };
    }

    if (replyToId) {
      const replyTarget = await prisma.message.findFirst({
        where: {
          id: replyToId,
          conversationId
        },
        select: {
          id: true
        }
      });

      if (!replyTarget) {
        return {
          success: false,
          error: 'The message you are replying to no longer exists.'
        };
      }
    }

    const created = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        body: message,
        replyToId,

        attachments: {
          create: attachments.map(file => ({
            fileName: file.fileName,
            mimeType: file.mimeType,
            url: file.url,
            publicId: file.publicId ?? null,
            size: file.size ?? null
          }))
        }
      },
      select: {
        id: true
      }
    });

    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        updatedAt: new Date()
      }
    });

    revalidatePath('/dashboard/messages');

    return {
      success: true,
      messageId: created.id
    };
  } catch (error) {
    console.error('sendMessage error:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to send the message.'
    };
  }
}