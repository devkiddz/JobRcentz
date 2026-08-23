
'use server';

import {
  InterviewStatus,
  UserRole
} from '@/lib/generated/prisma/browser';

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
          userId: true,

          headline: true,
          location: true,
          bio: true,

          currentRole: true,
          yearsOfExperience: true,

          skills: true,

          linkedin: true,
          github: true,
          x: true,

          profilePhotoUrl: true,
          profilePhotoPublicId: true,

          cvUrl: true,
          cvName: true,

          bannerUrl: true,
          bannerPublicId: true,

          onboardingStatus: true,

          averageRating: true,
          ratingCount: true,

          isAvailable: true,
          isDiscoverable: true,

          profileViews: true,
          visibility: true,

          createdAt: true,
          updatedAt: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User account not found.');
  }

  if (user.role !== UserRole.JOB_SEEKER) {
    throw new Error('This dashboard is only available to job seekers.');
  }

  if (!user.jobSeeker) {
    throw new Error('Job seeker profile not found.');
  }

  const profileId = user.jobSeeker.id;

  const now = new Date();

  const [
    applicationCount,
    savedJobCount,
    portfolioProjectCount,
    upcomingInterviewCount,
    recentApplications,
    portfolioProjects
  ] = await Promise.all([
    /* Applications */

    prisma.application.count({
      where: {
        applicantId: user.id
      }
    }),

    /* Saved jobs */

    prisma.savedJob.count({
      where: {
        userId: user.id
      }
    }),

    /* Portfolio count */

    prisma.portfolioProject.count({
      where: {
        profileId
      }
    }),

    /* Upcoming interviews */

    prisma.interview.count({
      where: {
        candidateId: user.id,

        scheduledAt: {
          gte: now
        },

        status: {
          in: [
            InterviewStatus.SCHEDULED,
            InterviewStatus.RESCHEDULED
          ]
        }
      }
    }),

    /* Recent applications */

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
    }),

    /* Portfolio */

    prisma.portfolioProject.findMany({
      where: {
        profileId
      },

      orderBy: [
        {
          featured: 'desc'
        },
        {
          updatedAt: 'desc'
        }
      ],

      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        skills: true,
        projectUrl: true,
        githubUrl: true,
        likesCount: true,
        commentsCount: true,
        status: true,
        visibility: true,
        featured: true
      }
    })
  ]);

  /*
   * Profile completion.
   *
   * This is intentionally calculated here rather than stored
   * in the database. Completion is derived data.
   */

  const profileFields = [
    user.jobSeeker.headline,
    user.jobSeeker.location,
    user.jobSeeker.bio,
    user.jobSeeker.currentRole,
    user.jobSeeker.yearsOfExperience,
    user.jobSeeker.skills.length > 0 ? true : null,
    user.jobSeeker.linkedin,
    user.jobSeeker.github,
    user.jobSeeker.profilePhotoUrl,
    user.jobSeeker.bannerUrl,
    user.jobSeeker.cvUrl
  ];

  const completedFields = profileFields.filter(
    value =>
      value !== null &&
      value !== undefined &&
      value !== '' &&
      value !== false
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role
    },

    profile: {
      ...user.jobSeeker,
      profileCompletion
    },

    stats: {
      applications: applicationCount,
      savedJobs: savedJobCount,
      profileViews: user.jobSeeker.profileViews,
      portfolioProjects: portfolioProjectCount,
      upcomingInterviews: upcomingInterviewCount
    },

    recentApplications,

    portfolioProjects
  };
}

export type JobSeekerDashboardData =
  Awaited<ReturnType<typeof getJobSeekerDashboard>>;