'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import { notifyNewApplication } from '@/server/actions/dashboard/notifications/notificationTemplates';

export async function applyToJob(jobId: string, formData: FormData) {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, role: true }
  });

  if (!dbUser) throw new Error('User account not found.');

  if (dbUser.role !== 'JOB_SEEKER') {
    throw new Error('Only job seeker accounts can apply for jobs.');
  }

  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { userId: dbUser.id },
    select: {
      id: true,
      onboardingStatus: true,
      cvUrl: true,
      cvName: true
    }
  });

  if (!profile) {
    throw new Error('Complete your job seeker profile before applying.');
  }

  if (profile.onboardingStatus !== 'APPROVED') {
    throw new Error(
      'Your job seeker profile must be approved before you can apply.'
    );
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      status: true,
      postedById: true
    }
  });

  if (!job) throw new Error('Job not found.');

  if (job.status !== 'PUBLISHED') {
    throw new Error('This job is no longer accepting applications.');
  }

  if (job.postedById === dbUser.id) {
    throw new Error('You cannot apply to your own job listing.');
  }

  const existingApplication = await prisma.application.findUnique({
    where: {
      jobId_applicantId: {
        jobId,
        applicantId: dbUser.id
      }
    },
    select: { id: true }
  });

  if (existingApplication) {
    throw new Error('You have already applied for this job.');
  }

  const coverLetter = String(formData.get('coverLetter') ?? '').trim();

  if (!profile.cvUrl) {
    throw new Error('Upload a CV to your profile before applying.');
  }

  if (coverLetter.length > 5000) {
    throw new Error('Cover letter must not exceed 5,000 characters.');
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

  await notifyNewApplication({
    userId: job.postedById,
    applicationId: application.id,
    jobId: job.id,
    jobTitle: job.title,
    candidateName: user.name?.trim() || user.email
  });

  revalidatePath('/dashboard/applications');
  revalidatePath('/dashboard/employer/applications');
  revalidatePath(`/dashboard/employer/jobs/${job.id}/applications`);

  return {
    success: true,
    application
  };
}
