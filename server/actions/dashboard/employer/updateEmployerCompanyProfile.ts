'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

const companyVisibilities = [
  'PUBLIC',
  'UNLISTED',
  'PRIVATE'
] as const;

type CompanyVisibility =
  (typeof companyVisibilities)[number];

export interface UpdateEmployerCompanyProfileInput {
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

  visibility: CompanyVisibility;
  isDiscoverable: boolean;

  logo?: {
    url: string;
    publicId: string;
  } | null;

  banner?: {
    url: string;
    publicId: string;
  } | null;
}

export async function updateEmployerCompanyProfile(
  input: UpdateEmployerCompanyProfileInput
) {
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
          id: true,
          userId: true,
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

  /*
   * Validate company visibility server-side.
   *
   * The client already restricts this to the supported
   * options, but server actions must not trust client input.
   */
  if (
    !companyVisibilities.includes(
      input.visibility as CompanyVisibility
    )
  ) {
    throw new Error('Invalid company visibility.');
  }

  const companyName = input.companyName.trim();

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
    throw new Error(
      'Company description is required.'
    );
  }

  if (!companyLocation) {
    throw new Error('Company location is required.');
  }

  if (!companyContactEmail) {
    throw new Error(
      'Company contact email is required.'
    );
  }

  if (companyDescription.length < 20) {
    throw new Error(
      'Company description must contain at least 20 characters.'
    );
  }

  /*
   * Validate URLs server-side as well.
   */
  function normalizeUrl(
    value?: string
  ): string | null {
    const trimmed = value?.trim();

    if (!trimmed) {
      return null;
    }

    try {
      const url = new URL(trimmed);

      if (
        url.protocol !== 'http:' &&
        url.protocol !== 'https:'
      ) {
        throw new Error();
      }

      return url.toString();
    } catch {
      throw new Error(
        'One or more provided URLs are invalid.'
      );
    }
  }

  const companyWebsite =
    normalizeUrl(input.companyWebsite);

  const companyLinkedIn =
    normalizeUrl(input.companyLinkedIn);

  const companyX =
    normalizeUrl(input.companyX);

  const companyFacebook =
    normalizeUrl(input.companyFacebook);

  const companyLogoChanged =
    input.logo !== undefined;

  const companyBannerChanged =
    input.banner !== undefined;

  /*
   * Persist the complete employer company profile
   * atomically.
   */
  const company = await prisma.$transaction(
    async tx => {
      return tx.companyProfile.update({
        where: {
          id: dbUser.company!.id
        },

        data: {
          companyName,

          companyWebsite,

          companySize:
            input.companySize?.trim() || null,

          companyIndustry,

          companyDescription,

          companyLocation,

          companyAddress:
            input.companyAddress?.trim() || null,

          companyContactEmail,

          companyContactPhone:
            input.companyContactPhone?.trim() ||
            null,

          companyLinkedIn,

          companyX,

          companyFacebook,

          /*
           * Company visibility/discoverability.
           *
           * These were previously displayed by the editor
           * but were not being persisted.
           */
          visibility:
            input.visibility as CompanyVisibility,

          isDiscoverable:
            input.isDiscoverable,

          /*
           * Only modify media fields when the caller
           * explicitly supplied the corresponding asset.
           */
          ...(companyLogoChanged
            ? {
                companyLogoUrl:
                  input.logo?.url ?? null,

                companyLogoPublicId:
                  input.logo?.publicId ?? null
              }
            : {}),

          ...(companyBannerChanged
            ? {
                bannerUrl:
                  input.banner?.url ?? null,

                bannerPublicId:
                  input.banner?.publicId ?? null
              }
            : {})
        }
      });
    }
  );

  /*
   * Revalidate employer dashboard/company pages so the
   * newly persisted values are reflected immediately.
   */
  revalidatePath('/dashboard');

  revalidatePath('/dashboard/employer');

  revalidatePath(
    '/dashboard/employer/company'
  );

  /*
   * Return the old media IDs only after the database
   * transaction succeeds. The client can then safely
   * remove the old Cloudinary assets.
   */
  return {
    success: true,

    company,

    previousMedia: {
      logoPublicId:
        companyLogoChanged
          ? dbUser.company.companyLogoPublicId
          : null,

      bannerPublicId:
        companyBannerChanged
          ? dbUser.company.bannerPublicId
          : null
    }
  };
}