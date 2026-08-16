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

export async function saveCompanyProfile(input: SaveCompanyProfileInput) {
  const user = await requireAuth();

  const companyName = input.companyName.trim();
  const companyIndustry = input.companyIndustry.trim();
  const companyDescription = input.companyDescription.trim();
  const companyLocation = input.companyLocation.trim();
  const companyContactEmail = input.companyContactEmail.trim();

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

  const companyData = {
    companyName,
    companyWebsite: input.companyWebsite?.trim() || null,
    companySize: input.companySize || null,
    companyIndustry,
    companyDescription,
    companyLocation,
    companyAddress: input.companyAddress?.trim() || null,
    companyContactEmail,
    companyContactPhone: input.companyContactPhone?.trim() || null,
    companyLinkedIn: input.companyLinkedIn?.trim() || null,
    companyX: input.companyX?.trim() || null,
    companyFacebook: input.companyFacebook?.trim() || null,

    ...(input.logo
      ? {
          companyLogoUrl: input.logo.url,
          companyLogoPublicId: input.logo.publicId
        }
      : {})
  };

  const existingCompany = await prisma.companyProfile.findUnique({
    where: {
      userId: user.id
    }
  });

  const company = existingCompany
    ? await prisma.companyProfile.update({
        where: {
          userId: user.id
        },
        data: companyData
      })
    : await prisma.companyProfile.create({
        data: {
          userId: user.id,
          ...companyData
        }
      });

  return {
    success: true,
    message: existingCompany
      ? 'Company profile updated successfully.'
      : 'Company profile created successfully.',
    company
  };
}