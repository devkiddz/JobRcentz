'use server';

import { revalidatePath } from 'next/cache';

import { NotificationType } from '@/lib/generated/prisma/browser';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function markConversationNotificationsRead(
  conversationId: string
) {
  try {
    const user = await requireAuth();

    if (!conversationId) {
      return {
        success: false,
        error: 'Conversation ID is required.'
      };
    }

    /*
     * Security check:
     * The user must actually belong to the conversation.
     */
    const participant =
      await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: user.id
          }
        },
        select: {
          id: true
        }
      });

    if (!participant) {
      return {
        success: false,
        error: 'You are not a participant in this conversation.'
      };
    }

    /*
     * Message notifications currently store their destination
     * in the notification href:
     *
     * /dashboard/messages?conversationId=<conversationId>
     *
     * Mark every unread MESSAGE notification for this conversation
     * as read, rather than only the notification that was clicked.
     */
    const href =
      `/dashboard/messages?conversationId=${conversationId}`;

    const result = await prisma.notification.updateMany({
      where: {
        userId: user.id,
        type: NotificationType.MESSAGE,
        href,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    /*
     * Keep the conversation's read position synchronized as well.
     * This gives us a useful foundation for future unread-message
     * indicators without requiring another schema change.
     */
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id
        }
      },
      data: {
        lastReadAt: new Date()
      }
    });

    revalidatePath('/dashboard/notifications');

    return {
      success: true,
      markedRead: result.count
    };
  } catch (error) {
    console.error(
      'markConversationNotificationsRead error:',
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to mark conversation notifications as read.'
    };
  }
}