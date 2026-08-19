import Link from 'next/link';
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  RotateCcw,
  Users,
  XCircle
} from 'lucide-react';

import MetricCard from '@/components/dashboard/MetricCard';
import { JobListingCard } from '@/components/jobs/JobListingCard';
import type {
  EmployerJobFilter,
  EmployerJobsData
} from '@/server/actions/dashboard/employer/getEmployerJobs';

interface EmployerJobsViewProps {
  dashboard: EmployerJobsData;
  filter: EmployerJobFilter;
}

const navigation = [
  {
    key: 'ALL' as const,
    label: 'All Jobs',
    href: '/dashboard/employer/jobs',
    icon: BriefcaseBusiness
  },
  {
    key: 'PUBLISHED' as const,
    label: 'Published',
    href: '/dashboard/employer/jobs/published',
    icon: CheckCircle2
  },
  {
    key: 'PENDING' as const,
    label: 'Pending Review',
    href: '/dashboard/employer/jobs/pending',
    icon: Clock3
  },
  {
    key: 'DRAFT' as const,
    label: 'Drafts',
    href: '/dashboard/employer/jobs/drafts',
    icon: FileText
  },
  {
    key: 'REJECTED' as const,
    label: 'Rejected',
    href: '/dashboard/employer/jobs/rejected',
    icon: XCircle
  }
];

const pageCopy: Record<
  EmployerJobFilter,
  {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  ALL: {
    title: 'Jobs',
    description: 'Manage every opportunity your company has created on JobMan.',
    emptyTitle: 'No job listings yet',
    emptyDescription:
      'Create your first opportunity and manage the entire hiring lifecycle from your employer workspace.'
  },

  PUBLISHED: {
    title: 'Published Jobs',
    description: 'Jobs that have passed approval and are currently published.',
    emptyTitle: 'No published jobs',
    emptyDescription: 'Approved jobs will appear here once they are published.'
  },

  PENDING: {
    title: 'Pending Review',
    description: 'Jobs waiting for administrator approval before becoming public.',
    emptyTitle: 'Nothing pending review',
    emptyDescription: 'Jobs submitted for approval will appear here while they are being reviewed.'
  },

  DRAFT: {
    title: 'Drafts',
    description: 'Jobs you have started but have not submitted for approval.',
    emptyTitle: 'No drafts',
    emptyDescription: 'Saved job drafts will appear here until you are ready to submit them for review.'
  },

  REJECTED: {
    title: 'Rejected Jobs',
    description: 'Jobs that were reviewed and rejected by the administrator.',
    emptyTitle: 'No rejected jobs',
    emptyDescription: 'Jobs that require changes after review will appear here.'
  }
};

export default function EmployerJobsView({ dashboard, filter }: EmployerJobsViewProps) {
  const { company, jobs } = dashboard;

  const copy = pageCopy[filter];

  const published = jobs.filter(
    job => job.status === 'PUBLISHED' && job.approvalStatus === 'APPROVED'
  ).length;

  const pending = jobs.filter(job => job.status === 'PUBLISHED' && job.approvalStatus === 'PENDING').length;

  const drafts = jobs.filter(job => job.status === 'DRAFT').length;

  const rejected = jobs.filter(job => job.status === 'PUBLISHED' && job.approvalStatus === 'REJECTED').length;

  const totalApplications = jobs.reduce((total, job) => total + job._count.applications, 0);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 md:p-4 lg:p-6">
      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">{company.companyName}</p>

          <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>

          <p className="max-w-2xl text-sm text-muted-foreground">{copy.description}</p>
        </div>

        <Link
          href="/dashboard/employer/jobs/create"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Plus className="size-4" />
          Post a Job
        </Link>
      </header>

      {/* Job state navigation */}
      <nav className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-2 rounded-xl border bg-card p-1.5">
          {navigation.map(item => {
            const Icon = item.icon;
            const active = item.key === filter;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={[
                  'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                ].join(' ')}>
                <Icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Metrics */}
      {filter === 'ALL' && (
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <MetricCard
            label="Total Jobs"
            value={jobs.length}
            context={`${drafts} draft${drafts === 1 ? '' : 's'}`}
            icon="briefcase"
            contextIcon="briefcase"
            href="/dashboard/employer/jobs"
          />

          <MetricCard
            label="Published"
            value={published}
            context="Approved and visible"
            icon="check"
            contextIcon="check"
            href="/dashboard/employer/jobs/published"
          />

          <MetricCard
            label="Pending Review"
            value={pending}
            context={pending > 0 ? `${pending} awaiting approval` : 'Nothing awaiting approval'}
            icon="clock"
            contextIcon="clock"
            href="/dashboard/employer/jobs/pending"
          />

          <MetricCard
            label="Applications"
            value={totalApplications}
            context={totalApplications > 0 ? `${totalApplications} received` : 'No applications yet'}
            icon="users"
            contextIcon="users"
            href="/dashboard/employer/applications"
          />
        </section>
      )}

      {/* Filter summary */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {filter === 'ALL' ? 'Your listings' : copy.title}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {jobs.length === 0
              ? copy.emptyTitle
              : `${jobs.length} ${jobs.length === 1 ? 'listing' : 'listings'}`}
          </p>
        </div>

        {filter === 'REJECTED' && rejected > 0 && (
          <div className="inline-flex items-center gap-2 text-xs font-medium text-destructive">
            <XCircle className="size-3.5" />
            {rejected} rejected
          </div>
        )}

        {filter === 'DRAFT' && drafts > 0 && (
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FileText className="size-3.5" />
            {drafts} draft{drafts === 1 ? '' : 's'}
          </div>
        )}
      </section>

      {/* Listings */}
      {jobs.length === 0 ? (
        <EmptyState filter={filter} />
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
    </main>
  );
}

function EmptyState({ filter }: { filter: EmployerJobFilter }) {
  const copy = pageCopy[filter];

  const isDraft = filter === 'DRAFT';

  return (
    <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
        {isDraft ? (
          <FileText className="size-6 text-muted-foreground" />
        ) : filter === 'REJECTED' ? (
          <XCircle className="size-6 text-muted-foreground" />
        ) : filter === 'PUBLISHED' ? (
          <CheckCircle2 className="size-6 text-muted-foreground" />
        ) : filter === 'PENDING' ? (
          <Clock3 className="size-6 text-muted-foreground" />
        ) : (
          <BriefcaseBusiness className="size-6 text-muted-foreground" />
        )}
      </div>

      <h3 className="mt-5 text-lg font-semibold">{copy.emptyTitle}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{copy.emptyDescription}</p>

      {(filter === 'ALL' || filter === 'DRAFT') && (
        <Link
          href="/dashboard/employer/jobs/create"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
          <Plus className="size-4" />
          Post a Job
        </Link>
      )}

      {filter === 'REJECTED' && (
        <Link
          href="/dashboard/employer/jobs"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-muted">
          <RotateCcw className="size-4" />
          Back to all jobs
        </Link>
      )}
    </div>
  );
}
