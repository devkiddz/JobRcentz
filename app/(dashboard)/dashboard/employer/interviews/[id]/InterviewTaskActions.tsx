'use client';

import { useState, useTransition } from 'react';
import { Check, CirclePlay, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { manageInterviewTask } from '@/server/actions/dashboard/employer/interviews/manageInterview';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type TaskAction = 'START' | 'COMPLETE' | 'CANCEL';

type InterviewTaskActionsProps = {
  taskId: string;
  status: TaskStatus;
};

export default function InterviewTaskActions({ taskId, status }: InterviewTaskActionsProps) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAction(action: TaskAction) {
    if (pending) return;

    if (action === 'CANCEL') {
      const confirmed = window.confirm(
        'Cancel this interview task?\n\nThis task will be marked as cancelled and can no longer be completed.'
      );

      if (!confirmed) return;
    }

    setError(null);

    startTransition(async () => {
      const result = await manageInterviewTask(taskId, action);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  /*
   * Completed and cancelled tasks have no available actions.
   */
  if (status === 'COMPLETED' || status === 'CANCELLED') {
    return null;
  }

  const starting = pending && status === 'TODO';
  const completing = pending && status === 'IN_PROGRESS';
  const cancelling = pending && status !== 'COMPLETED';

  return (
    <div className="w-full min-w-0 space-y-2 sm:w-auto">
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        {status === 'TODO' && (
          <button
            type="button"
            disabled={pending}
            onClick={() => handleAction('START')}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CirclePlay className="h-4 w-4" />}

            {starting ? 'Starting...' : 'Start task'}
          </button>
        )}

        {status === 'IN_PROGRESS' && (
          <button
            type="button"
            disabled={pending}
            onClick={() => handleAction('COMPLETE')}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {completing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}

            {completing ? 'Completing...' : 'Complete task'}
          </button>
        )}

        <button
          type="button"
          disabled={pending}
          onClick={() => handleAction('CANCEL')}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-background px-4 text-xs font-medium text-destructive transition-colors hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}

          {cancelling ? 'Cancelling...' : 'Cancel task'}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
