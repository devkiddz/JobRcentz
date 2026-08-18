import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getJobSeekerProfile() {
  const user = await requireAuth();

  const profile = await prisma.jobSeekerProfile.findUnique({
    where: {
      userId: user.id
    }
  });

  return {
    user: {
      id: user.id,
      name: user.name ?? '',
      email: user.email ?? ''
    },
    profile
  };
}

export type JobSeekerProfileData = Awaited<
  ReturnType<typeof getJobSeekerProfile>
>;