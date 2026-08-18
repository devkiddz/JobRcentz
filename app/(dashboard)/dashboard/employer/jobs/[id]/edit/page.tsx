import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, XCircle } from 'lucide-react';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import EditJobForm from '@/components/dashboard/jobs/EditJobForm';

function getStatus(status: string, approvalStatus: string) {
  if (status === 'DRAFT') {
    return {
      label: 'Draft',
      icon: Clock3,
      className: 'bg-muted text-muted-foreground'
    };
  }

  if (status === 'CLOSED') {
    return {
      label: 'Closed',
      icon: XCircle,
      className: 'bg-muted text-muted-foreground'
    };
  }

  if (approvalStatus === 'APPROVED') {
    return {
      label: 'Published',
      icon: CheckCircle2,
      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    };
  }

  if (approvalStatus === 'REJECTED') {
    return {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive'
    };
  }

  return {
    label: 'Pending Review',
    icon: Clock3,
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  };
}

export default async function EmployerEditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const sessionUser = await requireAuth();

  // Better Auth's session user does not contain the application role.
  // Resolve the application user from Prisma.
  const dbUser = await prisma.user.findUnique({
    where: {
      id: sessionUser.id
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!dbUser || dbUser.role !== 'EMPLOYER') {
    notFound();
  }

  const job = await prisma.job.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      title: true,
      description: true,
      requirements: true,
      location: true,
      workMode: true,
      employmentType: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      skills: true,
      status: true,
      approvalStatus: true,
      expiresAt: true,

      company: {
        select: {
          id: true,
          companyName: true,
          companyLogoUrl: true,
          userId: true
        }
      }
    }
  });

  // The employer must own the company that owns this job.
  if (!job || job.company.userId !== dbUser.id) {
    notFound();
  }

  const status = getStatus(job.status, job.approvalStatus);
  const StatusIcon = status.icon;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href={`/dashboard/employer/jobs/${job.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Job
      </Link>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted/50">
                {job.company.companyLogoUrl ? (
                  <img
                    src={job.company.companyLogoUrl}
                    alt={`${job.company.companyName} logo`}
                    className="size-full object-cover"
                  />
                ) : (
                  <BriefcaseBusiness className="size-6 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-primary">{job.company.companyName}</p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Edit Job</h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Update the details of <span className="font-medium text-foreground">{job.title}</span>.
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.className}`}>
              <StatusIcon className="size-3.5" />
              {status.label}
            </span>
          </div>
        </div>

        <div className="grid border-t sm:grid-cols-2">
          <div className="flex items-center gap-2 px-6 py-4 text-xs text-muted-foreground sm:px-8">
            <BriefcaseBusiness className="size-3.5" />
            {job.employmentType.replace(/_/g, ' ')}
          </div>

          <div className="flex items-center gap-2 border-t px-6 py-4 text-xs text-muted-foreground sm:border-l sm:border-t-0 sm:px-8">
            <CalendarDays className="size-3.5" />
            Expires{' '}
            {job.expiresAt
              ? new Intl.DateTimeFormat('en-NG', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }).format(job.expiresAt)
              : 'Not specified'}
          </div>
        </div>
      </section>

      <EditJobForm
        job={{
          id: job.id,
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          location: job.location ?? '',
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
