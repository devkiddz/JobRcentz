import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  MonitorPlay,
  UserRound,
  Users,
  Video,
  XCircle
} from 'lucide-react';
import { Children, type ReactNode } from 'react';

import { getEmployerInterviews } from '@/server/actions/dashboard/employer/interviews/getEmployerInterviews';
import InterviewActionControls from '../applications/[id]/interview/InterviewActionControls';
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getStatusClasses(status: string) {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';

    case 'RESCHEDULED':
      return 'bg-violet-500/10 text-violet-600 dark:text-violet-400';

    case 'IN_PROGRESS':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';

    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';

    case 'CANCELLED':
    case 'NO_SHOW':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getTaskSummary(tasks: Array<{ status: string }>) {
  if (tasks.length === 0) {
    return {
      label: 'No tasks',
      completed: 0,
      total: 0
    };
  }

  const completed = tasks.filter(task => task.status === 'COMPLETED').length;

  return {
    label: `${completed}/${tasks.length} completed`,
    completed,
    total: tasks.length
  };
}

type InterviewCardInterview = Awaited<ReturnType<typeof getEmployerInterviews>>['interviews'][number];

function InterviewTypeIcon({ type }: { type: InterviewCardInterview['type'] }) {
  switch (type) {
    case 'ONLINE':
      return <Video className="h-4 w-4 text-primary" />;

    case 'AI':
      return <MonitorPlay className="h-4 w-4 text-primary" />;

    default:
      return <MapPin className="h-4 w-4 text-primary" />;
  }
}

function isInPersonInterview(type: InterviewCardInterview['type']) {
  return type !== 'ONLINE' && type !== 'AI';
}

export default async function EmployerInterviewsPage() {
  const { interviews } = await getEmployerInterviews();

  const upcoming = interviews.filter(interview => ['SCHEDULED', 'RESCHEDULED'].includes(interview.status));

  const inProgress = interviews.filter(interview => interview.status === 'IN_PROGRESS');

  const completed = interviews.filter(
    interview => interview.status === 'COMPLETED' || interview.status === 'NO_SHOW'
  );

  const cancelled = interviews.filter(interview => interview.status === 'CANCELLED');

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Hiring workspace
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Interviews</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage scheduled interviews, candidate tasks and interview progress from one workspace.
            </p>
          </div>

          <div className="flex w-full items-center justify-between rounded-2xl border bg-card px-4 py-3 shadow-sm sm:w-auto sm:justify-start sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>

            <div>
              <p className="text-lg font-bold leading-none tabular-nums">{interviews.length}</p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Total interview
                {interviews.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard icon={CalendarDays} label="Upcoming" value={upcoming.length} />

        <OverviewCard icon={Clock3} label="In progress" value={inProgress.length} />

        <OverviewCard icon={CheckCircle2} label="Completed" value={completed.length} />

        <OverviewCard icon={XCircle} label="Cancelled" value={cancelled.length} />
      </section>

      {/* Upcoming */}
      <InterviewSection
        title="Upcoming interviews"
        description="Scheduled interviews waiting to happen."
        empty="No upcoming interviews.">
        {upcoming.map(interview => (
          <InterviewCard key={interview.id} interview={interview} showActions />
        ))}
      </InterviewSection>

      {/* In progress */}
      {inProgress.length > 0 && (
        <InterviewSection title="In progress" description="Interviews currently being conducted." empty="">
          {inProgress.map(interview => (
            <InterviewCard key={interview.id} interview={interview} showActions />
          ))}
        </InterviewSection>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <InterviewSection
          title="Completed"
          description="Completed interviews and recorded outcomes."
          empty="">
          {completed.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </InterviewSection>
      )}

      {/* Cancelled */}
      {cancelled.length > 0 && (
        <InterviewSection title="Cancelled" description="Interviews cancelled before completion." empty="">
          {cancelled.map(interview => (
            <InterviewCard key={interview.id} interview={interview} showActions />
          ))}
        </InterviewSection>
      )}
    </main>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value
}: {
  icon: typeof CalendarDays;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function InterviewSection({
  title,
  description,
  empty,
  children
}: {
  title: string;
  description: string;
  empty: string;
  children: ReactNode;
}) {
  const hasChildren = Children.count(children) > 0;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      </div>

      {hasChildren ? (
        <div className="grid gap-4 xl:grid-cols-2">{children}</div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-card px-5 py-10 text-center text-sm text-muted-foreground">
          {empty}
        </div>
      )}
    </section>
  );
}

function InterviewCard({
  interview,
  showActions = false
}: {
  interview: InterviewCardInterview;
  showActions?: boolean;
}) {
  const inPerson = isInPersonInterview(interview.type);
  const taskSummary = getTaskSummary(interview.tasks);

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Candidate */}
      <div className="border-b p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/40 sm:h-12 sm:w-12">
            {interview.candidate.jobSeeker?.profilePhotoUrl || interview.candidate.image ? (
              <img
                src={interview.candidate.jobSeeker?.profilePhotoUrl ?? interview.candidate.image ?? ''}
                alt={interview.candidate.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{interview.candidate.name}</p>

                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {interview.candidate.jobSeeker?.headline ?? interview.candidate.email}
                </p>
              </div>

              <span
                className={`w-fit shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                  interview.status
                )}`}>
                {formatLabel(interview.status)}
              </span>
            </div>

            <p className="mt-2 truncate text-xs font-medium text-primary">{interview.job.title}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 p-4 sm:p-5">
        {/* Schedule */}
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBlock icon={CalendarDays} label="Date" value={formatDate(interview.scheduledAt)} />

          <InfoBlock icon={Clock3} label="Time" value={formatTime(interview.scheduledAt)} />
        </div>

        {/* Interview type */}
        <div className="flex flex-col gap-3 rounded-xl border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <InterviewTypeIcon type={interview.type} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium">{formatLabel(interview.type)}</p>

              <p className="text-xs text-muted-foreground">
                {interview.durationMinutes
                  ? `${interview.durationMinutes} minutes`
                  : 'Duration not specified'}
              </p>
            </div>
          </div>

          {interview.type === 'ONLINE' && interview.meetingUrl && (
            <a
              href={interview.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto">
              Join interview
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Tasks */}
        <div className="rounded-xl bg-muted/30 p-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background">
              <FileCheck2 className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-medium">Interview tasks</p>

                <span className="text-xs font-semibold">{taskSummary.label}</span>
              </div>

              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                Candidate and interviewer responsibilities associated with this interview.
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        {inPerson && interview.location && (
          <div className="flex items-start gap-2 rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

            <span className="leading-5">{interview.location}</span>
          </div>
        )}

        {/* Notes */}
        {interview.notes && (
          <div className="rounded-xl border bg-background p-3">
            <p className="text-xs font-medium">Notes</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">{interview.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="space-y-3 border-t pt-4">
          <Link
            href={`/dashboard/employer/interviews/${interview.id}`}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted sm:w-auto">
            View interview
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {showActions && <InterviewActionControls interviewId={interview.id} status={interview.status} />}
        </div>
      </div>
    </article>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
