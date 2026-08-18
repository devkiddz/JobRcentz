import { requireAdmin } from '@/server/auth/requireAdmin';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekers() {
  await requireAdmin();

  return prisma.jobSeekerProfile.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      userId: true,
      headline: true,
      location: true,
      onboardingStatus: true,
      profilePhotoUrl: true,
      currentRole: true,
      yearsOfExperience: true,
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
          applications: true,
          savedJobs: true
        }
      }
    }
  });
}