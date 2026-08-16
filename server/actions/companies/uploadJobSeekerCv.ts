'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import cloudinary from '@/server/lib/cloudinary';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export interface JobSeekerCvUploadResult {
  url: string;
  publicId: string;
  fileName: string;
}

export async function uploadJobSeekerCv(
  file: File
): Promise<JobSeekerCvUploadResult> {
  await requireAuth();

  if (!(file instanceof File)) {
    throw new Error('Invalid CV file.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('CV must be less than 10MB.');
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('CV must be a PDF, DOC, or DOCX file.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'job-rcentz/job-seekers/cvs',
        resource_type: 'raw'
      },
      (error, result) => {
        if (error) {
          reject(
            new Error(
              error.message || 'Failed to upload CV.'
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
          publicId: result.public_id,
          fileName: file.name
        });
      }
    );

    uploadStream.end(buffer);
  });
}