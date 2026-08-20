'use client';

import { useTransition } from 'react';

import { manageInterviewTask } from '@/server/actions/dashboard/employer/interviews/manageInterviewTask';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type InterviewTaskActionsProps = {
  taskId: string;
  status: TaskStatus;
};

export default function InterviewTaskActions({ taskId, status }: InterviewTaskActionsProps) {
  const [pending, startTransition] = useTransition();

  function handleAction(action: 'START' | 'COMPLETE' | 'CANCEL') {
    startTransition(async () => {
      const result = await manageInterviewTask(taskId, action);

      if (!result.success) {
        window.alert(result.error);
      }
    });
  }

  if (status === 'COMPLETED' || status === 'CANCELLED') {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {status === 'TODO' && (
        <button
          type="button"
          disabled={pending}
          onClick={() => handleAction('START')}
          className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {pending ? '...' : 'Start'}
        </button>
      )}

      {status === 'IN_PROGRESS' && (
        <button
          type="button"
          disabled={pending}
          onClick={() => handleAction('COMPLETE')}
          className="inline-flex h-8 items-center rounded-lg bg-emerald-600 px-2.5 text-[11px] font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
          {pending ? '...' : 'Complete'}
        </button>
      )}

      <button
        type="button"
        disabled={pending}
        onClick={() => handleAction('CANCEL')}
        className="inline-flex h-8 items-center rounded-lg border px-2.5 text-[11px] font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50">
        Cancel
      </button>
    </div>
  );
}
