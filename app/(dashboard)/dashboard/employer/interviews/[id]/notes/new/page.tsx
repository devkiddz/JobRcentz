import Link from 'next/link';

import { createInterviewNote } from '@/server/actions/dashboard/employer/interviews/manageInterviewNote';

type NewInterviewNotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewInterviewNotePage({ params }: NewInterviewNotePageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Interview workspace</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Add interview note</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Record an observation, decision, reminder, or other useful information about this interview.
          </p>
        </div>

        <Link
          href={`/dashboard/employer/interviews/${id}`}
          className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Back to interview
        </Link>
      </div>

      <form
        action={async formData => {
          'use server';

          await createInterviewNote(id, formData);
        }}
        className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <label htmlFor="body" className="text-sm font-medium">
            Note
          </label>

          <textarea
            id="body"
            name="body"
            rows={8}
            required
            placeholder="Write your interview note..."
            className="w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <p className="text-xs text-muted-foreground">Keep the note clear and relevant to the interview.</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Link
            href={`/dashboard/employer/interviews/${id}`}
            className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium hover:bg-muted">
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Add note
          </button>
        </div>
      </form>
    </main>
  );
}
