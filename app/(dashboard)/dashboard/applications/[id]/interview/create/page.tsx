import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock3, MapPin, Video } from 'lucide-react';

import { getEmployerApplicationById } from '@/server/actions/dashboard/employer/applications/getEmployerApplicationById';

import CreateInterviewForm from './CreateInterviewForm';

export default async function CreateInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let application;

  try {
    application = await getEmployerApplicationById(id);
  } catch {
    notFound();
  }

  const candidateName = application.applicant.name?.trim() || 'Candidate';

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href={`/dashboard/employer/applications/${application.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Application
      </Link>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-6 sm:p-8">
          <p className="text-sm font-semibold text-primary">Interview scheduling</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Schedule an interview</h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create an interview with {candidateName} for{' '}
            <span className="font-medium text-foreground">{application.job.title}</span>.
          </p>
        </div>

        <div className="grid border-b sm:grid-cols-3">
          <div className="flex items-center gap-2 px-6 py-4 text-xs text-muted-foreground sm:px-8">
            <CalendarDays className="size-4 text-primary" />
            {candidateName}
          </div>

          <div className="flex items-center gap-2 border-t px-6 py-4 text-xs text-muted-foreground sm:border-l sm:border-t-0 sm:px-8">
            <Video className="size-4 text-primary" />
            {application.job.title}
          </div>

          <div className="flex items-center gap-2 border-t px-6 py-4 text-xs text-muted-foreground sm:border-l sm:border-t-0 sm:px-8">
            <Clock3 className="size-4 text-primary" />
            New interview
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <CreateInterviewForm applicationId={application.id} />
        </div>
      </section>
    </main>
  );
}
