'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, CirclePlay, Edit3, Loader2, X } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { manageInterviewTask } from '@/server/actions/dashboard/employer/interviews/manageInterviewTask';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type Props = { taskId: string; interviewId: string; status: TaskStatus };

export default function InterviewTaskActions({ taskId, interviewId, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: 'START' | 'COMPLETE' | 'CANCEL') {
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

  return (
    <div className="flex min-w-0 flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {status !== 'COMPLETED' && status !== 'CANCELLED' && (
          <button
            type="button"
            className={buttonVariants({
              className: 'h-8 gap-1.5 px-2.5 text-xs',
              size: 'sm',
              variant: 'outline'
            })}>
            <Link href={`/dashboard/employer/interviews/${interviewId}/tasks/${taskId}/edit`}>
              <Edit3 className="size-3.5" />
              Edit
            </Link>
          </button>
        )}
        {status === 'TODO' && (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => run('START')}
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
            onClick={() => run('COMPLETE')}
            className="h-8 gap-1.5 px-2.5 text-xs">
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}Complete
          </Button>
        )}
        {status !== 'COMPLETED' && status !== 'CANCELLED' && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run('CANCEL')}
            className="h-8 gap-1.5 px-2.5 text-xs text-destructive hover:text-destructive">
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}Cancel
          </Button>
        )}
      </div>
      {error && (
        <p role="alert" className="max-w-[220px] text-right text-[11px] leading-4 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
