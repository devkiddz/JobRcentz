'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekerInterviews() {
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

  if (dbUser.role !== 'JOB_SEEKER') {
    throw new Error('Job seeker account required.');
  }

  const interviews = await prisma.interview.findMany({
    where: {
      candidateId: user.id
    },

    orderBy: {
      scheduledAt: 'asc'
    },

    select: {
      id: true,
      title: true,
      description: true,

      type: true,
      status: true,
      outcome: true,

      scheduledAt: true,
      startedAt: true,
      endedAt: true,
      durationMinutes: true,
      timezone: true,

      meetingProvider: true,
      meetingUrl: true,
      meetingId: true,

      location: true,

      notes: true,

      cancellationReason: true,
      cancelledAt: true,

      rescheduledFromId: true,

      createdAt: true,
      updatedAt: true,

      job: {
        select: {
          id: true,
          title: true,
          location: true,
          workMode: true,
          employmentType: true,

          company: {
            select: {
              id: true,
              companyName: true,
              companyLogoUrl: true,
              companyLocation: true
            }
          }
        }
      },

      application: {
        select: {
          id: true,
          status: true,
          appliedAt: true,
          coverLetter: true,
          cvUrl: true,
          cvName: true
        }
      },

      participants: {
        select: {
          id: true,
          userId: true,
          role: true,
          joinedAt: true,
          leftAt: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },

      tasks: {
        where: {
          assignedToId: user.id
        },

        orderBy: {
          createdAt: 'asc'
        },

        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueAt: true,
          startedAt: true,
          completedAt: true,
          assignedToId: true,
          createdAt: true,
          updatedAt: true
        }
      },

      notesEntries: {
        where: {
          visibility: 'SHARED'
        },

        orderBy: {
          createdAt: 'desc'
        },

        select: {
          id: true,
          body: true,
          visibility: true,
          createdAt: true,
          updatedAt: true,

          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      },

      sessions: {
        orderBy: {
          startedAt: 'desc'
        },

        select: {
          id: true,
          type: true,
          provider: true,
          externalSessionId: true,
          startedAt: true,
          endedAt: true,
          status: true,
          recordingUrl: true,
          transcriptUrl: true,
          createdAt: true,
          updatedAt: true
        }
      },

      _count: {
        select: {
          tasks: true,
          participants: true,
          notesEntries: true,
          sessions: true
        }
      }
    }
  });

  return {
    user: dbUser,
    interviews
  };
}

export type JobSeekerInterviewsData = Awaited<
  ReturnType<typeof getJobSeekerInterviews>
>;