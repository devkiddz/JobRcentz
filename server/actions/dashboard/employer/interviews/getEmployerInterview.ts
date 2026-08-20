
'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerInterview(interviewId: string) {
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

  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
      employerId: user.id
    },

    include: {
      job: {
        select: {
          id: true,
          title: true,
          description: true,
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
              currentRole: true,
              yearsOfExperience: true,
              profilePhotoUrl: true,
              cvUrl: true,
              cvName: true,
              skills: true
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
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      },

      notesEntries: {
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          body: true,
          visibility: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
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
          metadata: true,
          createdAt: true,
          updatedAt: true,
          evaluator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
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
          recordingUrl: true,
          transcriptUrl: true,
          status: true,
          metadata: true,
          createdAt: true,
          updatedAt: true
        }
      },

      events: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 50,
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
          notesEntries: true,
          evaluations: true,
          sessions: true,
          events: true
        }
      }
    }
  });

  if (!interview) {
    throw new Error('Interview not found.');
  }

  const actorIds = [
    ...new Set(
      interview.events
        .map(event => event.actorId)
        .filter((actorId): actorId is string => Boolean(actorId))
    )
  ];

  const actors =
    actorIds.length > 0
      ? await prisma.user.findMany({
          where: {
            id: {
              in: actorIds
            }
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        })
      : [];

  const actorMap = new Map(actors.map(actor => [actor.id, actor]));

  const events = interview.events.map(event => ({
    ...event,
    actor: event.actorId ? actorMap.get(event.actorId) ?? null : null
  }));

  return {
    user: dbUser,
    interview: {
      ...interview,
      events
    }
  };
}

export type EmployerInterviewData = Awaited<
  ReturnType<typeof getEmployerInterview>
>;