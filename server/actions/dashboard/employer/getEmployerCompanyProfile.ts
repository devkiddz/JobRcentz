'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerCompanyProfile() {
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
      role: true,

      company: {
        select: {
          id: true,
          userId: true,

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
          companyLogoPublicId: true,

          bannerUrl: true,
          bannerPublicId: true,

          onboardingStatus: true,
          isDiscoverable: true,
          profileViews: true,
          visibility: true,

          createdAt: true,
          updatedAt: true
        }
      }
    }
  });

  if (!dbUser) {
    throw new Error('User account not found.');
  }

  if (dbUser.role !== 'EMPLOYER') {
    throw new Error('Employer account required.');
  }

  if (!dbUser.company) {
    throw new Error('Company profile not found.');
  }

  return {
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      image: dbUser.image,
      role: dbUser.role
    },

    company: dbUser.company
  };
}

export type EmployerCompanyProfileData = Awaited<
  ReturnType<typeof getEmployerCompanyProfile>
>;