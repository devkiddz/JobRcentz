'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

const employerStatuses = [
  'PENDING',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW',
  'REJECTED',
  'HIRED'
] as const;

type EmployerApplicationStatus = (typeof employerStatuses)[number];

type UpdateApplicationStatusResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function updateApplicationStatus(
  applicationId: string,
  status: string
): Promise<UpdateApplicationStatusResult> {
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

    if (!employerStatuses.includes(status as EmployerApplicationStatus)) {
      return {
        success: false,
        error: 'Invalid application status.'
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
        status: true
      }
    });

    if (!application) {
      return {
        success: false,
        error: 'Application not found.'
      };
    }

    if (application.status === 'WITHDRAWN') {
      return {
        success: false,
        error: 'A withdrawn application cannot be changed by the employer.'
      };
    }

    await prisma.application.update({
      where: {
        id: application.id
      },
      data: {
        status: status as EmployerApplicationStatus
      }
    });

    // Global employer application list
    revalidatePath('/dashboard/employer/applications');

    // Individual employer application
    revalidatePath(
      `/dashboard/employer/applications/${application.id}`
    );

    // Applications belonging to this specific job
    revalidatePath(
      `/dashboard/employer/jobs/${application.jobId}/applications`
    );

    // The job page displays the application count/status summary.
    revalidatePath(
      `/dashboard/employer/jobs/${application.jobId}`
    );

    return {
      success: true
    };
  } catch (error) {
    console.error('updateApplicationStatus failed:', error);

    return {
      success: false,
      error: 'Something went wrong while updating the application.'
    };
  }
}