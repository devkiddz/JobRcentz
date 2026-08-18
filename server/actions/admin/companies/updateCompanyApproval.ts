'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type ApprovalStatus = 'APPROVED' | 'REJECTED';

export async function updateCompanyApproval(
  companyId: string,
  status: ApprovalStatus
) {
  const user = await requireAuth();

  const admin = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!admin) {
    throw new Error('User account not found.');
  }

  if (admin.role !== 'ADMIN') {
    throw new Error(
      'Only administrators can review company accounts.'
    );
  }

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new Error('Invalid approval status.');
  }

  const company = await prisma.companyProfile.findUnique({
    where: {
      id: companyId
    },
    select: {
      id: true,
      onboardingStatus: true
    }
  });

  if (!company) {
    throw new Error('Company profile not found.');
  }

  await prisma.companyProfile.update({
    where: {
      id: company.id
    },
    data: {
      onboardingStatus: status
    }
  });

  revalidatePath('/dashboard/admin/companies');
  revalidatePath('/dashboard/admin/companies/[id]', 'page');
  revalidatePath('/dashboard');

  return {
    success: true
  };
}