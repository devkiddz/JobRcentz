'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerCandidates(search = '') {
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

  const normalizedSearch = search.trim();

  const applications = await prisma.application.findMany({
    where: {
      job: {
        companyId: employer.company.id
      },
      ...(normalizedSearch
        ? {
            OR: [
              {
                applicant: {
                  name: {
                    contains: normalizedSearch,
                    mode: 'insensitive'
                  }
                }
              },
              {
                applicant: {
                  email: {
                    contains: normalizedSearch,
                    mode: 'insensitive'
                  }
                }
              },
              {
                jobSeekerProfile: {
                  currentRole: {
                    contains: normalizedSearch,
                    mode: 'insensitive'
                  }
                }
              },
              {
                jobSeekerProfile: {
                  headline: {
                    contains: normalizedSearch,
                    mode: 'insensitive'
                  }
                }
              }
            ]
          }
        : {})
    },
    orderBy: {
      appliedAt: 'desc'
    },
    select: {
      id: true,
      status: true,
      appliedAt: true,
      job: {
        select: {
          id: true,
          title: true
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
          headline: true,
          currentRole: true,
          location: true,
          yearsOfExperience: true,
          skills: true,
          profilePhotoUrl: true,
          averageRating: true,
          ratingCount: true,
          visibility: true,
          isDiscoverable: true
        }
      }
    }
  });

  const candidates = new Map<
    string,
    {
      id: string;
      name: string;
      email: string;
      image: string | null;
      profile: {
        headline: string;
        currentRole: string | null;
        location: string;
        yearsOfExperience: number | null;
        skills: string[];
        profilePhotoUrl: string | null;
        averageRating: number;
        ratingCount: number;
        visibility: string;
        isDiscoverable: boolean;
      };
      applications: Array<{
        id: string;
        jobId: string;
        jobTitle: string;
        status: string;
        appliedAt: Date;
      }>;
    }
  >();

  for (const application of applications) {
    const existing = candidates.get(application.applicant.id);

    const profile = {
      headline: application.jobSeekerProfile.headline,
      currentRole: application.jobSeekerProfile.currentRole,
      location: application.jobSeekerProfile.location,
      yearsOfExperience: application.jobSeekerProfile.yearsOfExperience,
      skills: application.jobSeekerProfile.skills,
      profilePhotoUrl: application.jobSeekerProfile.profilePhotoUrl,
      averageRating: application.jobSeekerProfile.averageRating,
      ratingCount: application.jobSeekerProfile.ratingCount,
      visibility: application.jobSeekerProfile.visibility,
      isDiscoverable: application.jobSeekerProfile.isDiscoverable
    };

    const candidateApplication = {
      id: application.id,
      jobId: application.job.id,
      jobTitle: application.job.title,
      status: application.status,
      appliedAt: application.appliedAt
    };

    if (existing) {
      existing.applications.push(candidateApplication);
      continue;
    }

    candidates.set(application.applicant.id, {
      id: application.applicant.id,
      name: application.applicant.name,
      email: application.applicant.email,
      image: application.applicant.image,
      profile,
      applications: [candidateApplication]
    });
  }

  return {
    employer,
    candidates: Array.from(candidates.values())
  };
}
