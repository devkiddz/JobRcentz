'use client';

import { useState, useTransition } from 'react';
import { Check, CirclePlay, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { manageInterviewTask } from '@/server/actions/dashboard/employer/interviews/manageInterviewTask';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type InterviewTaskActionsProps = {
  taskId: string;
  status: TaskStatus;
};

export default function InterviewTaskActions({ taskId, status }: InterviewTaskActionsProps) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAction(action: 'START' | 'COMPLETE' | 'CANCEL') {
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

  if (status === 'COMPLETED' || status === 'CANCELLED') {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {status === 'TODO' && (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => handleAction('START')}
            className="h-8 gap-1.5 px-2.5 text-xs">
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <CirclePlay className="size-3.5" />}
            Start
          </Button>
        )}

        {status === 'IN_PROGRESS' && (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => handleAction('COMPLETE')}
            className="h-8 gap-1.5 px-2.5 text-xs">
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
            Complete
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => handleAction('CANCEL')}
          className="h-8 gap-1.5 px-2.5 text-xs text-destructive hover:text-destructive">
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
          Cancel
        </Button>
      </div>

      {error && (
        <p role="alert" className="max-w-[220px] text-right text-[11px] leading-4 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
