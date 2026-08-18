'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type RejectJobResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function rejectJob(
  jobId: string
): Promise<RejectJobResult> {
  try {
    const user = await requireAuth();

    const admin = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        role: true
      }
    });

    if (!admin || admin.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Unauthorized.'
      };
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId
      },
      select: {
        id: true,
        status: true,
        approvalStatus: true
      }
    });

    if (!job) {
      return {
        success: false,
        error: 'Job not found.'
      };
    }

    if (job.status !== 'PUBLISHED') {
      return {
        success: false,
        error: 'Only published jobs can be rejected.'
      };
    }

    if (job.approvalStatus === 'REJECTED') {
      return {
        success: false,
        error: 'This job has already been rejected.'
      };
    }

    await prisma.job.update({
      where: {
        id: jobId
      },
      data: {
        approvalStatus: 'REJECTED',
        rejectedAt: new Date(),
        approvedAt: null
      }
    });

    revalidatePath('/admin/jobs');
    revalidatePath(`/admin/jobs/${jobId}`);
    revalidatePath('/jobs');

    return {
      success: true
    };
  } catch (error) {
    console.error('rejectJob failed:', error);

    return {
      success: false,
      error: 'Something went wrong while rejecting the job.'
    };
  }
}