'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export type EmployerJobFilter =
  | 'ALL'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'PENDING'
  | 'REJECTED';

export async function getEmployerJobs(
  filter: EmployerJobFilter = 'ALL'
) {
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

  const where = {
    companyId: company.id,
    ...(filter === 'DRAFT'
      ? {
          status: 'DRAFT' as const
        }
      : filter === 'PUBLISHED'
        ? {
            status: 'PUBLISHED' as const,
            approvalStatus: 'APPROVED' as const
          }
        : filter === 'PENDING'
          ? {
              status: 'PUBLISHED' as const,
              approvalStatus: 'PENDING' as const
            }
          : filter === 'REJECTED'
            ? {
                status: 'PUBLISHED' as const,
                approvalStatus: 'REJECTED' as const
              }
            : {})
  };

  const jobs = await prisma.job.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
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