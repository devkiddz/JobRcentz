// server/utils/zodSchemas.ts

import { z } from 'zod';

/* ========================================================================= */
/* Shared Helpers                                                            */
/* ========================================================================= */

const optionalUrl = (fieldName: string) =>
  z
    .string()
    .trim()
    .refine(
      value => {
        if (value === '') return true;

        return z.string().url().safeParse(value).success;
      },
      {
        message: `Enter a valid ${fieldName} URL.`
      }
    )
    .optional();

const optionalString = (max: number, message: string) =>
  z.string().trim().max(max, message).optional();

const optionalFile = () => z.custom<File | undefined>(value => {
  return value === undefined || value instanceof File;
});

/* ========================================================================= */
/* Job Seeker Profile Form                                                   */
/* ========================================================================= */

export const JOB_SEEKER_FORM_SCHEMA = z.object({
  /* ----------------------------------------------------------------------- */
  /* Basic / Professional Information                                        */
  /* ----------------------------------------------------------------------- */

  fullName: z
    .string()
    .trim()
    .min(2, 'Full name is required.')
    .max(120, 'Full name must not exceed 120 characters.'),

  headline: z
    .string()
    .trim()
    .min(3, 'Professional headline is required.')
    .max(120, 'Headline must not exceed 120 characters.'),

  location: z
    .string()
    .trim()
    .min(2, 'Location is required.')
    .max(120, 'Location must not exceed 120 characters.'),

  bio: z
    .string()
    .trim()
    .min(20, 'Professional summary must be at least 20 characters.')
    .max(1000, 'Professional summary must not exceed 1000 characters.'),

  currentRole: optionalString(
    120,
    'Role must not exceed 120 characters.'
  ),

  yearsOfExperience: z
    .string()
    .trim()
    .refine(
      value => {
        if (value === '') return true;

        const number = Number(value);

        return (
          Number.isInteger(number) &&
          number >= 0 &&
          number <= 100
        );
      },
      {
        message: 'Years of experience must be a whole number between 0 and 100.'
      }
    )
    .optional(),

  skills: z
    .string()
    .trim()
    .max(
      500,
      'Skills must not exceed 500 characters.'
    )
    .optional(),

  /* ----------------------------------------------------------------------- */
  /* Professional Links                                                      */
  /* ----------------------------------------------------------------------- */

  portfolio: optionalUrl('portfolio'),

  linkedin: optionalUrl('LinkedIn'),

  github: optionalUrl('GitHub'),

  x: optionalUrl('X'),

  /* ----------------------------------------------------------------------- */
  /* Profile Photo                                                            */
  /* ----------------------------------------------------------------------- */

  profilePhoto: optionalFile()
    .refine(
      file =>
        !file ||
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      {
        message: 'Profile photo must be JPEG, PNG or WebP.'
      }
    )
    .refine(
      file =>
        !file ||
        file.size <= 5 * 1024 * 1024,
      {
        message: 'Profile photo must not exceed 5MB.'
      }
    ),

  /* ----------------------------------------------------------------------- */
  /* CV                                                                       */
  /* ----------------------------------------------------------------------- */

  cv: optionalFile()
    .refine(
      file =>
        !file ||
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ].includes(file.type),
      {
        message: 'CV must be a PDF, DOC or DOCX file.'
      }
    )
    .refine(
      file =>
        !file ||
        file.size <= 10 * 1024 * 1024,
      {
        message: 'CV must not exceed 10MB.'
      }
    )
});

/* ========================================================================= */
/* Company Profile Form                                                      */
/* ========================================================================= */

export const COMPANY_FORM_SCHEMA = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, 'Company name is required.')
    .max(
      150,
      'Company name must not exceed 150 characters.'
    ),

  companyWebsite: optionalUrl('company website'),

  companySize: z
    .enum([
      '1-10',
      '11-50',
      '51-200',
      '201-500',
      '501-1000',
      '1001+'
    ])
    .optional(),

  companyIndustry: z
    .string()
    .trim()
    .min(2, 'Company industry is required.')
    .max(
      120,
      'Company industry must not exceed 120 characters.'
    ),

  companyDescription: z
    .string()
    .trim()
    .min(
      20,
      'Company description must be at least 20 characters.'
    )
    .max(
      2000,
      'Company description must not exceed 2000 characters.'
    ),

  companyLocation: z
    .string()
    .trim()
    .min(2, 'Company location is required.')
    .max(
      120,
      'Company location must not exceed 120 characters.'
    ),

  companyAddress: z
    .string()
    .trim()
    .max(
      300,
      'Company address must not exceed 300 characters.'
    )
    .optional(),

  companyContactEmail: z
    .string()
    .trim()
    .email('Enter a valid contact email.'),

  companyContactPhone: z
    .string()
    .trim()
    .max(
      30,
      'Contact phone must not exceed 30 characters.'
    )
    .optional(),

  companyLinkedIn: optionalUrl('LinkedIn'),

  companyX: optionalUrl('X'),

  companyFacebook: optionalUrl('Facebook'),

  companyLogo: optionalFile()
    .refine(
      file =>
        !file ||
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      {
        message: 'Company logo must be JPEG, PNG or WebP.'
      }
    )
    .refine(
      file =>
        !file ||
        file.size <= 5 * 1024 * 1024,
      {
        message: 'Company logo must not exceed 5MB.'
      }
    )
});

/* ========================================================================= */
/* Inferred Types                                                            */
/* ========================================================================= */

export type JobSeekerFormValues = z.infer<
  typeof JOB_SEEKER_FORM_SCHEMA
>;

export type CompanyFormValues = z.infer<
  typeof COMPANY_FORM_SCHEMA
>;