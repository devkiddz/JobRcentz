'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

import { manageInterview } from '@/server/actions/dashboard/employer/interviews/manageInterview';

type InterviewAction = 'START' | 'COMPLETE' | 'CANCEL' | 'RESTORE';

type InterviewActionControlsProps = {
  interviewId: string;
  status: string;
};

type DialogAction = Exclude<InterviewAction, 'CANCEL'> | 'CANCEL' | null;

export function InterviewActionControls({ interviewId, status }: InterviewActionControlsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [dialogAction, setDialogAction] = useState<DialogAction>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  function openDialog(action: DialogAction) {
    if (isPending) return;

    setMessage(null);
    setError(null);

    if (action !== 'CANCEL') {
      setCancellationReason('');
    }

    setDialogAction(action);
  }

  function closeDialog() {
    if (isPending) return;

    setDialogAction(null);
    setCancellationReason('');
  }

  function runAction(action: InterviewAction, formData?: FormData) {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await manageInterview(interviewId, action, formData);

      if (!result.success) {
        setError(result.error ?? 'Unable to update interview session. Please try again.');
        return;
      }

      const successMessage =
        action === 'START'
          ? 'Interview session launched.'
          : action === 'COMPLETE'
            ? 'Interview session finalized.'
            : action === 'CANCEL'
              ? 'Interview session cancelled.'
              : 'Interview session reopened.';

      setMessage(successMessage);
      setDialogAction(null);
      setCancellationReason('');

      router.refresh();
    });
  }

  function handleDialogConfirm() {
    if (!dialogAction || isPending) return;

    if (dialogAction === 'CANCEL') {
      const reason = cancellationReason.trim();

      if (!reason) {
        setError('Please state a reason for cancellation.');
        return;
      }

      const formData = new FormData();
      formData.set('reason', reason);

      runAction('CANCEL', formData);
      return;
    }

    runAction(dialogAction);
  }

  const isScheduled = status === 'SCHEDULED' || status === 'RESCHEDULED';
  const isInProgress = status === 'IN_PROGRESS';
  const isCancelled = status === 'CANCELLED';

  if (!isScheduled && !isInProgress && !isCancelled) {
    return null;
  }

  const dialogContent = {
    START: {
      title: 'Launch interview session?',
      description: 'Transitions status to Active and initiates session tracking.',
      confirm: 'Launch Session',
      confirmClassName: 'bg-primary text-primary-foreground hover:bg-primary/90'
    },
    COMPLETE: {
      title: 'Finalize interview?',
      description: 'Marks session complete and records outcome metrics.',
      confirm: 'Finalize Session',
      confirmClassName: 'bg-primary text-primary-foreground hover:bg-primary/90'
    },
    CANCEL: {
      title: 'Cancel scheduled interview?',
      description: 'Notifies the candidate of cancellation. Re-engagement remains available later.',
      confirm: 'Cancel Interview',
      confirmClassName: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    },
    RESTORE: {
      title: 'Reopen interview session?',
      description: 'Restores cancelled record to active queue.',
      confirm: 'Reopen Session',
      confirmClassName: 'bg-primary text-primary-foreground hover:bg-primary/90'
    }
  } as const;

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap gap-2">
          {isScheduled && (
            <>
              <button
                type="button"
                disabled={isPending}
                onClick={() => openDialog('START')}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                {isPending && dialogAction === 'START' ? 'Launching…' : 'Start'}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => openDialog('CANCEL')}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60">
                Cancel
              </button>
            </>
          )}

          {isInProgress && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => openDialog('COMPLETE')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
              {isPending && dialogAction === 'COMPLETE' ? 'Finalizing…' : 'Complete'}
            </button>
          )}

          {isCancelled && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => openDialog('RESTORE')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60">
              {isPending && dialogAction === 'RESTORE' ? 'Reopening…' : 'Reopen session'}
            </button>
          )}
        </div>

        {message && <p className="text-right text-xs font-medium text-primary">{message}</p>}

        {error && <p className="max-w-xs text-right text-xs font-medium text-destructive">{error}</p>}
      </div>

      <AlertDialog
        open={dialogAction !== null}
        onOpenChange={open => {
          if (!open && !isPending) {
            closeDialog();
          }
        }}>
        <AlertDialogContent>
          {dialogAction && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{dialogContent[dialogAction].title}</AlertDialogTitle>

                <AlertDialogDescription>{dialogContent[dialogAction].description}</AlertDialogDescription>
              </AlertDialogHeader>

              {dialogAction === 'CANCEL' && (
                <div className="space-y-2">
                  <label htmlFor={`cancellation-reason-${interviewId}`} className="text-sm font-medium">
                    Cancellation reason
                  </label>

                  <textarea
                    id={`cancellation-reason-${interviewId}`}
                    value={cancellationReason}
                    onChange={event => {
                      setCancellationReason(event.target.value);
                      setError(null);
                    }}
                    disabled={isPending}
                    placeholder="Provide details on why this session is being cancelled..."
                    rows={4}
                    className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {error && <p className="text-xs font-medium text-destructive">{error}</p>}
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Keep Session</AlertDialogCancel>

                <AlertDialogAction
                  disabled={isPending || (dialogAction === 'CANCEL' && !cancellationReason.trim())}
                  onClick={event => {
                    event.preventDefault();
                    handleDialogConfirm();
                  }}
                  className={dialogContent[dialogAction].confirmClassName}>
                  {isPending
                    ? dialogAction === 'START'
                      ? 'Launching…'
                      : dialogAction === 'COMPLETE'
                        ? 'Finalizing…'
                        : dialogAction === 'CANCEL'
                          ? 'Cancelling…'
                          : 'Reopening…'
                    : dialogContent[dialogAction].confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
