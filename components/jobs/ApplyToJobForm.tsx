'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';

import { applyToJob } from '@/server/actions/jobs/applyToJob';

interface ApplyToJobFormProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export function ApplyToJobForm({ jobId, jobTitle, companyName }: ApplyToJobFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);

    startTransition(async () => {
      try {
        await applyToJob(jobId, formData);

        router.push('/dashboard/applications');
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Something went wrong while submitting your application.'
        );
      }
    });
  }

  return (
    <form action={handleSubmit} className="rounded-xl border bg-card p-6 sm:p-8">
      <div className="border-b pb-5">
        <h2 className="text-lg font-semibold">Application</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Applying for <strong>{jobTitle}</strong> at <strong>{companyName}</strong>.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <label htmlFor="coverLetter" className="text-sm font-medium">
            Cover Letter
          </label>

          <p className="mt-1 text-xs text-muted-foreground">
            Introduce yourself and explain why you are a good fit for this position.
          </p>

          <textarea
            id="coverLetter"
            name="coverLetter"
            rows={12}
            maxLength={5000}
            placeholder="Tell the employer about your experience, relevant skills, and why you're interested in this role..."
            className="mt-3 w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">Your profile CV will be submitted</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            JobMan uses the CV currently attached to your professional profile. Make sure it is up to date
            before applying.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Submit Application
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          By submitting this application, you confirm that the information provided is accurate.
        </p>
      </div>
    </form>
  );
}
