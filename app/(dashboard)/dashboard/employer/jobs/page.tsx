import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BriefcaseBusiness, CheckCircle2, Clock3, Plus, Users } from 'lucide-react';

import { JobListingCard } from '@/components/jobs/JobListingCard';
import { getEmployerJobs } from '@/server/actions/dashboard/employer/getEmployerJobs';

export default async function EmployerJobsPage() {
  const dashboard = await getEmployerJobs();

  /*
   * Server action already enforces authentication
   * and employer authorization.
   *
   * Keep this as a defensive page-level guard.
   */
  if (dashboard.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  const { company, jobs } = dashboard;

  const published = jobs.filter(
    job => job.status === 'PUBLISHED' && job.approvalStatus === 'APPROVED'
  ).length;

  const pending = jobs.filter(job => job.status === 'PUBLISHED' && job.approvalStatus === 'PENDING').length;

  const drafts = jobs.filter(job => job.status === 'DRAFT').length;

  const totalApplications = jobs.reduce((total, job) => total + job._count.applications, 0);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">{company.companyName}</p>

          <h1 className="text-3xl font-semibold tracking-tight">Jobs</h1>

          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage every opportunity your company has created on JobMan.
          </p>
        </div>

        <Link
          href="/dashboard/employer/jobs/create"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Plus className="size-4" />
          Post a Job
        </Link>
      </header>

      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Jobs" value={jobs.length} icon={BriefcaseBusiness} />

        <StatCard label="Published" value={published} icon={CheckCircle2} />

        <StatCard label="Pending Review" value={pending} icon={Clock3} />

        <StatCard label="Applications" value={totalApplications} icon={Users} />
      </section>

      {/* Listings */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Your listings</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {jobs.length === 0
                ? 'No job listings yet.'
                : `${jobs.length} ${jobs.length === 1 ? 'listing' : 'listings'} in your archive.`}
            </p>
          </div>

          {drafts > 0 && (
            <span className="text-xs text-muted-foreground">
              {drafts} draft
              {drafts === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {jobs.map(job => (
              <JobListingCard
                key={job.id}
                role="EMPLOYER"
                job={{
                  id: job.id,
                  title: job.title,
                  description: job.description,
                  location: job.location,
                  workMode: job.workMode,
                  employmentType: job.employmentType,

                  salaryMin: job.salaryMin?.toNumber() ?? null,
                  salaryMax: job.salaryMax?.toNumber() ?? null,
                  salaryCurrency: job.salaryCurrency,

                  skills: job.skills,

                  status: job.status,
                  approvalStatus: job.approvalStatus,

                  publishedAt: job.publishedAt,
                  expiresAt: job.expiresAt,
                  createdAt: job.createdAt,
                  updatedAt: job.updatedAt,

                  company: {
                    id: company.id,
                    companyName: company.companyName,
                    companyLogoUrl: company.companyLogoUrl
                  },

                  applicationCount: job._count.applications
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: number;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-4.5 text-primary" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
        <BriefcaseBusiness className="size-6 text-muted-foreground" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">No job listings yet</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Create your first opportunity and manage the entire hiring lifecycle from your employer workspace.
      </p>

      <Link
        href="/dashboard/employer/jobs/create"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
        <Plus className="size-4" />
        Post your first job
      </Link>
    </div>
  );
}
