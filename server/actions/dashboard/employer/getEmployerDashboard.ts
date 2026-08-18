'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerDashboard() {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
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
      companyIndustry: true,
      companyLocation: true,
      companyDescription: true,
      companyWebsite: true,
      companyLogoUrl: true,
      onboardingStatus: true
    }
  });

  if (!company) {
    throw new Error('Company profile not found.');
  }

  const [
    totalJobs,
    publishedJobs,
    draftJobs,
    closedJobs,
    totalApplications,
    recentJobs
  ] = await Promise.all([
    prisma.job.count({
      where: {
        companyId: company.id
      }
    }),

    prisma.job.count({
      where: {
        companyId: company.id,
        status: 'PUBLISHED'
      }
    }),

    prisma.job.count({
      where: {
        companyId: company.id,
        status: 'DRAFT'
      }
    }),

    prisma.job.count({
      where: {
        companyId: company.id,
        status: 'CLOSED'
      }
    }),

    prisma.application.count({
      where: {
        job: {
          companyId: company.id
        }
      }
    }),

    prisma.job.findMany({
      where: {
        companyId: company.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        approvalStatus: true,
        location: true,
        workMode: true,
        employmentType: true,
        createdAt: true,
        publishedAt: true,
        expiresAt: true,
        _count: {
          select: {
            applications: true
          }
        }
      }
    })
  ]);

  return {
    user: dbUser,
    company,
    stats: {
      totalJobs,
      publishedJobs,
      draftJobs,
      closedJobs,
      totalApplications
    },
    recentJobs
  };
}

export type EmployerDashboardData = Awaited<
  ReturnType<typeof getEmployerDashboard>
>;