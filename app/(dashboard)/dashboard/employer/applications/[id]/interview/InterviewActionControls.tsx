'use client';

import { useState, useTransition } from 'react';
import { Check, CirclePlay, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { manageInterviewTask } from '@/server/actions/dashboard/employer/interviews/manageInterview';

type InterviewStatus = 'SCHEDULED' | 'RESCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

type InterviewActionControlsProps = {
  interviewId: string;
  status: InterviewStatus;
};

export default function InterviewActionControls({ interviewId, status }: InterviewActionControlsProps) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAction(action: 'START' | 'COMPLETE' | 'CANCEL') {
    setError(null);

    startTransition(async () => {
      /*
       * This component currently controls the interview-level actions.
       *
       * If your interview itself is managed by a separate server action,
       * replace this call with that action.
       */
      const result = await manageInterviewTask(interviewId, action);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  const canStart = status === 'SCHEDULED' || status === 'RESCHEDULED';

  const canComplete = status === 'IN_PROGRESS';

  const canCancel = status === 'SCHEDULED' || status === 'RESCHEDULED' || status === 'IN_PROGRESS';

  if (!canStart && !canComplete && !canCancel) {
    return null;
  }

  return (
    <div className="w-full space-y-2 sm:w-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {canStart && (
          <button
            type="button"
            disabled={pending}
            onClick={() => handleAction('START')}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <CirclePlay className="size-4" />}

            {pending ? 'Starting...' : 'Start interview'}
          </button>
        )}

        {canComplete && (
          <button
            type="button"
            disabled={pending}
            onClick={() => handleAction('COMPLETE')}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}

            {pending ? 'Completing...' : 'Complete interview'}
          </button>
        )}

        {canCancel && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              const confirmed = window.confirm(
                'Cancel this interview?\n\nThis action will mark the interview as cancelled.'
              );

              if (confirmed) {
                handleAction('CANCEL');
              }
            }}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-background px-4 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            Cancel interview
          </button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="max-w-md rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
