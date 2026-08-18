import { JobApprovalStatus, JobStatus } from "@/lib/generated/prisma/client";


export type JobLifecycleState = {
  status: JobStatus;
  approvalStatus: JobApprovalStatus;
};

export function createDraftLifecycle() {
  return {
    status: 'DRAFT' as const,
    approvalStatus: 'PENDING' as const,
    publishedAt: null,
    approvedAt: null,
    rejectedAt: null
  };
}

export function submitJobLifecycle() {
  return {
    status: 'PUBLISHED' as const,
    approvalStatus: 'PENDING' as const,
    publishedAt: null,
    approvedAt: null,
    rejectedAt: null
  };
}

export function approveJobLifecycle() {
  return {
    status: 'PUBLISHED' as const,
    approvalStatus: 'APPROVED' as const,
    publishedAt: new Date(),
    approvedAt: new Date(),
    rejectedAt: null
  };
}

export function rejectJobLifecycle() {
  return {
    status: 'PUBLISHED' as const,
    approvalStatus: 'REJECTED' as const,
    publishedAt: null,
    approvedAt: null,
    rejectedAt: new Date()
  };
}