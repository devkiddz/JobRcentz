'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type ScheduleInterviewResult =
  | {
      success: true;
      interviewId: string;
    }
  | {
      success: false;
      error: string;
    };

function isValidDate(value: string) {
  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

export async function scheduleApplicationInterview(
  applicationId: string,
  data: {
    scheduledAt: string;
    durationMinutes: number;
    meetingUrl?: string;
    location?: string;
    notes?: string;
  }
): Promise<ScheduleInterviewResult> {
  try {
    const user = await requireAuth();

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        role: true,
        company: {
          select: {
            id: true
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

    if (!dbUser.company) {
      return {
        success: false,
        error: 'Company profile not found.'
      };
    }

    if (!data.scheduledAt || !isValidDate(data.scheduledAt)) {
      return {
        success: false,
        error: 'Please provide a valid interview date and time.'
      };
    }

    const scheduledAt = new Date(data.scheduledAt);

    if (scheduledAt <= new Date()) {
      return {
        success: false,
        error: 'The interview must be scheduled for a future date and time.'
      };
    }

    if (
      !Number.isInteger(data.durationMinutes) ||
      data.durationMinutes < 15 ||
      data.durationMinutes > 240
    ) {
      return {
        success: false,
        error: 'Interview duration must be between 15 and 240 minutes.'
      };
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        job: {
          companyId: dbUser.company.id
        }
      },
      select: {
        id: true,
        jobId: true,
        applicantId: true,
        status: true
      }
    });

    if (!application) {
      return {
        success: false,
        error: 'Application not found.'
      };
    }

    if (application.status === 'REJECTED') {
      return {
        success: false,
        error: 'A rejected application cannot have an interview scheduled.'
      };
    }

    if (application.status === 'HIRED') {
      return {
        success: false,
        error: 'This candidate has already been marked as hired.'
      };
    }

    if (application.status === 'WITHDRAWN') {
      return {
        success: false,
        error: 'A withdrawn application cannot have an interview scheduled.'
      };
    }

    const interview = await prisma.interview.create({
      data: {
        jobId: application.jobId,
        applicationId: application.id,
        employerId: dbUser.id,
        candidateId: application.applicantId,
        status: 'SCHEDULED',
        scheduledAt,
        durationMinutes: data.durationMinutes,
        meetingUrl: data.meetingUrl?.trim() || null,
        location: data.location?.trim() || null,
        notes: data.notes?.trim() || null
      },
      select: {
        id: true
      }
    });

    await prisma.application.update({
      where: {
        id: application.id
      },
      data: {
        status: 'INTERVIEW'
      }
    });

    revalidatePath(`/dashboard/employer/applications/${application.id}`);

    revalidatePath(
      `/dashboard/employer/jobs/${application.jobId}/applications`
    );

    revalidatePath(`/dashboard/employer/jobs/${application.jobId}`);

    revalidatePath('/dashboard/employer/applications');

    return {
      success: true,
      interviewId: interview.id
    };
  } catch (error) {
    console.error('scheduleApplicationInterview failed:', error);

    return {
      success: false,
      error: 'Something went wrong while scheduling the interview.'
    };
  }
}