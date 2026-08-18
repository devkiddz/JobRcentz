'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import cloudinary from '@/server/lib/cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface CompanyLogoUploadResult {
  url: string;
  publicId: string;
}

export async function uploadCompanyLogo(file: File): Promise<CompanyLogoUploadResult> {
  // ============================================================
  // Authentication
  // ============================================================

  await requireAuth();

  // ============================================================
  // File validation
  // ============================================================

  if (!(file instanceof File)) {
    throw new Error('Invalid logo file.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Logo must be less than 5MB.');
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Logo must be a JPEG, PNG, or WebP image.');
  }

  // ============================================================
  // Upload to Cloudinary
  // ============================================================

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'job-rcentz/companies/logos',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message || 'Failed to upload company logo.'));
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