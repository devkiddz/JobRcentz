'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getConversations() {
  const user = await requireAuth();

  return prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: user.id
        }
      }
    },

    orderBy: {
      updatedAt: 'desc'
    },

    select: {
      id: true,
      type: true,
      updatedAt: true,

      participants: {
        where: {
          userId: {
            not: user.id
          }
        },

        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,

              jobSeeker: {
                select: {
                  profilePhotoUrl: true
                }
              },

              company: {
                select: {
                  companyLogoUrl: true
                }
              }
            }
          }
        }
      },

      messages: {
        orderBy: {
          createdAt: 'desc'
        },

        take: 1,

        select: {
          id: true,
          body: true,
          createdAt: true,
          senderId: true,
          deletedAt: true
        }
      }
    }
  });
}