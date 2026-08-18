'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type UpdateJobResult =
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

export async function updateJob(
  jobId: string,
  formData: FormData
): Promise<UpdateJobResult> {
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
        error: 'Only employer accounts can edit job listings.'
      };
    }

    if (!dbUser.company) {
      return {
        success: false,
        error: 'Complete your company profile before editing jobs.'
      };
    }

    if (dbUser.company.onboardingStatus !== 'APPROVED') {
      return {
        success: false,
        error: 'Your company profile must be approved before editing jobs.'
      };
    }

    const existingJob = await prisma.job.findFirst({
      where: {
        id: jobId,
        companyId: dbUser.company.id,
        postedById: dbUser.id
      },
      select: {
        id: true,
        status: true
      }
    });

    if (!existingJob) {
      return {
        success: false,
        error: 'Job not found or you do not have permission to edit it.'
      };
    }

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
        error: 'Job title must not exceed 150 characters.'
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
      !['ONSITE', 'REMOTE', 'HYBRID'].includes(workMode)
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

      if (
        existingJob.status === 'PUBLISHED' &&
        parsedDate <= new Date()
      ) {
        return {
          success: false,
          error:
            'Expiry date must be in the future for a published job.'
        };
      }

      expiresAt = parsedDate;
    }

    if (
      existingJob.status === 'PUBLISHED' &&
      !expiresAt
    ) {
      return {
        success: false,
        error:
          'A published job must have an expiry date.'
      };
    }

    const job = await prisma.job.update({
      where: {
        id: existingJob.id
      },
      data: {
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
        expiresAt
      },
      select: {
        id: true
      }
    });

    revalidatePath('/dashboard/jobs');
    revalidatePath(`/dashboard/jobs/${job.id}/edit`);
    revalidatePath(`/jobs/${job.id}`);
    revalidatePath('/jobs');

    return {
      success: true,
      jobId: job.id
    };
  } catch (error) {
    console.error('updateJob failed:', error);

    return {
      success: false,
      error: 'Something went wrong while updating the job.'
    };
  }
}