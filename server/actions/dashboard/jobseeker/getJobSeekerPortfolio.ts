'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekerPortfolio() {
  const authUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id
    },

    select: {
      id: true,
      role: true,

      jobSeeker: {
        select: {
          id: true
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

  return prisma.portfolioProject.findMany({
    where: {
      profileId: user.jobSeeker.id
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
      slug: true,
      description: true,
      category: true,
      skills: true,

      projectUrl: true,
      githubUrl: true,

      coverImageUrl: true,
      previewImageUrl: true,
      previewImageSource: true,

      visibility: true,
      status: true,
      featured: true,

      likesCount: true,
      commentsCount: true,
      ratingCount: true,
      averageRating: true,
      viewsCount: true,

      publishedAt: true,
      createdAt: true,
      updatedAt: true,

      images: {
        orderBy: {
          sortOrder: 'asc'
        },

        select: {
          id: true,
          url: true,
          alt: true,
          caption: true,
          sortOrder: true
        }
      }
    }
  });
}

export type JobSeekerPortfolioData = Awaited<
  ReturnType<typeof getJobSeekerPortfolio>
>;