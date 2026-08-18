'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekerApplications() {
  const user = await requireAuth();

  const applications = await prisma.application.findMany({
    where: {
      applicantId: user.id
    },
    orderBy: {
      appliedAt: 'desc'
    },
    select: {
      id: true,
      status: true,
      coverLetter: true,
      cvUrl: true,
      cvName: true,
      appliedAt: true,
      updatedAt: true,

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
              companyLogoUrl: true,
              companyIndustry: true
            }
          }
        }
      }
    }
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    applications
  };
}

export type JobSeekerApplications = Awaited<
  ReturnType<typeof getJobSeekerApplications>
>;