'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import cloudinary from '@/server/lib/cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

export type CompanyMediaType = 'logo' | 'banner';

export interface CompanyMediaUploadResult {
  url: string;
  publicId: string;
  previousPublicId: string | null;
}

export async function uploadCompanyMedia(
  file: File,
  type: CompanyMediaType
): Promise<CompanyMediaUploadResult> {
  const user = await requireAuth();

  if (!(file instanceof File)) {
    throw new Error('Invalid image file.');
  }

  if (file.size === 0) {
    throw new Error('The selected image is empty.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be less than 5MB.');
  }

  if (
    !ALLOWED_FILE_TYPES.includes(
      file.type as (typeof ALLOWED_FILE_TYPES)[number]
    )
  ) {
    throw new Error(
      'Image must be a JPEG, PNG, or WebP file.'
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true,

      company: {
        select: {
          id: true,
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

  const previousPublicId =
    type === 'logo'
      ? dbUser.company.companyLogoPublicId
      : dbUser.company.bannerPublicId;

  const folder =
    type === 'logo'
      ? 'job-rcentz/companies/logos'
      : 'job-rcentz/companies/banners';

  const transformation =
    type === 'logo'
      ? {
          width: 512,
          height: 512,
          crop: 'fill',
          gravity: 'auto'
        }
      : {
          width: 1600,
          height: 400,
          crop: 'fill',
          gravity: 'auto'
        };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploaded = await new Promise<{
    url: string;
    publicId: string;
  }>((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation
        },
        (error, result) => {
          if (error) {
            reject(
              new Error(
                error.message ||
                  'Failed to upload image.'
              )
            );

            return;
          }

          if (!result) {
            reject(
              new Error(
                'Cloudinary returned no upload result.'
              )
            );

            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );

    uploadStream.end(buffer);
  });

  try {
    await prisma.companyProfile.update({
      where: {
        id: dbUser.company.id
      },
      data:
        type === 'logo'
          ? {
              companyLogoUrl: uploaded.url,
              companyLogoPublicId: uploaded.publicId
            }
          : {
              bannerUrl: uploaded.url,
              bannerPublicId: uploaded.publicId
            }
    });
  } catch (error) {
    /*
     * The Cloudinary upload succeeded but the database
     * update failed. Clean up the orphaned Cloudinary asset.
     */
    try {
      await cloudinary.uploader.destroy(
        uploaded.publicId,
        {
          resource_type: 'image'
        }
      );
    } catch (cleanupError) {
      console.error(
        'Failed to clean up orphaned Cloudinary asset:',
        cleanupError
      );
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to save uploaded image.'
    );
  }

  /*
   * The database now points to the new asset.
   *
   * Only now is it safe to remove the old asset.
   */
  if (
    previousPublicId &&
    previousPublicId !== uploaded.publicId
  ) {
    try {
      await cloudinary.uploader.destroy(
        previousPublicId,
        {
          resource_type: 'image'
        }
      );
    } catch (error) {
      /*
       * Do not fail the successful upload because the
       * old Cloudinary asset could not be deleted.
       */
      console.error(
        'Failed to delete previous company media:',
        error
      );
    }
  }

  return {
    url: uploaded.url,
    publicId: uploaded.publicId,
    previousPublicId
  };
}