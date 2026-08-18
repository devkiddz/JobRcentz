'use server';

import {
  ApplicationStatus,
  InterviewStatus,
  JobInvitationStatus,
  JobStatus,
  TodoStatus,
  UserRole
} from '@/lib/generated/prisma/browser';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerDashboard() {
  /* ========================================================================= */
  /* Authentication                                                           */
  /* ========================================================================= */

  const user = await requireAuth();

  /* ========================================================================= */
  /* Employer account + company                                               */
  /* ========================================================================= */

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,

      company: {
        select: {
          id: true,
          userId: true,

          companyName: true,
          companyWebsite: true,
          companySize: true,
          companyIndustry: true,
          companyDescription: true,
          companyLocation: true,
          companyAddress: true,
          companyContactEmail: true,
          companyContactPhone: true,
          companyLinkedIn: true,
          companyX: true,
          companyFacebook: true,

          companyLogoUrl: true,
          companyLogoPublicId: true,

          bannerUrl: true,
          bannerPublicId: true,

          onboardingStatus: true,
          visibility: true,
          isDiscoverable: true,
          profileViews: true,

          createdAt: true,
          updatedAt: true,

          _count: {
            select: {
              jobs: true,
              galleryImages: true
            }
          }
        }
      }
    }
  });

  if (!dbUser) {
    throw new Error('User account not found.');
  }

  if (dbUser.role !== UserRole.EMPLOYER) {
    throw new Error('Employer account required.');
  }

  if (!dbUser.company) {
    throw new Error('Company profile not found.');
  }

  const companyId = dbUser.company.id;
  const employerId = dbUser.id;
  const now = new Date();

  /* ========================================================================= */
  /* Dashboard statistics                                                     */
  /* ========================================================================= */

  const [
    totalJobs,
    publishedJobs,
    draftJobs,
    closedJobs,

    pendingApprovalJobs,
    rejectedApprovalJobs,

    totalApplications,
    pendingApplications,
    reviewingApplications,
    shortlistedApplications,
    interviewApplications,
    hiredApplications,
    rejectedApplications,
    withdrawnApplications,

    pendingInvitations,
    unreadNotifications,
    pendingTodos,

    totalInterviews,
    upcomingInterviewCount
  ] = await Promise.all([
    /* Jobs */

    prisma.job.count({
      where: {
        companyId
      }
    }),

    prisma.job.count({
      where: {
        companyId,
        status: JobStatus.PUBLISHED
      }
    }),

    prisma.job.count({
      where: {
        companyId,
        status: JobStatus.DRAFT
      }
    }),

    prisma.job.count({
      where: {
        companyId,
        status: JobStatus.CLOSED
      }
    }),

    prisma.job.count({
      where: {
        companyId,
        approvalStatus: 'PENDING'
      }
    }),

    prisma.job.count({
      where: {
        companyId,
        approvalStatus: 'REJECTED'
      }
    }),

    /* Applications */

    prisma.application.count({
      where: {
        job: {
          companyId
        }
      }
    }),

    prisma.application.count({
      where: {
        job: {
          companyId
        },
        status: ApplicationStatus.PENDING
      }
    }),

    prisma.application.count({
      where: {
        job: {
          companyId
        },
        status: ApplicationStatus.REVIEWING
      }
    }),

    prisma.application.count({
      where: {
        job: {
          companyId
        },
        status: ApplicationStatus.SHORTLISTED
      }
    }),

    prisma.application.count({
      where: {
        job: {
          companyId
        },
        status: ApplicationStatus.INTERVIEW
      }
    }),

    prisma.application.count({
      where: {
        job: {
          companyId
        },
        status: ApplicationStatus.HIRED
      }
    }),

    prisma.application.count({
      where: {
        job: {
          companyId
        },
        status: ApplicationStatus.REJECTED
      }
    }),

    prisma.application.count({
      where: {
        job: {
          companyId
        },
        status: ApplicationStatus.WITHDRAWN
      }
    }),

    /* Employer activity */

    prisma.jobInvitation.count({
      where: {
        senderId: employerId,
        status: JobInvitationStatus.PENDING
      }
    }),

    prisma.notification.count({
      where: {
        userId: employerId,
        isRead: false
      }
    }),

    prisma.todo.count({
      where: {
        userId: employerId,
        status: {
          in: [
            TodoStatus.TODO,
            TodoStatus.IN_PROGRESS
          ]
        }
      }
    }),

    /* Interviews */

    prisma.interview.count({
      where: {
        employerId
      }
    }),

    prisma.interview.count({
      where: {
        employerId,
        scheduledAt: {
          gte: now
        },
        status: {
          in: [
            InterviewStatus.SCHEDULED,
            InterviewStatus.RESCHEDULED
          ]
        }
      }
    })
  ]);

  /* ========================================================================= */
  /* Recent jobs                                                               */
  /* ========================================================================= */

  const recentJobs = await prisma.job.findMany({
    where: {
      companyId
    },

    orderBy: {
      createdAt: 'desc'
    },

    take: 5,

    select: {
      id: true,
      title: true,
      status: true,
      approvalStatus: true,
      location: true,
      workMode: true,
      employmentType: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      createdAt: true,
      publishedAt: true,
      expiresAt: true,

      _count: {
        select: {
          applications: true
        }
      }
    }
  });

  /* ========================================================================= */
  /* Recent applications                                                       */
  /* ========================================================================= */

  const recentApplications = await prisma.application.findMany({
    where: {
      job: {
        companyId
      }
    },

    orderBy: {
      appliedAt: 'desc'
    },

    take: 6,

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
          title: true
        }
      },

      applicant: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },

      jobSeekerProfile: {
        select: {
          headline: true,
          currentRole: true,
          location: true,
          profilePhotoUrl: true,
          averageRating: true,
          yearsOfExperience: true
        }
      }
    }
  });

  /* ========================================================================= */
  /* Upcoming interviews                                                       */
  /* ========================================================================= */

  const upcomingInterviews = await prisma.interview.findMany({
    where: {
      employerId,

      scheduledAt: {
        gte: now
      },

      status: {
        in: [
          InterviewStatus.SCHEDULED,
          InterviewStatus.RESCHEDULED
        ]
      }
    },

    orderBy: {
      scheduledAt: 'asc'
    },

    take: 5,

    select: {
      id: true,
      scheduledAt: true,
      durationMinutes: true,
      meetingUrl: true,
      location: true,
      notes: true,
      status: true,

      job: {
        select: {
          id: true,
          title: true
        }
      },

      candidate: {
        select: {
          id: true,
          name: true,
          image: true,

          jobSeeker: {
            select: {
              headline: true,
              currentRole: true,
              profilePhotoUrl: true
            }
          }
        }
      }
    }
  });

  /* ========================================================================= */
  /* Profile completion                                                        */
  /* ========================================================================= */

  const company = dbUser.company;

  const profileFields = [
    company.companyName,
    company.companyIndustry,
    company.companyDescription,
    company.companyLocation,
    company.companyWebsite,
    company.companySize,
    company.companyAddress,
    company.companyContactEmail,
    company.companyContactPhone,
    company.companyLinkedIn,
    company.companyX,
    company.companyFacebook,
    company.companyLogoUrl,
    company.bannerUrl
  ];

  const completedProfileFields = profileFields.filter(
    value =>
      typeof value === 'string'
        ? value.trim().length > 0
        : Boolean(value)
  ).length;

  const profileCompletion = Math.round(
    (completedProfileFields / profileFields.length) * 100
  );

  /* ========================================================================= */
  /* Dashboard contract                                                       */
  /* ========================================================================= */

  return {
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      image: dbUser.image,
      role: dbUser.role
    },

    company: {
      id: company.id,
      userId: company.userId,

      companyName: company.companyName,
      companyWebsite: company.companyWebsite,
      companySize: company.companySize,
      companyIndustry: company.companyIndustry,
      companyDescription: company.companyDescription,
      companyLocation: company.companyLocation,
      companyAddress: company.companyAddress,
      companyContactEmail: company.companyContactEmail,
      companyContactPhone: company.companyContactPhone,
      companyLinkedIn: company.companyLinkedIn,
      companyX: company.companyX,
      companyFacebook: company.companyFacebook,

      companyLogoUrl: company.companyLogoUrl,
      companyLogoPublicId: company.companyLogoPublicId,

      bannerUrl: company.bannerUrl,
      bannerPublicId: company.bannerPublicId,

      onboardingStatus: company.onboardingStatus,
      visibility: company.visibility,
      isDiscoverable: company.isDiscoverable,
      profileViews: company.profileViews,

      createdAt: company.createdAt,
      updatedAt: company.updatedAt,

      counts: {
        jobs: company._count.jobs,
        galleryImages: company._count.galleryImages
      }
    },

    stats: {
      jobs: {
        total: totalJobs,
        published: publishedJobs,
        drafts: draftJobs,
        closed: closedJobs,
        pendingApproval: pendingApprovalJobs,
        rejectedApproval: rejectedApprovalJobs
      },

      applications: {
        total: totalApplications,
        pending: pendingApplications,
        reviewing: reviewingApplications,
        shortlisted: shortlistedApplications,
        interview: interviewApplications,
        hired: hiredApplications,
        rejected: rejectedApplications,
        withdrawn: withdrawnApplications
      },

      interviews: {
        total: totalInterviews,
        upcoming: upcomingInterviewCount
      },

      activity: {
        pendingInvitations,
        unreadNotifications,
        pendingTodos
      }
    },

    profile: {
      completion: profileCompletion,
      visibility: company.visibility,
      isDiscoverable: company.isDiscoverable,
      profileViews: company.profileViews
    },

    recentJobs,

    recentApplications,

    upcomingInterviews
  };
}

export type EmployerDashboardData =
  Awaited<ReturnType<typeof getEmployerDashboard>>;