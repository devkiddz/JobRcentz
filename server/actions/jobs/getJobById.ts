import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobById(jobId: string) {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!dbUser) {
    return null;
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId
    },
    include: {
      company: {
        select: {
          id: true,
          companyName: true,
          companyIndustry: true,
          companyDescription: true,
          companyLocation: true,
          companyWebsite: true,
          companyLogoUrl: true
        }
      },
      _count: {
        select: {
          applications: true,
          savedBy: true
        }
      }
    }
  });

  if (!job) {
    return null;
  }

  const isOwner = job.postedById === dbUser.id;

  /*
   * Employers can inspect their own jobs regardless of publication state.
   * Everyone else can only inspect published jobs.
   */
  if (!isOwner && job.status !== 'PUBLISHED') {
    return null;
  }

  const existingApplication =
    dbUser.role === 'JOB_SEEKER'
      ? await prisma.application.findUnique({
          where: {
            jobId_applicantId: {
              jobId: job.id,
              applicantId: dbUser.id
            }
          },
          select: {
            id: true,
            status: true
          }
        })
      : null;

  const savedJob =
    dbUser.role === 'JOB_SEEKER'
      ? await prisma.savedJob.findUnique({
          where: {
            jobId_userId: {
              jobId: job.id,
              userId: dbUser.id
            }
          },
          select: {
            id: true
          }
        })
      : null;

  return {
    user: {
      id: dbUser.id,
      role: dbUser.role
    },
    job,
    isOwner,
    existingApplication,
    isSaved: Boolean(savedJob)
  };
}

export type JobDetailsData = Awaited<
  ReturnType<typeof getJobById>
>;