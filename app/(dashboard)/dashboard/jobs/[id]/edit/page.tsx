import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, Save } from 'lucide-react';

import { getJobById } from '@/server/actions/jobs/getJobById';
import EditJobForm from '@/components/dashboard/jobs/EditJobForm';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await getJobById(id);

  if (!result || !result.isOwner) {
    notFound();
  }

  const { job } = result;
  const company = job.company;
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Jobs
      </Link>

      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-muted">
            <BriefcaseBusiness className="size-5 text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium text-primary">{company.companyName}</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight">Edit Job</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Update the details of <strong>{job.title}</strong>.
            </p>
          </div>
        </div>
      </section>

      <EditJobForm
        job={{
          id: job.id,
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          location: job.location,
          workMode: job.workMode,
          employmentType: job.employmentType,
          salaryMin: job.salaryMin?.toString() ?? '',
          salaryMax: job.salaryMax?.toString() ?? '',
          salaryCurrency: job.salaryCurrency ?? 'NGN',
          skills: job.skills,
          expiresAt: job.expiresAt ? job.expiresAt.toISOString().split('T')[0] : '',
          status: job.status
        }}
      />
    </main>
  );
}
