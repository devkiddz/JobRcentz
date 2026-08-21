'use server';

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

export async function createInterview(input: CreateInterviewInput) {
  const user = await requireAuth();

  if (user.role !== 'EMPLOYER') {
    throw new Error('Employer account required.');
  }

  if (!input.applicationId) {
    throw new Error('Application is required.');
  }

  if (!input.scheduledAt) {
    throw new Error('Interview date and time are required.');
  }

  const scheduledAt = new Date(input.scheduledAt);

  if (Number.isNaN(scheduledAt.getTime())) {
    throw new Error('Invalid interview date and time.');
  }

  if (scheduledAt.getTime() <= Date.now()) {
    throw new Error('Interview must be scheduled for a future date and time.');
  }

  const durationMinutes = input.durationMinutes
    ? Number(input.durationMinutes)
    : undefined;

  if (
    durationMinutes !== undefined &&
    (!Number.isInteger(durationMinutes) || durationMinutes <= 0)
  ) {
    throw new Error('Interview duration must be a positive whole number.');
  }

  if (input.type === 'ONLINE' && !input.meetingProvider) {
    throw new Error('Meeting provider is required for an online interview.');
  }

  if (input.type === 'ONLINE' && input.meetingProvider !== 'INTERNAL' && !input.meetingUrl) {
    throw new Error('Meeting URL is required for an online interview.');
  }

  if (input.type === 'IN_PERSON' && !input.location?.trim()) {
    throw new Error('Interview location is required for an in-person interview.');
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
    throw new Error('User account not found.');
  }

  if (dbUser.role !== 'EMPLOYER') {
    throw new Error('Employer account required.');
  }

  if (!dbUser.company) {
    throw new Error('Company profile not found.');
  }

  const application = await prisma.application.findFirst({
    where: {
      id: input.applicationId,
      job: {
        companyId: dbUser.company.id
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
    throw new Error('Application not found.');
  }

  const interview = await prisma.$transaction(async tx => {
    const createdInterview = await tx.interview.create({
      data: {
        jobId: application.jobId,
        applicationId: application.id,

        employerId: dbUser.id,
        candidateId: application.applicantId,

        type: input.type,
        status: 'SCHEDULED',
        outcome: 'PENDING',

        title: input.title?.trim() || null,
        description: input.description?.trim() || null,

        scheduledAt,
        durationMinutes: durationMinutes ?? null,

        timezone: input.timezone?.trim() || 'Africa/Lagos',

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
            ? input.meetingPasscode?.trim() || null
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
              source: 'EMPLOYER_APPLICATION'
            }
          }
        }
      }
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
        message: `${dbUser.company.companyName} has scheduled an interview with you for ${application.job.title}.`
      }
    });

    return createdInterview;
  });

  return {
    success: true,
    interviewId: interview.id
  };
}