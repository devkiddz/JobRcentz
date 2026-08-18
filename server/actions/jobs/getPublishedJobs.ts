import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getPublishedJobs() {
  await requireAuth();

  const jobs = await prisma.job.findMany({
    where: {
      status: 'PUBLISHED'
    },
    orderBy: {
      publishedAt: 'desc'
    },
    include: {
      company: {
        select: {
          id: true,
          companyName: true,
          companyIndustry: true,
          companyLocation: true,
          companyLogoUrl: true
        }
      },
      _count: {
        select: {
          applications: true,
          savedBy: true
        }
      }
    }
  });

  return jobs;
}

export type PublishedJobsData = Awaited<
  ReturnType<typeof getPublishedJobs>
>;