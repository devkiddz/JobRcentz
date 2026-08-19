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
          in: [TodoStatus.TODO, TodoStatus.IN_PROGRESS]
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
  /* Analytics                                                                 */
  /* ========================================================================= */

  const analyticsStartDate = new Date(now);

  analyticsStartDate.setDate(
    analyticsStartDate.getDate() - 29
  );

  analyticsStartDate.setHours(0, 0, 0, 0);

  /*
   * Fetch applications from the analytics period.
   *
   * We intentionally fetch only the fields required by the charts.
   * Aggregating in JavaScript gives us a predictable daily series even
   * when some days have zero applications.
   */
  const analyticsApplications =
    await prisma.application.findMany({
      where: {
        job: {
          companyId
        },

        appliedAt: {
          gte: analyticsStartDate,
          lte: now
        }
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
        }
      },

      orderBy: {
        appliedAt: 'asc'
      }
    });

  /* ------------------------------------------------------------------------- */
  /* Application trend                                                         */
  /* ------------------------------------------------------------------------- */

  const applicationTrendMap = new Map<
    string,
    number
  >();

  /*
   * Create every day first so the chart does not have gaps.
   */
  for (let index = 0; index < 30; index++) {
    const date = new Date(analyticsStartDate);

    date.setDate(date.getDate() + index);

    const key = date.toISOString().slice(0, 10);

    applicationTrendMap.set(key, 0);
  }

  for (const application of analyticsApplications) {
    const key = application.appliedAt
      .toISOString()
      .slice(0, 10);

    if (applicationTrendMap.has(key)) {
      applicationTrendMap.set(
        key,
        (applicationTrendMap.get(key) ?? 0) + 1
      );
    }
  }

  const applicationTrend = Array.from(
    applicationTrendMap.entries()
  ).map(([date, applications]) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    return {
      date,
      label: parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      applications
    };
  });

  /* ------------------------------------------------------------------------- */
  /* Application status distribution                                           */
  /* ------------------------------------------------------------------------- */

  const applicationStatus = [
    {
      status: ApplicationStatus.PENDING,
      label: 'Pending',
      value: pendingApplications
    },
    {
      status: ApplicationStatus.REVIEWING,
      label: 'Reviewing',
      value: reviewingApplications
    },
    {
      status: ApplicationStatus.SHORTLISTED,
      label: 'Shortlisted',
      value: shortlistedApplications
    },
    {
      status: ApplicationStatus.INTERVIEW,
      label: 'Interview',
      value: interviewApplications
    },
    {
      status: ApplicationStatus.HIRED,
      label: 'Hired',
      value: hiredApplications
    },
    {
      status: ApplicationStatus.REJECTED,
      label: 'Rejected',
      value: rejectedApplications
    },
    {
      status: ApplicationStatus.WITHDRAWN,
      label: 'Withdrawn',
      value: withdrawnApplications
    }
  ];

  /* ------------------------------------------------------------------------- */
  /* Job performance                                                           */
  /* ------------------------------------------------------------------------- */

  const jobPerformanceMap = new Map<
    string,
    {
      jobId: string;
      title: string;
      applications: number;
    }
  >();

  for (const application of analyticsApplications) {
    const existing = jobPerformanceMap.get(
      application.job.id
    );

    if (existing) {
      existing.applications += 1;
    } else {
      jobPerformanceMap.set(application.job.id, {
        jobId: application.job.id,
        title: application.job.title,
        applications: 1
      });
    }
  }

  const jobPerformance = Array.from(
    jobPerformanceMap.values()
  )
    .sort(
      (a, b) =>
        b.applications - a.applications
    )
    .slice(0, 6);

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

const serializedRecentJobs = recentJobs.map(job => ({
  ...job,
  salaryMin: job.salaryMin
    ? Number(job.salaryMin)
    : null,
  salaryMax: job.salaryMax
    ? Number(job.salaryMax)
    : null
}));

  /* ========================================================================= */
  /* Recent applications                                                       */
  /* ========================================================================= */

  const recentApplications =
    await prisma.application.findMany({
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

  const upcomingInterviews =
    await prisma.interview.findMany({
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

  const completedProfileFields =
    profileFields.filter(value =>
      typeof value === 'string'
        ? value.trim().length > 0
        : Boolean(value)
    ).length;

  const profileCompletion = Math.round(
    (completedProfileFields /
      profileFields.length) *
      100
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
      companyContactEmail:
        company.companyContactEmail,
      companyContactPhone:
        company.companyContactPhone,
      companyLinkedIn: company.companyLinkedIn,
      companyX: company.companyX,
      companyFacebook: company.companyFacebook,

      companyLogoUrl: company.companyLogoUrl,
      companyLogoPublicId:
        company.companyLogoPublicId,

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
        galleryImages:
          company._count.galleryImages
      }
    },

    stats: {
      jobs: {
        total: totalJobs,
        published: publishedJobs,
        drafts: draftJobs,
        closed: closedJobs,
        pendingApproval:
          pendingApprovalJobs,
        rejectedApproval:
          rejectedApprovalJobs
      },

      applications: {
        total: totalApplications,
        pending: pendingApplications,
        reviewing: reviewingApplications,
        shortlisted:
          shortlistedApplications,
        interview:
          interviewApplications,
        hired: hiredApplications,
        rejected:
          rejectedApplications,
        withdrawn:
          withdrawnApplications
      },

      interviews: {
        total: totalInterviews,
        upcoming:
          upcomingInterviewCount
      },

      activity: {
        pendingInvitations,
        unreadNotifications,
        pendingTodos
      }
    },

    /*
     * Real dashboard analytics.
     *
     * These values are derived from actual database records.
     */
    analytics: {
      applicationTrend,

      applicationStatus,

      jobPerformance
    },

    profile: {
      completion: profileCompletion,
      visibility: company.visibility,
      isDiscoverable:
        company.isDiscoverable,
      profileViews:
        company.profileViews
    },

    recentJobs: serializedRecentJobs,

    recentApplications,

    upcomingInterviews
  };
}

export type EmployerDashboardData =
  Awaited<
    ReturnType<typeof getEmployerDashboard>
  >;