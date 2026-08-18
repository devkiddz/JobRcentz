'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/server/auth/requireAdmin';
import { prisma } from '@/server/db/prisma';

export async function approveEmployer(companyId: string) {
  await requireAdmin();

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
    throw new Error('Employer account not found.');
  }

  if (company.onboardingStatus === 'APPROVED') {
    return {
      success: true,
      message: 'Employer is already approved.'
    };
  }

  await prisma.companyProfile.update({
    where: {
      id: companyId
    },
    data: {
      onboardingStatus: 'APPROVED'
    }
  });

  revalidatePath('/admin');
  revalidatePath('/admin/employers');
  revalidatePath(`/admin/employers/${companyId}`);

  return {
    success: true,
    message: 'Employer approved successfully.'
  };
}