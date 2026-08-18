'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

import { updateCompanyApproval } from '@/server/actions/admin/companies/updateCompanyApproval';

export function CompanyApprovalActions({ companyId, status }: { companyId: string; status: string }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  function update(status: 'APPROVED' | 'REJECTED') {
    setError(null);

    startTransition(async () => {
      try {
        await updateCompanyApproval(companyId, status);

        router.push('/dashboard/admin/companies');
        router.refresh();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unable to update company approval.');
      }
    });
  }

  if (status !== 'PENDING') {
    return (
      <div className="mt-5 rounded-lg bg-muted p-4 text-sm">
        This company has already been <strong>{status.toLowerCase()}</strong>.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={() => update('APPROVED')}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
        Approve Company
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => update('REJECTED')}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-destructive/30 px-4 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
        Reject Company
      </button>
    </div>
  );
}
