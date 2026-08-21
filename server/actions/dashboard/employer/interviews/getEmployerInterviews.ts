'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerInterviews() {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  if (!dbUser) {
    throw new Error('User account not found.');
  }

  if (dbUser.role !== 'EMPLOYER') {
    throw new Error('Employer account required.');
  }

  const interviews = await prisma.interview.findMany({
    where: {
      employerId: user.id
    },
    orderBy: {
      scheduledAt: 'asc'
    },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      scheduledAt: true,
      durationMinutes: true,
      meetingUrl: true,
      meetingProvider: true,
      location: true,
      notes: true,

      job: {
        select: {
          id: true,
          title: true,
          company: {
            select: {
              id: true,
              companyName: true,
              companyLogoUrl: true
            }
          }
        }
      },

      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          jobSeeker: {
            select: {
              headline: true,
              location: true,
              profilePhotoUrl: true
            }
          }
        }
      },

      application: {
        select: {
          id: true,
          status: true,
          appliedAt: true
        }
      },

      tasks: {
        orderBy: {
          createdAt: 'asc'
        },
        select: {
          id: true,
          status: true
        }
      },

      _count: {
        select: {
          tasks: true
        }
      }
    }
  });

  return {
    user: dbUser,
    interviews
  };
}

export type EmployerInterviewsData = Awaited<
  ReturnType<typeof getEmployerInterviews>
>;