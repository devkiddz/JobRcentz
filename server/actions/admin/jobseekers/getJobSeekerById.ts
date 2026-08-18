import { requireAdmin } from '@/server/auth/requireAdmin';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekerById(id: string) {
  await requireAdmin();

  return prisma.jobSeekerProfile.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      userId: true,
      headline: true,
      location: true,
      bio: true,
      currentRole: true,
      yearsOfExperience: true,
      skills: true,
      portfolio: true,
      linkedin: true,
      github: true,
      x: true,
      profilePhotoUrl: true,
      cvUrl: true,
      cvName: true,
      onboardingStatus: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true
        }
      },

      applications: {
        orderBy: {
          appliedAt: 'desc'
        },
        select: {
          id: true,
          status: true,
          appliedAt: true,
          job: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  companyName: true
                }
              }
            }
          }
        }
      }
    }
  });
}