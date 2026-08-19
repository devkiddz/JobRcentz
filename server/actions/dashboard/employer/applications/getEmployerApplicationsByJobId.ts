'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerApplicationsByJobId(jobId: string) {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true,
      company: {
        select: {
          id: true,
          companyName: true,
          companyLogoUrl: true
        }
      }
    }
  });

  if (!dbUser) {
    throw new Error('User account not found.');
  }

  if (dbUser.role !== 'EMPLOYER') {
    throw new Error('Employer account required.');
  }

  if (!dbUser.company) {
    throw new Error('Company profile not found.');
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      companyId: dbUser.company.id
    },
    select: {
      id: true,
      title: true,
      status: true,
      approvalStatus: true,
      location: true,
      workMode: true,
      employmentType: true,

      applications: {
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

          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },

          jobSeekerProfile: {
            select: {
              id: true,
              headline: true,
              location: true,
              currentRole: true,
              yearsOfExperience: true,
              skills: true,
              profilePhotoUrl: true
            }
          }
        }
      },

      _count: {
        select: {
          applications: true
        }
      }
    }
  });

  if (!job) {
    return null;
  }

  return {
    company: dbUser.company,
    job
  };
}

export type EmployerApplicationsByJobData = Awaited<
  ReturnType<typeof getEmployerApplicationsByJobId>
>;