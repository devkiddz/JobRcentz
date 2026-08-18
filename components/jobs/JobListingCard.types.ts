import type {
  EmploymentType,
  JobApprovalStatus,
  JobStatus,
  WorkMode
} from '@/lib/generated/prisma/client';

export type JobListingCardRole =
  | 'PUBLIC'
  | 'APPLICANT'
  | 'EMPLOYER'
  | 'ADMIN';

export interface JobListingCardJob {
  id: string;
  title: string;
  description: string;
  location: string | null;

  workMode: WorkMode;
  employmentType: EmploymentType;

  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;

  skills: string[];

  status: JobStatus;
  approvalStatus: JobApprovalStatus;

  publishedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  company: {
    id: string;
    companyName: string;
    companyLogoUrl: string | null;
  };

  applicationCount: number;
}

export interface JobListingCardProps {
  job: JobListingCardJob;
  role: JobListingCardRole;
  showCompany?: boolean;
  showDescription?: boolean;
  showSalary?: boolean;
}