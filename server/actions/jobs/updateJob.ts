
'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

import { parseJobForm } from './jobForm';
import { getEditLifecycle } from './jobEditLifecycle';

type UpdateJobResult =
  | {
      success: true;
      jobId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function updateJob(
  jobId: string,
  formData: FormData
): Promise<UpdateJobResult> {
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

    const existingJob = await prisma.job.findFirst({
      where: {
        id: jobId,
        companyId: dbUser.company.id
      },
      select: {
        id: true,
        status: true,
        approvalStatus: true
      }
    });

    if (!existingJob) {
      return {
        success: false,
        error: 'Job not found.'
      };
    }

    const values = parseJobForm(formData);
    const lifecycle = getEditLifecycle(existingJob);

    const updatedJob = await prisma.job.update({
      where: {
        id: existingJob.id
      },
      data: {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        location: values.location,
        workMode: values.workMode,
        employmentType: values.employmentType,
        salaryMin: values.salaryMin,
        salaryMax: values.salaryMax,
        salaryCurrency: values.salaryCurrency,
        skills: values.skills,
        expiresAt: values.expiresAt,

        status: lifecycle.status,
        approvalStatus: lifecycle.approvalStatus,
        publishedAt: lifecycle.publishedAt,
        approvedAt: lifecycle.approvedAt,
        rejectedAt: lifecycle.rejectedAt
      },
      select: {
        id: true
      }
    });

    revalidatePath('/dashboard/jobs');
    revalidatePath(`/dashboard/jobs/${jobId}/edit`);
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath('/jobs');

    return {
      success: true,
      jobId: updatedJob.id
    };
  } catch (error) {
    console.error('updateJob failed:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong while updating the job.'
    };
  }
}