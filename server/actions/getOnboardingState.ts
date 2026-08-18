'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getOnboardingState() {
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

  const [jobSeeker, company] = await Promise.all([
    prisma.jobSeekerProfile.findUnique({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        onboardingStatus: true
      }
    }),

    prisma.companyProfile.findUnique({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        onboardingStatus: true
      }
    })
  ]);

  return {
    user: dbUser,
    jobSeeker,
    company
  };
}

export type OnboardingState = Awaited<
  ReturnType<typeof getOnboardingState>
>;