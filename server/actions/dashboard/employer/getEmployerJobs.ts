'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerJobs() {
  const user = await requireAuth();

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

  if (dbUser.role !== 'EMPLOYER') {
    throw new Error('Employer account required.');
  }

  const company = await prisma.companyProfile.findUnique({
    where: {
      userId: user.id
    },
    select: {
      id: true,
      companyName: true,
      companyLogoUrl: true
    }
  });

  if (!company) {
    throw new Error('Company profile not found.');
  }

  const jobs = await prisma.job.findMany({
    where: {
      companyId: company.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      workMode: true,
      employmentType: true,
      status: true,
      approvalStatus: true,
      publishedAt: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          applications: true
        }
      }
    }
  });

  return {
    user: dbUser,
    company,
    jobs
  };
}

export type EmployerJobsData = Awaited<
  ReturnType<typeof getEmployerJobs>
>;