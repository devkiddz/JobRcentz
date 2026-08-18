'use server';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export interface SaveCompanyProfileInput {
  companyName: string;
  companyWebsite?: string;
  companySize?: string;
  companyIndustry: string;
  companyDescription: string;
  companyLocation: string;
  companyAddress?: string;
  companyContactEmail: string;
  companyContactPhone?: string;
  companyLinkedIn?: string;
  companyX?: string;
  companyFacebook?: string;
  logo?: {
    url: string;
    publicId: string;
  } | null;
}

export async function saveCompanyProfile(
  input: SaveCompanyProfileInput
) {
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
   * UNASSIGNED -> may become EMPLOYER.
   * EMPLOYER -> may update their own company profile.
   * JOB_SEEKER -> may never create/update a company profile.
   * ADMIN -> does not use normal onboarding.
   */
  if (dbUser.role === 'JOB_SEEKER') {
    throw new Error(
      'This account is registered as a job seeker and cannot use employer onboarding.'
    );
  }

  if (dbUser.role === 'ADMIN') {
    throw new Error(
      'Admin accounts cannot use employer onboarding.'
    );
  }

  /* ========================================================================= */
  /* Validation                                                                */
  /* ========================================================================= */

  const companyName =
    input.companyName.trim();

  const companyIndustry =
    input.companyIndustry.trim();

  const companyDescription =
    input.companyDescription.trim();

  const companyLocation =
    input.companyLocation.trim();

  const companyContactEmail =
    input.companyContactEmail.trim();

  if (!companyName) {
    throw new Error('Company name is required.');
  }

  if (!companyIndustry) {
    throw new Error('Company industry is required.');
  }

  if (!companyDescription) {
    throw new Error('Company description is required.');
  }

  if (!companyLocation) {
    throw new Error('Company location is required.');
  }

  if (!companyContactEmail) {
    throw new Error('Company contact email is required.');
  }

  /* ========================================================================= */
  /* Existing profile                                                          */
  /* ========================================================================= */

  const existingCompany =
    await prisma.companyProfile.findUnique({
      where: {
        userId: user.id
      }
    });

  const isNewProfile = !existingCompany;

  const isResubmission =
    existingCompany?.onboardingStatus === 'REJECTED';

  const shouldStartReview =
    isNewProfile || isResubmission;

  /* ========================================================================= */
  /* Company data                                                              */
  /* ========================================================================= */

  const companyData = {
    companyName,

    companyWebsite:
      input.companyWebsite?.trim() || null,

    companySize:
      input.companySize || null,

    companyIndustry,

    companyDescription,

    companyLocation,

    companyAddress:
      input.companyAddress?.trim() || null,

    companyContactEmail,

    companyContactPhone:
      input.companyContactPhone?.trim() || null,

    companyLinkedIn:
      input.companyLinkedIn?.trim() || null,

    companyX:
      input.companyX?.trim() || null,

    companyFacebook:
      input.companyFacebook?.trim() || null,

    ...(input.logo
      ? {
          companyLogoUrl: input.logo.url,
          companyLogoPublicId: input.logo.publicId
        }
      : {})
  };

  /* ========================================================================= */
  /* Database                                                                  */
  /* ========================================================================= */

  const company = await prisma.$transaction(async tx => {
    /*
     * Establish the account type only on first onboarding.
     */
    if (dbUser.role === 'UNASSIGNED') {
      await tx.user.update({
        where: {
          id: user.id
        },
        data: {
          role: 'EMPLOYER'
        }
      });
    }

    if (existingCompany) {
      return tx.companyProfile.update({
        where: {
          userId: user.id
        },

        data: {
          ...companyData,

          ...(shouldStartReview
            ? {
                onboardingStatus: 'PENDING'
              }
            : {})
        }
      });
    }

    return tx.companyProfile.create({
      data: {
        userId: user.id,

        ...companyData,

        onboardingStatus: 'PENDING'
      }
    });
  });

  return {
    success: true,

    role: 'EMPLOYER' as const,

    status: company.onboardingStatus,

    message:
      company.onboardingStatus === 'PENDING'
        ? 'Your company profile has been submitted for review.'
        : 'Company profile updated successfully.',

    company
  };
}