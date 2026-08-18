import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, FileText, MapPin } from 'lucide-react';

import { getJobById } from '@/server/actions/jobs/getJobById';
import { ApplyToJobForm } from '@/components/jobs/ApplyToJobForm';

export default async function ApplyToJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await getJobById(id);

  if (!result) {
    notFound();
  }

  const { user, job, isOwner, existingApplication } = result;

  /*
   * Only job seekers can apply.
   */
  if (user.role !== 'JOB_SEEKER') {
    redirect(`/jobs/${job.id}`);
  }

  /*
   * Prevent owners from reaching the application form.
   */
  if (isOwner) {
    redirect(`/jobs/${job.id}`);
  }

  /*
   * Prevent duplicate applications.
   */
  if (existingApplication) {
    redirect(`/jobs/${job.id}`);
  }

  /*
   * This should already be enforced by getJobById(),
   * but keeping the page boundary explicit makes the
   * application flow easier to reason about.
   */
  if (job.status !== 'PUBLISHED') {
    redirect(`/jobs/${job.id}`);
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href={`/jobs/${job.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Job
      </Link>

      <section>
        <p className="text-sm font-medium text-primary">Job Application</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Apply for {job.title}</h1>

        <p className="mt-2 text-sm text-muted-foreground">Submit your application for this position.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Application form */}
        <ApplyToJobForm jobId={job.id} jobTitle={job.title} companyName={job.company.companyName} />

        {/* Job summary */}
        <aside className="h-fit rounded-xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {job.company.companyLogoUrl ? (
                <img
                  src={job.company.companyLogoUrl}
                  alt={job.company.companyName}
                  className="size-full object-cover"
                />
              ) : (
                <BriefcaseBusiness className="size-5 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-semibold">{job.title}</h2>

              <p className="mt-0.5 truncate text-sm text-muted-foreground">{job.company.companyName}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t pt-5">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <span>{job.location ?? 'Location not specified'}</span>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <span>{formatLabel(job.workMode)}</span>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <span>{formatLabel(job.employmentType)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">Application reminder</p>

            <p className="mt-1 text-sm leading-5">
              Make sure your profile and CV accurately represent your experience before submitting.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
