'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import cloudinary from '@/server/lib/cloudinary';

type CompanyImageType = 'logo' | 'banner';

export async function deleteEmployerCompanyImage(
  publicId: string,
  type: CompanyImageType
) {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true,
      company: {
        select: {
          companyLogoPublicId: true,
          bannerPublicId: true
        }
      }
    }
  });

  if (!dbUser) {
    throw new Error('User account not found.');
  }

  if (dbUser.role !== 'EMPLOYER') {
    throw new Error('Employer account required.');
  }

  if (!dbUser.company) {
    throw new Error('Company profile not found.');
  }

  const expectedPublicId =
    type === 'logo'
      ? dbUser.company.companyLogoPublicId
      : dbUser.company.bannerPublicId;

  /*
   * Never allow an employer to delete an arbitrary
   * Cloudinary asset.
   */
  if (!expectedPublicId || expectedPublicId !== publicId) {
    throw new Error('Company image not found.');
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image'
  });

  return {
    success: true
  };
}