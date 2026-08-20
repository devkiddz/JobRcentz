'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import { notifyApplicationStatusChanged } from '@/server/actions/dashboard/notifications/notificationTemplates';

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
  | { success: true }
  | { success: false; error: string };

export async function updateApplicationStatus(
  applicationId: string,
  status: string
): Promise<UpdateApplicationStatusResult> {
  try {
    const user = await requireAuth();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
        company: {
          select: { id: true }
        }
      }
    });

    if (!dbUser) {
      return { success: false, error: 'User account not found.' };
    }

    if (dbUser.role !== 'EMPLOYER') {
      return { success: false, error: 'Employer account required.' };
    }

    if (!dbUser.company) {
      return { success: false, error: 'Company profile not found.' };
    }

    if (!employerStatuses.includes(status as EmployerApplicationStatus)) {
      return { success: false, error: 'Invalid application status.' };
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
        status: true,
        job: {
          select: {
            title: true
          }
        }
      }
    });

    if (!application) {
      return { success: false, error: 'Application not found.' };
    }

    if (application.status === 'WITHDRAWN') {
      return {
        success: false,
        error: 'A withdrawn application cannot be changed by the employer.'
      };
    }

    const nextStatus = status as EmployerApplicationStatus;

    if (application.status === nextStatus) {
      return { success: true };
    }

    await prisma.application.update({
      where: { id: application.id },
      data: { status: nextStatus }
    });

    await notifyApplicationStatusChanged({
      userId: application.applicantId,
      applicationId: application.id,
      jobTitle: application.job.title,
      status: nextStatus
    });

    revalidatePath('/dashboard/employer/applications');
    revalidatePath(`/dashboard/employer/applications/${application.id}`);
    revalidatePath(
      `/dashboard/employer/jobs/${application.jobId}/applications`
    );
    revalidatePath(`/dashboard/employer/jobs/${application.jobId}`);
    revalidatePath('/dashboard/applications');

    return { success: true };
  } catch (error) {
    console.error('updateApplicationStatus failed:', error);

    return {
      success: false,
      error: 'Something went wrong while updating the application.'
    };
  }
}
