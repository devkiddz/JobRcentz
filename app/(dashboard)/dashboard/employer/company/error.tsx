'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Employer company page error:', error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">Unable to load company settings</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        We couldn't load your company information. Please try again.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Try again
      </button>
    </main>
  );
}
