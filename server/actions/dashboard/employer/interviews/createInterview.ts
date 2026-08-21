'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export type CreateInterviewInput = {
  applicationId: string;
  type: 'IN_PERSON' | 'ONLINE' | 'AI';
  title?: string;
  description?: string;
  scheduledAt: string;
  durationMinutes?: number;
  timezone?: string;
  meetingProvider?:
    | 'INTERNAL'
    | 'ZOOM'
    | 'GOOGLE_MEET'
    | 'MICROSOFT_TEAMS'
    | 'OTHER';
  meetingUrl?: string;
  meetingId?: string;
  meetingPasscode?: string;
  location?: string;
  notes?: string;
};

export type CreateInterviewResult =
  | {
      success: true;
      interviewId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function createInterview(
  input: CreateInterviewInput
): Promise<CreateInterviewResult> {
  try {
    const user = await requireAuth();

    if (!input.applicationId?.trim()) {
      return {
        success: false,
        error: 'Application is required.'
      };
    }

    if (!input.scheduledAt?.trim()) {
      return {
        success: false,
        error: 'Interview date and time are required.'
      };
    }

    if (!['IN_PERSON', 'ONLINE', 'AI'].includes(input.type)) {
      return {
        success: false,
        error: 'Invalid interview type.'
      };
    }

    const scheduledAt = new Date(input.scheduledAt);

    if (Number.isNaN(scheduledAt.getTime())) {
      return {
        success: false,
        error: 'Invalid interview date and time.'
      };
    }

    if (scheduledAt.getTime() <= Date.now()) {
      return {
        success: false,
        error:
          'Interview must be scheduled for a future date and time.'
      };
    }

    let durationMinutes: number | null = null;

    if (input.durationMinutes !== undefined) {
      const parsedDuration = Number(input.durationMinutes);

      if (
        !Number.isInteger(parsedDuration) ||
        parsedDuration <= 0 ||
        parsedDuration > 480
      ) {
        return {
          success: false,
          error:
            'Interview duration must be between 1 and 480 minutes.'
        };
      }

      durationMinutes = parsedDuration;
    }

    if (
      input.type === 'ONLINE' &&
      !input.meetingProvider
    ) {
      return {
        success: false,
        error:
          'Meeting provider is required for an online interview.'
      };
    }

    if (
      input.meetingProvider &&
      ![
        'INTERNAL',
        'ZOOM',
        'GOOGLE_MEET',
        'MICROSOFT_TEAMS',
        'OTHER'
      ].includes(input.meetingProvider)
    ) {
      return {
        success: false,
        error: 'Invalid meeting provider.'
      };
    }

    if (
      input.type === 'ONLINE' &&
      input.meetingProvider !== 'INTERNAL' &&
      !input.meetingUrl?.trim()
    ) {
      return {
        success: false,
        error:
          'Meeting URL is required for an online interview.'
      };
    }

    if (
      input.type === 'IN_PERSON' &&
      !input.location?.trim()
    ) {
      return {
        success: false,
        error:
          'Interview location is required for an in-person interview.'
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        role: true,
        company: {
          select: {
            id: true,
            companyName: true
          }
        }
      }
    });

    if (!dbUser) {
      return {
        success: false,
        error: 'User account not found.'
      };
    }

    if (dbUser.role !== 'EMPLOYER') {
      return {
        success: false,
        error: 'Employer account required.'
      };
    }

    const company = dbUser.company;

    if (!company) {
      return {
        success: false,
        error: 'Company profile not found.'
      };
    }

    const application =
      await prisma.application.findFirst({
        where: {
          id: input.applicationId,
          job: {
            companyId: company.id
          }
        },
        select: {
          id: true,
          status: true,
          jobId: true,
          applicantId: true,

          applicant: {
            select: {
              id: true,
              name: true
            }
          },

          job: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

    if (!application) {
      return {
        success: false,
        error:
          'Application not found or you are not authorized to schedule an interview for it.'
      };
    }

    if (
      ['REJECTED', 'WITHDRAWN'].includes(
        application.status
      )
    ) {
      return {
        success: false,
        error:
          'An interview cannot be scheduled for this application.'
      };
    }

    const existingInterview =
      await prisma.interview.findFirst({
        where: {
          applicationId: application.id,
          status: {
            notIn: ['CANCELLED', 'NO_SHOW']
          }
        },
        select: {
          id: true
        }
      });

    if (existingInterview) {
      return {
        success: false,
        error:
          'An active interview already exists for this application.'
      };
    }

    const candidateName =
      application.applicant.name?.trim() || 'Candidate';

    const interviewTitle =
      input.title?.trim() ||
      `Interview with ${candidateName} — ${application.job.title}`;

    const interview = await prisma.$transaction(
      async tx => {
        const createdInterview =
          await tx.interview.create({
            data: {
              jobId: application.jobId,
              applicationId: application.id,

              employerId: dbUser.id,
              candidateId: application.applicantId,

              type: input.type,
              status: 'SCHEDULED',
              outcome: 'PENDING',

              title: interviewTitle,

              description:
                input.description?.trim() || null,

              scheduledAt,

              durationMinutes,

              timezone:
                input.timezone?.trim() ||
                'Africa/Lagos',

              meetingProvider:
                input.type === 'ONLINE'
                  ? input.meetingProvider ?? null
                  : null,

              meetingUrl:
                input.type === 'ONLINE'
                  ? input.meetingUrl?.trim() || null
                  : null,

              meetingId:
                input.type === 'ONLINE'
                  ? input.meetingId?.trim() || null
                  : null,

              meetingPasscode:
                input.type === 'ONLINE'
                  ? input.meetingPasscode?.trim() ||
                    null
                  : null,

              location:
                input.type === 'IN_PERSON'
                  ? input.location?.trim() || null
                  : null,

              notes: input.notes?.trim() || null,

              events: {
                create: {
                  type: 'CREATED',
                  actorId: dbUser.id,
                  metadata: {
                    source:
                      'EMPLOYER_APPLICATION'
                  }
                }
              }
            },
            select: {
              id: true
            }
          });

        await tx.interviewParticipant.createMany({
          data: [
            {
              interviewId: createdInterview.id,
              userId: dbUser.id,
              role: 'EMPLOYER'
            },
            {
              interviewId: createdInterview.id,
              userId: application.applicantId,
              role: 'CANDIDATE'
            }
          ]
        });

        await tx.application.update({
          where: {
            id: application.id
          },
          data: {
            status: 'INTERVIEW'
          }
        });

        await tx.notification.create({
          data: {
            userId: application.applicantId,
            type: 'INTERVIEW',
            priority: 'HIGH',
            title: 'Interview scheduled',
            message: `${company.companyName} has scheduled an interview with you for ${application.job.title}.`,
            href: `/dashboard/interviews/${createdInterview.id}`
          }
        });

        return createdInterview;
      }
    );

    revalidatePath(
      `/dashboard/employer/applications/${application.id}`
    );

    revalidatePath(
      '/dashboard/employer/applications'
    );

    revalidatePath(
      '/dashboard/employer/interviews'
    );

    revalidatePath(
      `/dashboard/employer/interviews/${interview.id}`
    );

    return {
      success: true,
      interviewId: interview.id
    };
  } catch (error) {
    console.error(
      'createInterview failed:',
      error
    );

    return {
      success: false,
      error:
        'Unable to schedule the interview. Please try again.'
    };
  }
}