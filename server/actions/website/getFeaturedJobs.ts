'use server';

import { prisma } from '@/server/db/prisma';

export async function getFeaturedJobs() {
  const jobs = await prisma.job.findMany({
    where: {
      status: 'PUBLISHED'
    },

    orderBy: {
      publishedAt: 'desc'
    },

    take: 6,

    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      workMode: true,
      employmentType: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      skills: true,

      company: {
        select: {
          id: true,
          companyName: true,
          companyLogoUrl: true
        }
      }
    }
  });

  return jobs.map(job => ({
    ...job,

    /*
     * Prisma Decimal objects cannot cross the
     * Server Component → Client Component boundary.
     *
     * Convert them to strings before returning.
     */
    salaryMin: job.salaryMin?.toString() ?? null,
    salaryMax: job.salaryMax?.toString() ?? null
  }));
}