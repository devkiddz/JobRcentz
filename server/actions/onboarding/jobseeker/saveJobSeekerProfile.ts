'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

import { uploadJobSeekerPhoto } from './uploadJobSeekerPhoto';
import { uploadJobSeekerCv } from './uploadJobSeekerCv';

export async function saveJobSeekerProfile(formData: FormData) {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!dbUser) {
    throw new Error('User account not found.');
  }

  /*
   * Account type is permanent.
   *
   * UNASSIGNED -> may become JOB_SEEKER.
   * JOB_SEEKER -> may update their own profile.
   * EMPLOYER -> may never create/update a job seeker profile.
   * ADMIN -> does not use normal onboarding.
   */
  if (dbUser.role === 'EMPLOYER') {
    throw new Error(
      'This account is registered as an employer and cannot use job seeker onboarding.'
    );
  }

  if (dbUser.role === 'ADMIN') {
    throw new Error(
      'Admin accounts cannot use job seeker onboarding.'
    );
  }

  /* ========================================================================= */
  /* Form values                                                               */
  /* ========================================================================= */

  const fullName = String(formData.get('fullName') ?? '').trim();

  const headline = String(formData.get('headline') ?? '').trim();

  const location = String(formData.get('location') ?? '').trim();

  const bio = String(formData.get('bio') ?? '').trim();

  const currentRoleValue = String(
    formData.get('currentRole') ?? ''
  ).trim();

  const yearsOfExperienceValue = String(
    formData.get('yearsOfExperience') ?? ''
  ).trim();

  const skillsValue = String(
    formData.get('skills') ?? ''
  );

  const portfolio = String(
    formData.get('portfolio') ?? ''
  ).trim();

  const linkedin = String(
    formData.get('linkedin') ?? ''
  ).trim();

  const github = String(
    formData.get('github') ?? ''
  ).trim();

  const x = String(
    formData.get('x') ?? ''
  ).trim();

  const removeProfilePhoto =
    formData.get('removeProfilePhoto') === 'true';

  const removeCv =
    formData.get('removeCv') === 'true';

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

  const existingProfile =
    await prisma.jobSeekerProfile.findUnique({
      where: {
        userId: user.id
      }
    });

  const isNewProfile = !existingProfile;

  /*
   * A rejected profile may be submitted again.
   *
   * This does NOT change the account type.
   */
  const isResubmission =
    existingProfile?.onboardingStatus === 'REJECTED';

  /*
   * New profiles and rejected resubmissions enter PENDING.
   *
   * Existing approved/pending profiles remain at their current status
   * during normal edits.
   */
  const shouldStartReview =
    isNewProfile || isResubmission;

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

  if (
    profilePhoto instanceof File &&
    profilePhoto.size > 0
  ) {
    profilePhotoUpload =
      await uploadJobSeekerPhoto(profilePhoto);
  }

  if (
    cv instanceof File &&
    cv.size > 0
  ) {
    cvUpload =
      await uploadJobSeekerCv(cv);
  }

  /* ========================================================================= */
  /* Database                                                                  */
  /* ========================================================================= */

  const profile = await prisma.$transaction(async tx => {
    /*
     * Establish the account type only on first onboarding.
     *
     * Existing JOB_SEEKER accounts remain JOB_SEEKER.
     */
    await tx.user.update({
      where: {
        id: user.id
      },
      data: {
        name: fullName,

        ...(dbUser.role === 'UNASSIGNED'
          ? {
              role: 'JOB_SEEKER'
            }
          : {})
      }
    });

    return tx.jobSeekerProfile.upsert({
      where: {
        userId: user.id
      },

      /* --------------------------------------------------------------------- */
      /* Create                                                                 */
      /* --------------------------------------------------------------------- */

      create: {
        userId: user.id,

        onboardingStatus: 'PENDING',

        headline,
        location,
        bio,

        currentRole:
          currentRoleValue || null,

        yearsOfExperience,

        skills,

        portfolio:
          portfolio || null,

        linkedin:
          linkedin || null,

        github:
          github || null,

        x:
          x || null,

        ...(profilePhotoUpload
          ? {
              profilePhotoUrl:
                profilePhotoUpload.url,

              profilePhotoPublicId:
                profilePhotoUpload.publicId
            }
          : {}),

        ...(cvUpload
          ? {
              cvUrl: cvUpload.url,
              cvName: cvUpload.fileName
            }
          : {})
      },

      /* --------------------------------------------------------------------- */
      /* Update                                                                 */
      /* --------------------------------------------------------------------- */

      update: {
        headline,
        location,
        bio,

        currentRole:
          currentRoleValue || null,

        yearsOfExperience,

        skills,

        portfolio:
          portfolio || null,

        linkedin:
          linkedin || null,

        github:
          github || null,

        x:
          x || null,

        ...(profilePhotoUpload
          ? {
              profilePhotoUrl:
                profilePhotoUpload.url,

              profilePhotoPublicId:
                profilePhotoUpload.publicId
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
          : {}),

        ...(shouldStartReview
          ? {
              onboardingStatus: 'PENDING'
            }
          : {})
      }
    });
  });

  return {
    success: true,

    role: 'JOB_SEEKER' as const,

    status: profile.onboardingStatus,

    message:
      profile.onboardingStatus === 'PENDING'
        ? 'Your job seeker profile has been submitted for review.'
        : 'Profile updated successfully.'
  };
}