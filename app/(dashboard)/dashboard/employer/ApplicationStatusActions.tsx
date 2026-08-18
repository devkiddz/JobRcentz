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

  function handleUpdate() {
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
      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        The candidate withdrew this application.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <select
            value={selectedStatus}
            disabled={isPending}
            onChange={event => setSelectedStatus(event.target.value)}
            className="h-11 w-full appearance-none rounded-md border bg-background px-3 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <button
          type="button"
          disabled={isPending || selectedStatus === currentStatus}
          onClick={handleUpdate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}

          {isPending ? 'Updating...' : 'Update Status'}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
