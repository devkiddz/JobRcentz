import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getPendingCompanies() {
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
    throw new Error(
      'Only administrators can access company reviews.'
    );
  }

  return prisma.companyProfile.findMany({
    where: {
      onboardingStatus: 'PENDING'
    },
    orderBy: {
      createdAt: 'asc'
    },
    select: {
      id: true,
      companyName: true,
      companyIndustry: true,
      companyLocation: true,
      companyDescription: true,
      companyWebsite: true,
      companyLogoUrl: true,
      companyContactEmail: true,
      companyContactPhone: true,
      onboardingStatus: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          jobs: true
        }
      }
    }
  });
}

export type PendingCompaniesData = Awaited<
  ReturnType<typeof getPendingCompanies>
>;