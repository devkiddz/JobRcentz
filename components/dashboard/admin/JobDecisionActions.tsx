'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, X } from 'lucide-react';

import { approveJob } from '@/server/actions/admin/jobs/approveJob';
import { rejectJob } from '@/server/actions/admin/jobs/rejectJob';

type JobApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function JobDecisionActions({ jobId, status }: { jobId: string; status: JobApprovalStatus }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleApprove() {
    setError(null);

    startTransition(async () => {
      const result = await approveJob(jobId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  function handleReject() {
    setError(null);

    startTransition(async () => {
      const result = await rejectJob(jobId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  if (status === 'APPROVED') {
    return (
      <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
        This job has been approved and is visible to candidates.
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        This job has been rejected and is not visible to candidates.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={isPending}
          onClick={handleApprove}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Approve Job
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={handleReject}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-destructive/30 px-5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
          Reject Job
        </button>
      </div>
    </div>
  );
}
