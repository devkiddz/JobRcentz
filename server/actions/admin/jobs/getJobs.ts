'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getAdminJobs() {
  const user = await requireAuth();

  const admin = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      role: true
    }
  });

  if (!admin || admin.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return prisma.job.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      status: true,
      approvalStatus: true,
      createdAt: true,
      publishedAt: true,
      expiresAt: true,

      company: {
        select: {
          companyName: true,
          companyLocation: true
        }
      },

      postedBy: {
        select: {
          name: true,
          email: true
        }
      },

      _count: {
        select: {
          applications: true
        }
      }
    }
  });
}