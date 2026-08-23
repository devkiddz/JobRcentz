'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekerJobs() {
  const authUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!user) {
    throw new Error('User account not found.');
  }

  if (user.role !== 'JOB_SEEKER') {
    throw new Error('This dashboard is only available to job seekers.');
  }

  const savedJobs = await prisma.savedJob.findMany({
    where: {
      userId: user.id
    },

    orderBy: {
      createdAt: 'desc'
    },

    select: {
      id: true,
      createdAt: true,

      job: {
        select: {
          id: true,
          title: true,
          description: true,
          requirements: true,
          location: true,
          workMode: true,
          employmentType: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          skills: true,
          status: true,
          publishedAt: true,
          expiresAt: true,

          company: {
            select: {
              id: true,
              companyName: true,
              companyLogoUrl: true,
              companyLocation: true,
              companyIndustry: true
            }
          }
        }
      }
    }
  });

  return savedJobs.map(savedJob => ({
    ...savedJob,

    job: {
      ...savedJob.job,

      salaryMin: savedJob.job.salaryMin?.toString() ?? null,
      salaryMax: savedJob.job.salaryMax?.toString() ?? null
    }
  }));
}

export type JobSeekerJobsData = Awaited<
  ReturnType<typeof getJobSeekerJobs>
>;