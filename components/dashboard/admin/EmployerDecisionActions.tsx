'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { approveEmployer } from '@/server/actions/admin/approveEmployer';
import { rejectEmployer } from '@/server/actions/admin/rejectEmployer';

import { Button } from '@/components/ui/button';

export default function EmployerDecisionActions({
  companyId,
  status
}: {
  companyId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState<'approve' | 'reject' | null>(null);

  const [error, setError] = React.useState('');

  async function handleApprove() {
    setError('');
    setIsLoading('approve');

    try {
      await approveEmployer(companyId);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to approve employer.');
    } finally {
      setIsLoading(null);
    }
  }

  async function handleReject() {
    setError('');
    setIsLoading('reject');

    try {
      await rejectEmployer(companyId);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to reject employer.');
    } finally {
      setIsLoading(null);
    }
  }

  if (status !== 'PENDING') {
    return (
      <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
        This employer has already been <span className="font-medium">{status.toLowerCase()}</span>.
      </div>
    );
  }

  const isBusy = isLoading !== null;

  return (
    <div className="space-y-3">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" disabled={isBusy} onClick={handleApprove} className="bg-primary">
          {isLoading === 'approve' ? 'Approving...' : 'Approve Employer'}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={handleReject}
          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
          {isLoading === 'reject' ? 'Rejecting...' : 'Reject Employer'}
        </Button>
      </div>
    </div>
  );
}
