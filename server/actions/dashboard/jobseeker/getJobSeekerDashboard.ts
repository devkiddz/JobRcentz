'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekerDashboard() {
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
          id: true,
          headline: true,
          currentRole: true,
          location: true,
          yearsOfExperience: true,
          profilePhotoUrl: true,
          onboardingStatus: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User account not found.');
  }

  if (user.role !== 'JOB_SEEKER') {
    throw new Error('This dashboard is only available to job seekers.');
  }

  if (!user.jobSeeker) {
    throw new Error('Job seeker profile not found.');
  }

  const [applicationCount, savedJobCount, recentApplications] =
    await Promise.all([
      prisma.application.count({
        where: {
          applicantId: user.id
        }
      }),

      prisma.savedJob.count({
        where: {
          userId: user.id
        }
      }),

      prisma.application.findMany({
        where: {
          applicantId: user.id
        },
        orderBy: {
          appliedAt: 'desc'
        },
        take: 5,
        select: {
          id: true,
          status: true,
          appliedAt: true,

          job: {
            select: {
              id: true,
              title: true,
              location: true,
              workMode: true,
              employmentType: true,

              company: {
                select: {
                  companyName: true,
                  companyLogoUrl: true
                }
              }
            }
          }
        }
      })
    ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role
    },

    profile: user.jobSeeker,

    stats: {
      applications: applicationCount,
      savedJobs: savedJobCount
    },

    recentApplications
  };
}

export type JobSeekerDashboardData = Awaited<
  ReturnType<typeof getJobSeekerDashboard>
>;