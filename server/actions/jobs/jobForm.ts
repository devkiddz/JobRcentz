

import { EmploymentType, WorkMode } from '@/lib/generated/prisma/client';
import type { JobFormValues } from './jobTypes';

const WORK_MODES = [
  'ONSITE',
  'REMOTE',
  'HYBRID'
] as const satisfies readonly WorkMode[];

const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'FREELANCE',
  'TEMPORARY'
] as const satisfies readonly EmploymentType[];

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string'
    ? value.trim()
    : '';
}

function getOptionalString(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  return value || null;
}

function getOptionalNumber(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${key} must be a valid positive number.`);
  }

  return number;
}

function getSkills(formData: FormData) {
  return formData
    .getAll('skills')
    .filter(
      (value): value is string =>
        typeof value === 'string'
    )
    .flatMap(value =>
      value
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean)
    )
    .filter(
      (skill, index, array) =>
        array.indexOf(skill) === index
    );
}

function parseExpiryDate(formData: FormData) {
  const value = getString(formData, 'expiresAt');

  if (!value) {
    return null;
  }

  const date = new Date(`${value}T23:59:59`);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid expiry date.');
  }

  return date;
}

export function parseJobForm(
  formData: FormData
): JobFormValues {
  const title = getString(formData, 'title');
  const description = getString(
    formData,
    'description'
  );

  const requirements = getOptionalString(
    formData,
    'requirements'
  );

  const location = getOptionalString(
    formData,
    'location'
  );

  const workMode = getString(
    formData,
    'workMode'
  );

  const employmentType = getString(
    formData,
    'employmentType'
  );

  const salaryMin = getOptionalNumber(
    formData,
    'salaryMin'
  );

  const salaryMax = getOptionalNumber(
    formData,
    'salaryMax'
  );

  const salaryCurrency =
    getOptionalString(
      formData,
      'salaryCurrency'
    ) ?? 'NGN';

  const skills = getSkills(formData);

  const expiresAt = parseExpiryDate(formData);

  if (!title) {
    throw new Error('Job title is required.');
  }

  if (title.length > 150) {
    throw new Error(
      'Job title must not exceed 150 characters.'
    );
  }

  if (!description) {
    throw new Error(
      'Job description is required.'
    );
  }

  if (
    !WORK_MODES.includes(
      workMode as WorkMode
    )
  ) {
    throw new Error(
      'Invalid work mode.'
    );
  }

  if (
    !EMPLOYMENT_TYPES.includes(
      employmentType as EmploymentType
    )
  ) {
    throw new Error(
      'Invalid employment type.'
    );
  }

  if (
    salaryMin !== null &&
    salaryMax !== null &&
    salaryMin > salaryMax
  ) {
    throw new Error(
      'Minimum salary cannot be greater than maximum salary.'
    );
  }

  return {
    title,
    description,
    requirements,
    location,
    workMode: workMode as WorkMode,
    employmentType:
      employmentType as EmploymentType,
    salaryMin,
    salaryMax,
    salaryCurrency,
    skills,
    expiresAt
  };
}