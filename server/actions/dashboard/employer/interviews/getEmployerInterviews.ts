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
    include: {
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
          assignedToId: true
        }
      },
      evaluations: {
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          evaluatorId: true,
          overallScore: true,
          recommendation: true,
          strengths: true,
          weaknesses: true,
          feedback: true,
          createdAt: true,
          evaluator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          criteria: {
            select: {
              id: true,
              name: true,
              score: true,
              feedback: true
            }
          }
        }
      },
      events: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 20,
        select: {
          id: true,
          type: true,
          actorId: true,
          metadata: true,
          createdAt: true
        }
      },
      _count: {
        select: {
          tasks: true,
          participants: true,
          evaluations: true,
          events: true
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