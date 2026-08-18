import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getCompanyForReview(
  companyId: string
) {
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
      'Only administrators can review companies.'
    );
  }

  return prisma.companyProfile.findUnique({
    where: {
      id: companyId
    },
    select: {
      id: true,
      companyName: true,
      companyWebsite: true,
      companySize: true,
      companyIndustry: true,
      companyDescription: true,
      companyLocation: true,
      companyAddress: true,
      companyContactEmail: true,
      companyContactPhone: true,
      companyLinkedIn: true,
      companyX: true,
      companyFacebook: true,
      companyLogoUrl: true,
      onboardingStatus: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },

      jobs: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

export type CompanyReviewData = Awaited<
  ReturnType<typeof getCompanyForReview>
>;