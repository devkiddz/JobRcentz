'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import cloudinary from '@/server/lib/cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface JobSeekerPhotoUploadResult {
  url: string;
  publicId: string;
}

export async function uploadJobSeekerPhoto(
  file: File
): Promise<JobSeekerPhotoUploadResult> {
  await requireAuth();

  if (!(file instanceof File)) {
    throw new Error('Invalid profile photo.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Profile photo must be less than 5MB.');
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Profile photo must be a JPEG, PNG, or WebP image.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'job-rcentz/job-seekers/photos',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(
            new Error(
              error.message || 'Failed to upload profile photo.'
            )
          );
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary returned no upload result.'));
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
}