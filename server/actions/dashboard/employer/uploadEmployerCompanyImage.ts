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

type CompanyImageType = 'logo' | 'banner';

export interface EmployerCompanyImageUploadResult {
  url: string;
  publicId: string;
  type: CompanyImageType;
}

function getUploadFolder(type: CompanyImageType) {
  if (type === 'logo') {
    return 'job-rcentz/companies/logos';
  }

  return 'job-rcentz/companies/banners';
}

function getFileLabel(type: CompanyImageType) {
  return type === 'logo'
    ? 'Company logo'
    : 'Company banner';
}

export async function uploadEmployerCompanyImage(
  file: File,
  type: CompanyImageType
): Promise<EmployerCompanyImageUploadResult> {
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
          id: true
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

  if (!(file instanceof File)) {
    throw new Error(`Invalid ${getFileLabel(type).toLowerCase()} file.`);
  }

  if (file.size === 0) {
    throw new Error(
      `${getFileLabel(type)} cannot be empty.`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `${getFileLabel(type)} must be less than 5MB.`
    );
  }

  if (
    !ALLOWED_FILE_TYPES.includes(
      file.type as (typeof ALLOWED_FILE_TYPES)[number]
    )
  ) {
    throw new Error(
      `${getFileLabel(type)} must be a JPEG, PNG, or WebP image.`
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{
    url: string;
    publicId: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: getUploadFolder(type),
        resource_type: 'image'
      },
      (error, uploadResult) => {
        if (error) {
          reject(
            new Error(
              error.message ||
                `Failed to upload ${getFileLabel(type).toLowerCase()}.`
            )
          );

          return;
        }

        if (!uploadResult) {
          reject(
            new Error(
              'Cloudinary returned no upload result.'
            )
          );

          return;
        }

        resolve({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        });
      }
    );

    uploadStream.end(buffer);
  });

  return {
    ...result,
    type
  };
}