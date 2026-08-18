'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerApplications() {
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
          companyName: true
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

  const applications = await prisma.application.findMany({
    where: {
      job: {
        companyId: dbUser.company.id
      }
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
          status: true,
          approvalStatus: true
        }
      },

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
  });

  return {
    company: dbUser.company,
    applications
  };
}

export type EmployerApplicationsData = Awaited<
  ReturnType<typeof getEmployerApplications>
>;