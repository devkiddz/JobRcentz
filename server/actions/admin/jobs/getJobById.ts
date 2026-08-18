'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobById(id: string) {
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
    throw new Error('Unauthorized');
  }

  return prisma.job.findUnique({
    where: {
      id
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

      company: {
        select: {
          id: true,
          companyName: true,
          companyIndustry: true,
          companyDescription: true,
          companyLocation: true,
          companyAddress: true,
          companyWebsite: true,
          companyContactEmail: true,
          companyContactPhone: true,
          companyLogoUrl: true,
          onboardingStatus: true
        }
      },

      postedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      },

      applications: {
        select: {
          id: true,
          status: true,
          appliedAt: true
        },
        orderBy: {
          appliedAt: 'desc'
        }
      }
    }
  });
}