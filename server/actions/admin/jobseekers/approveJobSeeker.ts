'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/server/auth/requireAdmin';
import { prisma } from '@/server/db/prisma';

export async function approveJobSeeker(jobSeekerId: string) {
  try {
    await requireAdmin();

    const jobSeeker = await prisma.jobSeekerProfile.findUnique({
      where: {
        id: jobSeekerId
      },
      select: {
        id: true,
        onboardingStatus: true
      }
    });

    if (!jobSeeker) {
      return {
        success: false,
        error: 'Job seeker not found.'
      };
    }

    if (jobSeeker.onboardingStatus === 'APPROVED') {
      return {
        success: false,
        error: 'This job seeker is already approved.'
      };
    }

    await prisma.jobSeekerProfile.update({
      where: {
        id: jobSeekerId
      },
      data: {
        onboardingStatus: 'APPROVED'
      }
    });

    revalidatePath('/admin/jobseekers');
    revalidatePath(`/admin/jobseekers/${jobSeekerId}`);

    return {
      success: true
    };
  } catch (error) {
    console.error('approveJobSeeker failed:', error);

    return {
      success: false,
      error: 'Something went wrong while approving the job seeker.'
    };
  }
}