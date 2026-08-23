'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekerGallery() {
  const authUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id
    },

    select: {
      id: true,
      role: true,

      jobSeeker: {
        select: {
          id: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User account not found.');
  }

  if (user.role !== 'JOB_SEEKER') {
    throw new Error('This dashboard is only available to job seekers.');
  }

  if (!user.jobSeeker) {
    throw new Error('Job seeker profile not found.');
  }

  return prisma.jobSeekerGalleryImage.findMany({
    where: {
      profileId: user.jobSeeker.id
    },

    orderBy: [
      {
        sortOrder: 'asc'
      },
      {
        createdAt: 'desc'
      }
    ],

    select: {
      id: true,
      url: true,
      alt: true,
      caption: true,
      sortOrder: true,
      createdAt: true
    }
  });
}

export type JobSeekerGalleryData = Awaited<
  ReturnType<typeof getJobSeekerGallery>
>;