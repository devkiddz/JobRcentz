'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type SubmitJobResult =
  | {
      success: true;
      jobId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function submitJobForReview(
  jobId: string
): Promise<SubmitJobResult> {
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
            id: true,
            onboardingStatus: true
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

    if (dbUser.company.onboardingStatus !== 'APPROVED') {
      return {
        success: false,
        error: 'Your company profile must be approved first.'
      };
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        companyId: dbUser.company.id
      },
      select: {
        id: true,
        status: true,
        approvalStatus: true,
        expiresAt: true
      }
    });

    if (!job) {
      return {
        success: false,
        error: 'Job not found.'
      };
    }

    if (job.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Only draft jobs can be submitted for review.'
      };
    }

    if (job.approvalStatus !== 'PENDING') {
      return {
        success: false,
        error: 'This job is not ready for submission.'
      };
    }

    if (!job.expiresAt) {
      return {
        success: false,
        error: 'An expiry date is required before submitting the job.'
      };
    }

    if (job.expiresAt <= new Date()) {
      return {
        success: false,
        error: 'The expiry date must be in the future.'
      };
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: job.id
      },
      data: {
        status: 'PUBLISHED',
        approvalStatus: 'PENDING',

        publishedAt: null,
        approvedAt: null,
        rejectedAt: null,
        rejectionReason: null
      },
      select: {
        id: true
      }
    });

    revalidatePath('/dashboard/employer/jobs');
    revalidatePath('/dashboard/employer/jobs/drafts');
    revalidatePath('/dashboard/employer/jobs/pending');
    revalidatePath('/dashboard/employer/jobs/rejected');
    revalidatePath(`/dashboard/employer/jobs/${job.id}`);
    revalidatePath('/admin/jobs');
    revalidatePath(`/admin/jobs/${job.id}`);

    return {
      success: true,
      jobId: updatedJob.id
    };
  } catch (error) {
    console.error('submitJobForReview failed:', error);

    return {
      success: false,
      error: 'Something went wrong while submitting the job for review.'
    };
  }
}