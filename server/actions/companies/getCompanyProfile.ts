'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getCompanyProfile() {
  const user = await requireAuth();

  const profile = await prisma.companyProfile.findUnique({
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

export type CompanyProfileData = Awaited<ReturnType<typeof getCompanyProfile>>;