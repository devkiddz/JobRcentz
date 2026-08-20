'use server';

import { after } from 'next/server';
import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

import { notifyNewMessage } from '@/server/actions/dashboard/notifications/notificationTemplates';

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

    const participant =
      await prisma.conversationParticipant.findUnique({
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
      const replyTarget =
        await prisma.message.findFirst({
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
          error:
            'The message you are replying to no longer exists.'
        };
      }
    }

    /*
     * The message itself is the critical operation.
     *
     * Once this succeeds, the sender should not have to wait
     * for notification generation before seeing the message.
     */
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

    /*
     * Notification generation happens after the response work
     * has completed. It is deliberately removed from the
     * critical message-send path.
     */
    after(async () => {
      try {
        const [recipientParticipants, sender] =
          await Promise.all([
            prisma.conversationParticipant.findMany({
              where: {
                conversationId,
                userId: {
                  not: user.id
                }
              },
              select: {
                userId: true
              }
            }),

            prisma.user.findUnique({
              where: {
                id: user.id
              },
              select: {
                name: true,
                email: true
              }
            })
          ]);

        if (recipientParticipants.length === 0) {
          return;
        }

        const senderName =
          sender?.name?.trim() ||
          sender?.email ||
          'Someone';

        const messagePreview =
          message ||
          (attachments.length > 0
            ? `Sent ${
                attachments.length === 1
                  ? 'an attachment'
                  : `${attachments.length} attachments`
              }.`
            : 'You received a new message.');

        await Promise.all(
          recipientParticipants.map(recipient =>
            notifyNewMessage({
              userId: recipient.userId,
              conversationId,
              senderName,
              messagePreview
            })
          )
        );

        revalidatePath('/dashboard/notifications');
      } catch (error) {
        /*
         * Notification failure must not invalidate a message
         * that has already been successfully saved.
         */
        console.error(
          'Failed to create message notification:',
          error
        );
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