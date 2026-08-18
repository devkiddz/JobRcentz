
'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerJobById(id: string) {
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

  const job = await prisma.job.findFirst({
    where: {
      id,
      companyId: company.id
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
      approvedAt: true,
      rejectedAt: true,

      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          applications: true
        }
      }
    }
  });

  if (!job) {
    return null;
  }

  return {
    user: dbUser,
    company,
    job
  };
}