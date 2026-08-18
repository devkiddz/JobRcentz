'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getCurrentUser() {
  const authUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,

      jobSeeker: {
        select: {
          headline: true,
          currentRole: true,
          location: true,
          yearsOfExperience: true,
          profilePhotoUrl: true,
          onboardingStatus: true
        }
      },

      company: {
        select: {
          companyName: true,
          companyLogoUrl: true,
          companyIndustry: true,
          companyLocation: true,
          companyWebsite: true,
          onboardingStatus: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User account not found.');
  }

  return user;
}

export type CurrentUser = Awaited<
  ReturnType<typeof getCurrentUser>
>;