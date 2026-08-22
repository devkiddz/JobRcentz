import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getPublishedJobs(filters?: { query?: string; location?: string }) {
  await requireAuth();

  const query = filters?.query?.trim();
  const location = filters?.location?.trim();

  const jobs = await prisma.job.findMany({
    where: {
      status: 'PUBLISHED',
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' as const } },
              { description: { contains: query, mode: 'insensitive' as const } },
              { skills: { has: query } }
            ]
          }
        : {}),
      ...(location ? { location: { contains: location, mode: 'insensitive' as const } } : {})
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
