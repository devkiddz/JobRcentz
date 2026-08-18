import Link from 'next/link';

import { getAdminJobs } from '@/server/actions/admin/jobs/getJobs';

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getApprovalClass(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';

    case 'REJECTED':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
  }
}

export default async function AdminJobsPage() {
  const jobs = await getAdminJobs();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8">
      <div>
        <p className="text-sm font-medium text-primary">Administration</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Jobs</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review and manage job listings submitted by employers.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border bg-card">
        {jobs.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No jobs have been created yet.</div>
        ) : (
          <div className="divide-y">
            {jobs.map(job => (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="block p-5 transition-colors hover:bg-muted/50 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="font-semibold">{job.title}</h2>

                    <p className="mt-1 text-sm text-muted-foreground">{job.company.companyName}</p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{job.company.companyLocation}</span>

                      <span>
                        {job._count.applications}{' '}
                        {job._count.applications === 1 ? 'application' : 'applications'}
                      </span>

                      <span>{formatLabel(job.status)}</span>
                    </div>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${getApprovalClass(
                      job.approvalStatus
                    )}`}>
                    {formatLabel(job.approvalStatus)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
