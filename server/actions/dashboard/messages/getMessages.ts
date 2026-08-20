
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
    select: {
      conversationId: true
    }
  });

  if (!participant) {
    throw new Error('Conversation not found.');
  }

  return prisma.message.findMany({
    where: {
      conversationId
    },

    orderBy: {
      createdAt: 'asc'
    },

    select: {
      id: true,
      body: true,
      senderId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,

      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,

          company: {
            select: {
              companyLogoUrl: true
            }
          },

          jobSeeker: {
            select: {
              profilePhotoUrl: true
            }
          }
        }
      },

      replyTo: {
        select: {
          id: true,
          body: true,
          senderId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,

          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },

      attachments: {
        orderBy: {
          createdAt: 'asc'
        },

        select: {
          id: true,
          url: true,
          publicId: true,
          fileName: true,
          mimeType: true,
          size: true,
          resourceType: true
        }
      }
    }
  });
}