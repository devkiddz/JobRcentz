'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerApplicationById(
  applicationId: string
) {
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

  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,

      job: {
        companyId: dbUser.company.id
      }
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
          description: true,
          requirements: true,
          location: true,
          workMode: true,
          employmentType: true,
          status: true,
          approvalStatus: true,
          expiresAt: true
        }
      },

      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true
        }
      },

      jobSeekerProfile: {
        select: {
          id: true,
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
          cvName: true
        }
      }
    }
  });

  if (!application) {
    throw new Error('Application not found.');
  }

  return application;
}

export type EmployerApplicationData = Awaited<
  ReturnType<typeof getEmployerApplicationById>
>;