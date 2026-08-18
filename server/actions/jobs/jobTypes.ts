import { EmploymentType, JobApprovalStatus, JobStatus, WorkMode } from "@/lib/generated/prisma/client";

export type JobFormValues = {
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  workMode: WorkMode;
  employmentType: EmploymentType;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  skills: string[];
  expiresAt: Date | null;
};

export type EmployerJobState = {
  status: JobStatus;
  approvalStatus: JobApprovalStatus;
};

export type JobLifecycle = {
  status: JobStatus;
  approvalStatus: JobApprovalStatus;
  publishedAt: Date | null;
  approvedAt: Date | null;
  rejectedAt: Date | null;
};