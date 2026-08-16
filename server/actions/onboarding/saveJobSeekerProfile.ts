'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import { uploadJobSeekerPhoto } from '../companies/uploadJobSeekerPhoto';
import { uploadJobSeekerCv } from '../companies/uploadJobSeekerCv';

export async function saveJobSeekerProfile(formData: FormData) {
  const user = await requireAuth();

  const fullName = String(formData.get('fullName') ?? '').trim();
  const headline = String(formData.get('headline') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();

  const currentRoleValue = String(formData.get('currentRole') ?? '').trim();
  const yearsOfExperienceValue = String(
    formData.get('yearsOfExperience') ?? ''
  ).trim();

  const skillsValue = String(formData.get('skills') ?? '');

  const portfolio = String(formData.get('portfolio') ?? '').trim();
  const linkedin = String(formData.get('linkedin') ?? '').trim();
  const github = String(formData.get('github') ?? '').trim();
  const x = String(formData.get('x') ?? '').trim();

  const removeProfilePhoto =
    formData.get('removeProfilePhoto') === 'true';

  const removeCv = formData.get('removeCv') === 'true';

  const profilePhoto = formData.get('profilePhoto');
  const cv = formData.get('cv');

  /* ========================================================================= */
  /* Validation                                                                */
  /* ========================================================================= */

  if (!fullName) {
    throw new Error('Full name is required.');
  }

  if (!headline) {
    throw new Error('Professional headline is required.');
  }

  if (!location) {
    throw new Error('Location is required.');
  }

  const yearsOfExperience = yearsOfExperienceValue
    ? Number(yearsOfExperienceValue)
    : null;

  if (
    yearsOfExperience !== null &&
    (!Number.isInteger(yearsOfExperience) ||
      yearsOfExperience < 0 ||
      yearsOfExperience > 100)
  ) {
    throw new Error('Invalid years of experience.');
  }

  const skills = skillsValue
    .split(',')
    .map(skill => skill.trim())
    .filter(Boolean);

  /* ========================================================================= */
  /* Existing profile                                                          */
  /* ========================================================================= */

  const existingProfile = await prisma.jobSeekerProfile.findUnique({
    where: {
      userId: user.id
    }
  });

  /* ========================================================================= */
  /* Cloudinary uploads                                                        */
  /* ========================================================================= */

  let profilePhotoUpload:
    | {
        url: string;
        publicId: string;
      }
    | undefined;

  let cvUpload:
    | {
        url: string;
        publicId: string;
        fileName: string;
      }
    | undefined;

  if (profilePhoto instanceof File && profilePhoto.size > 0) {
    profilePhotoUpload = await uploadJobSeekerPhoto(profilePhoto);
  }

  if (cv instanceof File && cv.size > 0) {
    cvUpload = await uploadJobSeekerCv(cv);
  }

  /* ========================================================================= */
  /* Database                                                                   */
  /* ========================================================================= */

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id
      },

      data: {
        name: fullName
      }
    }),

    prisma.jobSeekerProfile.upsert({
      where: {
        userId: user.id
      },

      create: {
        userId: user.id,

        headline,
        location,
        bio,

        currentRole: currentRoleValue || null,
        yearsOfExperience,

        skills,

        portfolio: portfolio || null,
        linkedin: linkedin || null,
        github: github || null,
        x: x || null,

        ...(profilePhotoUpload
          ? {
              profilePhotoUrl: profilePhotoUpload.url,
              profilePhotoPublicId: profilePhotoUpload.publicId
            }
          : {}),

        ...(cvUpload
          ? {
              cvUrl: cvUpload.url,
              cvName: cvUpload.fileName
            }
          : {})
      },

      update: {
        headline,
        location,
        bio,

        currentRole: currentRoleValue || null,
        yearsOfExperience,

        skills,

        portfolio: portfolio || null,
        linkedin: linkedin || null,
        github: github || null,
        x: x || null,

        ...(profilePhotoUpload
          ? {
              profilePhotoUrl: profilePhotoUpload.url,
              profilePhotoPublicId: profilePhotoUpload.publicId
            }
          : {}),

        ...(cvUpload
          ? {
              cvUrl: cvUpload.url,
              cvName: cvUpload.fileName
            }
          : {}),

        ...(removeProfilePhoto
          ? {
              profilePhotoUrl: null,
              profilePhotoPublicId: null
            }
          : {}),

        ...(removeCv
          ? {
              cvUrl: null,
              cvName: null
            }
          : {})
      }
    })
  ]);

  return {
    success: true,
    message: existingProfile
      ? 'Profile updated successfully.'
      : 'Profile created successfully.'
  };
}