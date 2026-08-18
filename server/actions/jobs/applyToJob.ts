'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function applyToJob(
  jobId: string,
  formData: FormData
) {
  const user = await requireAuth();

  /*
   * Better Auth's session user does not contain our
   * application-specific role, so read it from Prisma.
   */
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!dbUser) {
    throw new Error('User account not found.');
  }

  if (dbUser.role !== 'JOB_SEEKER') {
    throw new Error(
      'Only job seeker accounts can apply for jobs.'
    );
  }

  /*
   * Job seeker profile is required before applying.
   */
  const profile = await prisma.jobSeekerProfile.findUnique({
    where: {
      userId: dbUser.id
    },
    select: {
      id: true,
      onboardingStatus: true,
      cvUrl: true,
      cvName: true
    }
  });

  if (!profile) {
    throw new Error(
      'Complete your job seeker profile before applying.'
    );
  }

  if (profile.onboardingStatus !== 'APPROVED') {
    throw new Error(
      'Your job seeker profile must be approved before you can apply.'
    );
  }

  /*
   * Find the job.
   */
  const job = await prisma.job.findUnique({
    where: {
      id: jobId
    },
    select: {
      id: true,
      status: true,
      postedById: true
    }
  });

  if (!job) {
    throw new Error('Job not found.');
  }

  if (job.status !== 'PUBLISHED') {
    throw new Error(
      'This job is no longer accepting applications.'
    );
  }

  /*
   * Defensive ownership check.
   */
  if (job.postedById === dbUser.id) {
    throw new Error(
      'You cannot apply to your own job listing.'
    );
  }

  /*
   * Prisma already protects this at the database level with:
   *
   * @@unique([jobId, applicantId])
   *
   * We check first so the user gets a useful message.
   */
  const existingApplication =
    await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId: dbUser.id
        }
      },
      select: {
        id: true,
        status: true
      }
    });

  if (existingApplication) {
    throw new Error(
      'You have already applied for this job.'
    );
  }

  const coverLetter = String(
    formData.get('coverLetter') ?? ''
  ).trim();

  /*
   * CV is currently inherited from the job seeker profile.
   *
   * We can add application-specific CV uploads later,
   * but the Application model already supports cvUrl/cvName.
   */
  if (!profile.cvUrl) {
    throw new Error(
      'Upload a CV to your profile before applying.'
    );
  }

  if (coverLetter.length > 5000) {
    throw new Error(
      'Cover letter must not exceed 5,000 characters.'
    );
  }

  const application = await prisma.application.create({
    data: {
      jobId,
      applicantId: dbUser.id,
      jobSeekerProfileId: profile.id,

      status: 'PENDING',

      coverLetter: coverLetter || null,

      cvUrl: profile.cvUrl,
      cvName: profile.cvName
    },
    select: {
      id: true,
      status: true,
      appliedAt: true
    }
  });

  return {
    success: true,
    application
  };
}