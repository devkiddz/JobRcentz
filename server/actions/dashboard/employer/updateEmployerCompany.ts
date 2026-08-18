'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type UpdateEmployerCompanyResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);

  return value || null;
}

export async function updateEmployerCompany(
  formData: FormData
): Promise<UpdateEmployerCompanyResult> {
  try {
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
      return {
        success: false,
        error: 'User account not found.'
      };
    }

    if (dbUser.role !== 'EMPLOYER') {
      return {
        success: false,
        error: 'Employer account required.'
      };
    }

    if (!dbUser.company) {
      return {
        success: false,
        error: 'Company profile not found.'
      };
    }

    const companyName = getString(
      formData,
      'companyName'
    );

    const companyWebsite = getOptionalString(
      formData,
      'companyWebsite'
    );

    const companySize = getOptionalString(
      formData,
      'companySize'
    );

    const companyIndustry = getString(
      formData,
      'companyIndustry'
    );

    const companyDescription = getString(
      formData,
      'companyDescription'
    );

    const companyLocation = getString(
      formData,
      'companyLocation'
    );

    const companyAddress = getOptionalString(
      formData,
      'companyAddress'
    );

    const companyContactEmail = getString(
      formData,
      'companyContactEmail'
    );

    const companyContactPhone = getOptionalString(
      formData,
      'companyContactPhone'
    );

    const companyLinkedIn = getOptionalString(
      formData,
      'companyLinkedIn'
    );

    const companyX = getOptionalString(
      formData,
      'companyX'
    );

    const companyFacebook = getOptionalString(
      formData,
      'companyFacebook'
    );

    const companyLogoUrl = getOptionalString(
      formData,
      'companyLogoUrl'
    );

    const bannerUrl = getOptionalString(
      formData,
      'bannerUrl'
    );

    const visibility = getString(
      formData,
      'visibility'
    );

    const isDiscoverableValue = getString(
      formData,
      'isDiscoverable'
    );

    /*
     * Required fields
     */

    if (!companyName) {
      return {
        success: false,
        error: 'Company name is required.'
      };
    }

    if (companyName.length > 150) {
      return {
        success: false,
        error:
          'Company name must not exceed 150 characters.'
      };
    }

    if (!companyIndustry) {
      return {
        success: false,
        error: 'Company industry is required.'
      };
    }

    if (!companyDescription) {
      return {
        success: false,
        error: 'Company description is required.'
      };
    }

    if (!companyLocation) {
      return {
        success: false,
        error: 'Company location is required.'
      };
    }

    if (!companyContactEmail) {
      return {
        success: false,
        error:
          'Company contact email is required.'
      };
    }

    /*
     * Basic email validation.
     */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(companyContactEmail)) {
      return {
        success: false,
        error:
          'Please provide a valid company contact email.'
      };
    }

    /*
     * Validate URLs only when supplied.
     */

    const urlFields = [
      {
        value: companyWebsite,
        label: 'Company website'
      },
      {
        value: companyLinkedIn,
        label: 'LinkedIn URL'
      },
      {
        value: companyX,
        label: 'X URL'
      },
      {
        value: companyFacebook,
        label: 'Facebook URL'
      },
      {
        value: companyLogoUrl,
        label: 'Company logo URL'
      },
      {
        value: bannerUrl,
        label: 'Banner URL'
      }
    ];

    for (const field of urlFields) {
      if (!field.value) {
        continue;
      }

      try {
        const url = new URL(field.value);

        if (
          url.protocol !== 'http:' &&
          url.protocol !== 'https:'
        ) {
          throw new Error();
        }
      } catch {
        return {
          success: false,
          error: `${field.label} must be a valid URL.`
        };
      }
    }

    /*
     * Visibility must correspond to an actual
     * Prisma enum value.
     */

    if (
      ![
        'PUBLIC',
        'UNLISTED',
        'PRIVATE'
      ].includes(visibility)
    ) {
      return {
        success: false,
        error: 'Invalid profile visibility.'
      };
    }

    /*
     * HTML checkbox values normally arrive as
     * "true" or "false".
     */

    if (
      isDiscoverableValue !== 'true' &&
      isDiscoverableValue !== 'false'
    ) {
      return {
        success: false,
        error: 'Invalid discoverability value.'
      };
    }

    const isDiscoverable =
      isDiscoverableValue === 'true';

    await prisma.companyProfile.update({
      where: {
        id: dbUser.company.id
      },
      data: {
        companyName,
        companyWebsite,
        companySize,
        companyIndustry,
        companyDescription,
        companyLocation,
        companyAddress,
        companyContactEmail,
        companyContactPhone,
        companyLinkedIn,
        companyX,
        companyFacebook,
        companyLogoUrl,
        bannerUrl,
        visibility:
          visibility as
            | 'PUBLIC'
            | 'UNLISTED'
            | 'PRIVATE',
        isDiscoverable
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/employer');
    revalidatePath('/dashboard/employer/company');

    return {
      success: true,
      message: 'Company profile updated successfully.'
    };
  } catch (error) {
    console.error(
      'updateEmployerCompany failed:',
      error
    );

    return {
      success: false,
      error:
        'Something went wrong while updating the company profile.'
    };
  }
}