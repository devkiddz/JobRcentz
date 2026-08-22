import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ClipboardPenLine } from 'lucide-react';

import { getEmployerInterview } from '@/server/actions/dashboard/employer/interviews/getEmployerInterview';
import { updateInterviewTask } from '@/server/actions/dashboard/employer/interviews/manageInterviewTask';
import InterviewTaskForm from '../../../InterviewTaskForm';

export default async function EditInterviewTaskPage({ params }: { params: Promise<{ id: string; taskId: string }> }) {
  const { id, taskId } = await params;
  let interview;

  try {
    ({ interview } = await getEmployerInterview(id));
  } catch {
    notFound();
  }

  const task = interview.tasks.find(item => item.id === taskId);
  if (!task) notFound();
  if (task.status === 'COMPLETED' || task.status === 'CANCELLED') {
    redirect(`/dashboard/employer/interviews/${id}`);
  }

  const action = async (_previousState: { success: boolean; error?: string }, formData: FormData) => {
    'use server';
    return updateInterviewTask(taskId, formData);
  };

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link href={`/dashboard/employer/interviews/${id}`} className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />Back to interview
      </Link>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><ClipboardPenLine className="size-4" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Interview task</p>
              <h1 className="mt-1 text-xl font-bold tracking-tight">Edit task</h1>
              <p className="mt-1 text-xs text-muted-foreground">Update task details without changing its workflow status.</p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <InterviewTaskForm
            mode="edit"
            action={action}
            task={task}
            participants={interview.participants}
            employerId={interview.employerId}
            candidateId={interview.candidateId}
          />
        </div>
      </section>
    </main>
  );
}
