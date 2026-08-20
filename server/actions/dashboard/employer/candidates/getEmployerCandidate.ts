'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerCandidate(candidateId: string) {
  const user = await requireAuth();

  const employer = await prisma.user.findUnique({
    where: { id: user.id },
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

  if (!employer || employer.role !== 'EMPLOYER') {
    throw new Error('Employer account required.');
  }

  if (!employer.company) {
    throw new Error('Company profile not found.');
  }

  const applications = await prisma.application.findMany({
    where: {
      applicantId: candidateId,
      job: {
        companyId: employer.company.id
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
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          workMode: true,
          employmentType: true
        }
      },
      interviews: {
        orderBy: {
          scheduledAt: 'desc'
        },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          outcome: true,
          scheduledAt: true,
          durationMinutes: true,
          meetingUrl: true,
          location: true
        }
      }
    }
  });

  if (applications.length === 0) {
    return null;
  }

  const candidate = await prisma.user.findUnique({
    where: { id: candidateId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      jobSeeker: {
        select: {
          headline: true,
          currentRole: true,
          location: true,
          bio: true,
          yearsOfExperience: true,
          skills: true,
          linkedin: true,
          github: true,
          x: true,
          profilePhotoUrl: true,
          cvUrl: true,
          cvName: true,
          averageRating: true,
          ratingCount: true,
          visibility: true,
          isDiscoverable: true,
          isAvailable: true,
          portfolioProjects: {
            where: {
              status: 'PUBLISHED',
              visibility: 'PUBLIC'
            },
            orderBy: {
              featured: 'desc'
            },
            take: 6,
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              projectUrl: true,
              githubUrl: true,
              featured: true
            }
          }
        }
      }
    }
  });

  if (!candidate?.jobSeeker) {
    return null;
  }

  return {
    employer,
    candidate,
    applications
  };
}
