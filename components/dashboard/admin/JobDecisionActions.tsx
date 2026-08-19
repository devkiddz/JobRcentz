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
  const [reason, setReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

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

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError('Please provide a reason for rejecting this job.');
      return;
    }

    startTransition(async () => {
      const result = await rejectJob(jobId, trimmedReason);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setReason('');
      setShowRejectForm(false);

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
        This job has already been rejected.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!showRejectForm ? (
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
            onClick={() => {
              setError(null);
              setShowRejectForm(true);
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-destructive/30 px-5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50">
            <X className="size-4" />
            Reject Job
          </button>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div>
            <h3 className="text-sm font-semibold">Why are you rejecting this job?</h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Give the employer a clear explanation of what needs to be corrected before the job can be
              approved.
            </p>
          </div>

          <textarea
            value={reason}
            onChange={event => setReason(event.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="Example: The job description does not clearly explain the responsibilities of the role. Please provide more specific responsibilities and clarify the required experience."
            className="w-full resize-y rounded-lg border bg-background px-3 py-2.5 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus:border-destructive focus:ring-2 focus:ring-destructive/20"
          />

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{reason.length}/1000</span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setReason('');
                  setError(null);
                  setShowRejectForm(false);
                }}
                className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50">
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending || !reason.trim()}
                onClick={handleReject}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-destructive px-4 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50">
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
