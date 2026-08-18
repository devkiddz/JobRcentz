'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type CreateJobResult =
  | {
      success: true;
      jobId: string;
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

function getOptionalDecimal(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number;
}

function getSkills(formData: FormData) {
  const rawSkills = formData.getAll('skills');

  return rawSkills
    .filter(
      (skill): skill is string =>
        typeof skill === 'string'
    )
    .flatMap(skill =>
      skill
        .split(',')
        .map(value => value.trim())
        .filter(Boolean)
    )
    .filter(
      (skill, index, array) =>
        array.indexOf(skill) === index
    );
}

export async function createJob(
  formData: FormData
): Promise<CreateJobResult> {
  try {
    const user = await requireAuth();

    /*
     * Better Auth's session user does not necessarily expose
     * our application role, so verify the authoritative role
     * from our database.
     */
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
            onboardingStatus: true
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
        error:
          'Only employer accounts can create job listings.'
      };
    }

    if (!dbUser.company) {
      return {
        success: false,
        error:
          'Complete your company profile before creating a job.'
      };
    }

    if (dbUser.company.onboardingStatus !== 'APPROVED') {
      return {
        success: false,
        error:
          'Your company profile must be approved before posting jobs.'
      };
    }

    /*
     * Read and validate job data.
     */
    const title = getString(formData, 'title');
    const description = getString(formData, 'description');
    const requirements = getOptionalString(
      formData,
      'requirements'
    );

    const location = getOptionalString(
      formData,
      'location'
    );

    const workMode = getString(formData, 'workMode');
    const employmentType = getString(
      formData,
      'employmentType'
    );

    const salaryMin = getOptionalDecimal(
      formData,
      'salaryMin'
    );

    const salaryMax = getOptionalDecimal(
      formData,
      'salaryMax'
    );

    const salaryCurrency =
      getOptionalString(formData, 'salaryCurrency') ??
      'NGN';

    const expiresAtValue = getString(
      formData,
      'expiresAt'
    );

    const status = getString(formData, 'status');

    const skills = getSkills(formData);

    if (!title) {
      return {
        success: false,
        error: 'Job title is required.'
      };
    }

    if (title.length > 150) {
      return {
        success: false,
        error:
          'Job title must not exceed 150 characters.'
      };
    }

    if (!description) {
      return {
        success: false,
        error: 'Job description is required.'
      };
    }

    if (!workMode) {
      return {
        success: false,
        error: 'Work mode is required.'
      };
    }

    if (!employmentType) {
      return {
        success: false,
        error: 'Employment type is required.'
      };
    }

    if (
      !['ONSITE', 'REMOTE', 'HYBRID'].includes(
        workMode
      )
    ) {
      return {
        success: false,
        error: 'Invalid work mode.'
      };
    }

    if (
      ![
        'FULL_TIME',
        'PART_TIME',
        'CONTRACT',
        'INTERNSHIP',
        'FREELANCE',
        'TEMPORARY'
      ].includes(employmentType)
    ) {
      return {
        success: false,
        error: 'Invalid employment type.'
      };
    }

    if (
      status !== 'DRAFT' &&
      status !== 'PUBLISHED'
    ) {
      return {
        success: false,
        error: 'Invalid job status.'
      };
    }

    if (
      salaryMin !== null &&
      salaryMax !== null &&
      salaryMin > salaryMax
    ) {
      return {
        success: false,
        error:
          'Minimum salary cannot be greater than maximum salary.'
      };
    }

    let expiresAt: Date | null = null;

    if (expiresAtValue) {
      const parsedDate = new Date(
        `${expiresAtValue}T23:59:59`
      );

      if (Number.isNaN(parsedDate.getTime())) {
        return {
          success: false,
          error: 'Invalid expiry date.'
        };
      }

      if (parsedDate <= new Date()) {
        return {
          success: false,
          error:
            'Expiry date must be in the future.'
        };
      }

      expiresAt = parsedDate;
    }

    /*
     * Publishing requires an expiry date.
     *
     * This gives us a sensible production rule for
     * publicly visible listings.
     */
    if (status === 'PUBLISHED' && !expiresAt) {
      return {
        success: false,
        error:
          'An expiry date is required when publishing a job.'
      };
    }

    const job = await prisma.job.create({
      data: {
        companyId: dbUser.company.id,
        postedById: dbUser.id,

        title,
        description,
        requirements,

        location,

        workMode:
          workMode as
            | 'ONSITE'
            | 'REMOTE'
            | 'HYBRID',

        employmentType:
          employmentType as
            | 'FULL_TIME'
            | 'PART_TIME'
            | 'CONTRACT'
            | 'INTERNSHIP'
            | 'FREELANCE'
            | 'TEMPORARY',

        salaryMin,
        salaryMax,
        salaryCurrency,

        skills,

        status:
          status === 'PUBLISHED'
            ? 'PUBLISHED'
            : 'DRAFT',

        publishedAt:
          status === 'PUBLISHED'
            ? new Date()
            : null,

        expiresAt
      },
      select: {
        id: true
      }
    });

    revalidatePath('/dashboard/jobs');
    revalidatePath('/jobs');

    return {
      success: true,
      jobId: job.id
    };
  } catch (error) {
    console.error(
      'createJob failed:',
      error
    );

    return {
      success: false,
      error:
        'Something went wrong while creating the job.'
    };
  }
}