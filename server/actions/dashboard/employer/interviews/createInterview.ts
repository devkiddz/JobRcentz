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

  const durationMinutes =
    input.durationMinutes !== undefined
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

  if (
    input.type === 'ONLINE' &&
    input.meetingProvider !== 'INTERNAL' &&
    !input.meetingUrl?.trim()
  ) {
    throw new Error('Meeting URL is required for an online interview.');
  }

  if (input.type === 'IN_PERSON' && !input.location?.trim()) {
    throw new Error(
      'Interview location is required for an in-person interview.'
    );
  }

  /*
   * Fetch the actual application owner from the database.
   *
   * requireAuth() gives us the authenticated session user,
   * but its user type intentionally does not contain our custom
   * Prisma role/company fields.
   */
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

  /*
   * At this point TypeScript knows that company can still be null,
   * so explicitly guard it before accessing company.id/name.
   */
  const company = dbUser.company;

  if (!company) {
    throw new Error('Company profile not found.');
  }

  /*
   * Make sure the employer actually owns the application.
   *
   * The application is reached through its job -> company relationship.
   * This prevents an employer from manually submitting another
   * application's ID.
   */
  const application = await prisma.application.findFirst({
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
    throw new Error('Application not found.');
  }

  /*
   * Prevent accidentally creating multiple interviews for the same
   * application while the application is already in an interview stage.
   *
   * We deliberately check existing records instead of relying only
   * on application.status because the database allows multiple
   * Interview records for an application.
   */
  const existingInterview = await prisma.interview.findFirst({
    where: {
      applicationId: application.id,
      status: {
        not: 'CANCELLED'
      }
    },
    select: {
      id: true
    }
  });

  if (existingInterview) {
    throw new Error(
      'An active interview already exists for this application.'
    );
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
        message: `${company.companyName} has scheduled an interview with you for ${application.job.title}.`,
        href: `/dashboard/interviews/${createdInterview.id}`
      }
    });

    return createdInterview;
  });

  return {
    success: true,
    interviewId: interview.id
  };
}