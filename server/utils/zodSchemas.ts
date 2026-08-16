import { z } from 'zod';

const optionalUrl = (message: string) =>
  z
    .string()
    .trim()
    .refine(value => value === '' || z.string().url().safeParse(value).success, {
      message
    });

export const COMPANY_FORM_SCHEMA = z.object({
  companyName: z.string().trim().min(2, {
    message: 'Company name must be at least 2 characters long'
  }),

  companyWebsite: optionalUrl('Invalid website URL'),

  companySize: z
    .enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'], {
      message: 'Invalid company size'
    })
    .optional(),

  companyIndustry: z.string().trim().min(3, {
    message: 'Company industry must be at least 3 characters long'
  }),

  companyDescription: z.string().trim().min(20, {
    message: 'Company description must be at least 20 characters long'
  }),

  companyLocation: z.string().trim().min(2, {
    message: 'Company location must be at least 2 characters long'
  }),

  companyAddress: z.string().trim().optional(),

  companyLogo: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: 'Logo must be less than 5MB'
    })
    .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
      message: 'Logo must be a JPEG, PNG, or WebP image'
    })
    .optional(),

  companyContactEmail: z.string().trim().email({
    message: 'Invalid email address'
  }),

  companyContactPhone: z
    .string()
    .trim()
    .optional()
    .refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
      message: 'Enter a valid phone number'
    }),

  companyLinkedIn: optionalUrl('Invalid LinkedIn URL'),

  companyX: optionalUrl('Invalid X URL'),

  companyFacebook: optionalUrl('Invalid Facebook URL')
});