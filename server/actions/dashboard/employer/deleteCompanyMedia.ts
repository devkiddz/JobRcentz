'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import cloudinary from '@/server/lib/cloudinary';

export async function deleteCompanyMedia(
  publicId: string | null | undefined
) {
  await requireAuth();

  if (!publicId) {
    return {
      success: true
    };
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('deleteCompanyMedia failed:', error);

    return {
      success: false
    };
  }
}