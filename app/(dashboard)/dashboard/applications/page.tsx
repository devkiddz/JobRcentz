import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';

import { getJobSeekerApplications } from '@/server/actions/dashboard/jobseeker/getJobSeekerApplications';
import ApplicationCard from '@/components/dashboard/ApplicationCard';

export default async function JobSeekerApplicationsPage() {
  const applications = await getJobSeekerApplications();

  const total = applications.length;

  const active = applications.filter(application =>
    ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW'].includes(application.status)
  ).length;

  const interviews = applications.filter(application => application.status === 'INTERVIEW').length;

  const hired = applications.filter(application => application.status === 'HIRED').length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <section>
        <p className="text-sm font-medium text-primary">Job Seeker Dashboard</p>

        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Applications</h1>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Track the jobs you have applied for and monitor their progress.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Find More Jobs
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* =========================================================
          SUMMARY
      ========================================================= */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Applications" value={total} icon={BriefcaseBusiness} />

        <SummaryCard label="Active" value={active} icon={Clock3} />

        <SummaryCard label="Interviews" value={interviews} icon={CalendarDays} />

        <SummaryCard label="Hired" value={hired} icon={CheckCircle2} />
      </section>

      {/* =========================================================
          APPLICATION HISTORY
      ========================================================= */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Application History</h2>

          <p className="mt-1 text-sm text-muted-foreground">Your most recent applications appear first.</p>
        </div>

        {applications.length === 0 ? (
          <EmptyApplicationsState />
        ) : (
          <div className="divide-y">
            {applications.map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ========================================================================= */
/* SUMMARY CARD                                                             */
/* ========================================================================= */

function SummaryCard({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: number;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* EMPTY STATE                                                              */
/* ========================================================================= */

function EmptyApplicationsState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <BriefcaseBusiness className="size-6 text-muted-foreground" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">No applications yet</h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You haven't applied for any jobs yet. Explore available opportunities and submit your first
        application.
      </p>

      <Link
        href="/jobs"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        Explore Jobs
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
