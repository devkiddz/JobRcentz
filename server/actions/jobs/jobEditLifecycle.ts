
import {
  JobApprovalStatus,
  JobStatus
} from '@/lib/generated/prisma/client';

type ExistingJob = {
  status: JobStatus;
  approvalStatus: JobApprovalStatus;
};

export function getEditLifecycle(
  job: ExistingJob
) {
  /*
   * Draft jobs remain drafts.
   *
   * They do not need public moderation until
   * the employer submits them for publication.
   */
  if (job.status === 'DRAFT') {
    return {
      status: 'DRAFT' as const,
      approvalStatus: 'PENDING' as const,
      publishedAt: null,
      approvedAt: null,
      rejectedAt: null
    };
  }

  /*
   * Editing a published job invalidates its previous
   * approval.
   *
   * The edited job returns to the moderation queue
   * and must be approved again before becoming public.
   */
  if (job.status === 'PUBLISHED') {
    return {
      status: 'DRAFT' as const,
      approvalStatus: 'PENDING' as const,
      publishedAt: null,
      approvedAt: null,
      rejectedAt: null
    };
  }

  /*
   * Closed jobs remain closed.
   *
   * Reopening is intentionally handled by a separate
   * lifecycle action rather than implicitly through editing.
   */
  return {
    status: 'CLOSED' as const,
    approvalStatus: job.approvalStatus,
    publishedAt: null,
    approvedAt: null,
    rejectedAt: null
  };
}