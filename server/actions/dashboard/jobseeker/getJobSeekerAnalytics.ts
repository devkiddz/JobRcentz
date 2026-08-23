'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

function startOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function startOfWeek(date: Date) {
  const result = startOfDay(date);

  const day = result.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - daysFromMonday);

  return result;
}

function startOfMonth(date: Date) {
  const result = startOfDay(date);

  result.setDate(1);

  return result;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createDateRange(days: number) {
  const dates: Date[] = [];
  const today = startOfDay(new Date());

  for (let index = days - 1; index >= 0; index--) {
    const date = new Date(today);

    date.setDate(today.getDate() - index);

    dates.push(date);
  }

  return dates;
}

export async function getJobSeekerAnalytics() {
  const authUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id
    },
    select: {
      id: true,
      role: true,

      jobSeeker: {
        select: {
          id: true,
          headline: true,
          bio: true,
          currentRole: true,
          location: true,
          yearsOfExperience: true,
          skills: true,
          profilePhotoUrl: true,
          bannerUrl: true,
          linkedin: true,
          github: true,
          x: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User account not found.');
  }

  if (user.role !== 'JOB_SEEKER') {
    throw new Error('This dashboard is only available to job seekers.');
  }

  if (!user.jobSeeker) {
    throw new Error('Job seeker profile not found.');
  }

  const profile = user.jobSeeker;
  const profileId = profile.id;

  const now = new Date();

  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const thirtyDaysAgo = new Date(todayStart);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const [
    totalProfileViews,
    todayViews,
    weekViews,
    monthViews,
    applications,
    savedJobs,
    recentViews
  ] = await Promise.all([
    /*
     * ---------------------------------------------------------
     * TOTAL PROFILE VIEWS
     * ---------------------------------------------------------
     */

    prisma.jobSeekerProfileView.count({
      where: {
        profileId
      }
    }),

    /*
     * ---------------------------------------------------------
     * TODAY
     * ---------------------------------------------------------
     */

    prisma.jobSeekerProfileView.count({
      where: {
        profileId,
        viewedAt: {
          gte: todayStart
        }
      }
    }),

    /*
     * ---------------------------------------------------------
     * THIS WEEK
     * ---------------------------------------------------------
     */

    prisma.jobSeekerProfileView.count({
      where: {
        profileId,
        viewedAt: {
          gte: weekStart
        }
      }
    }),

    /*
     * ---------------------------------------------------------
     * THIS MONTH
     * ---------------------------------------------------------
     */

    prisma.jobSeekerProfileView.count({
      where: {
        profileId,
        viewedAt: {
          gte: monthStart
        }
      }
    }),

    /*
     * ---------------------------------------------------------
     * APPLICATIONS
     * ---------------------------------------------------------
     */

    prisma.application.count({
      where: {
        applicantId: user.id
      }
    }),

    /*
     * ---------------------------------------------------------
     * SAVED JOBS
     * ---------------------------------------------------------
     */

    prisma.savedJob.count({
      where: {
        userId: user.id
      }
    }),

    /*
     * ---------------------------------------------------------
     * PROFILE VIEW EVENTS — LAST 30 DAYS
     * ---------------------------------------------------------
     */

    prisma.jobSeekerProfileView.findMany({
      where: {
        profileId,
        viewedAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        viewedAt: 'asc'
      },
      select: {
        viewedAt: true
      }
    })
  ]);

  /*
   * ---------------------------------------------------------
   * PROFILE COMPLETION
   * ---------------------------------------------------------
   */

  const completionFields = [
    profile.headline,
    profile.bio,
    profile.currentRole,
    profile.location,
    profile.yearsOfExperience,
    profile.skills.length > 0,
    profile.profilePhotoUrl,
    profile.bannerUrl,
    profile.linkedin,
    profile.github
  ];

  const completedFields = completionFields.filter(
    value =>
      value !== null &&
      value !== undefined &&
      value !== '' &&
      value !== false
  ).length;

  const profileCompletion = Math.round(
    (completedFields / completionFields.length) * 100
  );

  /*
   * ---------------------------------------------------------
   * 30-DAY PROFILE VIEW CHART
   * ---------------------------------------------------------
   */

  const dates = createDateRange(30);

  const viewCounts = new Map<string, number>();

  for (const view of recentViews) {
    const key = formatDateKey(view.viewedAt);

    viewCounts.set(key, (viewCounts.get(key) ?? 0) + 1);
  }

  const profileViewsOverTime = dates.map(date => {
    const key = formatDateKey(date);

    return {
      date: key,
      label: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      views: viewCounts.get(key) ?? 0
    };
  });

  /*
   * ---------------------------------------------------------
   * PEAK DAILY VIEWS
   * ---------------------------------------------------------
   */

  const peakViews = profileViewsOverTime.reduce(
    (maximum, current) => Math.max(maximum, current.views),
    0
  );

  /*
   * ---------------------------------------------------------
   * RESPONSE
   * ---------------------------------------------------------
   */

  return {
    profile: {
      id: profile.id,
      headline: profile.headline
    },

    stats: {
      totalProfileViews,
      todayViews,
      weekViews,
      monthViews,
      applications,
      savedJobs,
      profileCompletion
    },

    chart: {
      days: 30,
      peakViews,
      data: profileViewsOverTime
    }
  };
}

export type JobSeekerAnalyticsData = Awaited<
  ReturnType<typeof getJobSeekerAnalytics>
>;