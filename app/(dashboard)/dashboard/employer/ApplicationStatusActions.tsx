'use client';

import { useState, useTransition } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';

import { updateApplicationStatus } from '@/server/actions/dashboard/employer/applications/updateApplicationStatus';

const statuses = [
  {
    value: 'PENDING',
    label: 'Pending'
  },
  {
    value: 'REVIEWING',
    label: 'Reviewing'
  },
  {
    value: 'SHORTLISTED',
    label: 'Shortlisted'
  },
  {
    value: 'INTERVIEW',
    label: 'Interview'
  },
  {
    value: 'HIRED',
    label: 'Hired'
  },
  {
    value: 'REJECTED',
    label: 'Rejected'
  }
] as const;

type ApplicationStatus = (typeof statuses)[number]['value'];

function getStatusLabel(value: string) {
  return statuses.find(status => status.value === value)?.label ?? value;
}

export default function ApplicationStatusActions({
  applicationId,
  currentStatus
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const hasChanged = selectedStatus !== currentStatus;

  function handleStatusChange(value: string) {
    setError(null);
    setSelectedStatus(value);
  }

  function handleUpdate() {
    if (!hasChanged || isPending) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, selectedStatus);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    });
  }

  if (currentStatus === 'WITHDRAWN') {
    return (
      <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
        <p className="text-sm font-medium">Application withdrawn</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          The candidate withdrew this application. Its status can no longer be changed from the employer
          workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Status selector */}
        <div className="relative flex-1">
          <select
            value={selectedStatus}
            disabled={isPending}
            onChange={event => handleStatusChange(event.target.value)}
            aria-label="Application status"
            className="h-11 w-full appearance-none rounded-md border bg-background px-3 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50">
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Update button */}
        <button
          type="button"
          disabled={!hasChanged || isPending}
          onClick={handleUpdate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}

          {isPending ? 'Updating...' : 'Update Status'}
        </button>
      </div>

      {/* Pending change indicator */}
      {hasChanged && !isPending && (
        <p className="text-xs text-muted-foreground">
          Status will change from{' '}
          <span className="font-medium text-foreground">{getStatusLabel(currentStatus)}</span> to{' '}
          <span className="font-medium text-foreground">{getStatusLabel(selectedStatus)}</span>.
        </p>
      )}

      {/* Server error */}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
