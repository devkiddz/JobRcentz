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
  Video,
  XCircle
} from 'lucide-react';

import { getJobSeekerInterviews } from '@/server/actions/dashboard/jobseeker/interviews/getJobSeekerInterviews';

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

function getTypeIcon(type: string) {
  switch (type) {
    case 'ONLINE':
      return <Video className="size-4 text-primary" />;

    case 'AI':
      return <MonitorPlay className="size-4 text-primary" />;

    default:
      return <MapPin className="size-4 text-primary" />;
  }
}

function getTaskSummary(tasks: Array<{ status: string }>) {
  if (tasks.length === 0) {
    return 'No assigned tasks';
  }

  const completed = tasks.filter(task => task.status === 'COMPLETED').length;

  return `${completed}/${tasks.length} completed`;
}

export default async function JobSeekerInterviewsPage() {
  const { interviews } = await getJobSeekerInterviews();

  const now = new Date();

  const upcoming = interviews.filter(interview => {
    const scheduledAt = new Date(interview.scheduledAt);

    return scheduledAt >= now && ['SCHEDULED', 'RESCHEDULED'].includes(interview.status);
  });

  const inProgress = interviews.filter(interview => interview.status === 'IN_PROGRESS');

  const completed = interviews.filter(
    interview => interview.status === 'COMPLETED' || interview.status === 'NO_SHOW'
  );

  const cancelled = interviews.filter(interview => interview.status === 'CANCELLED');

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Career workspace</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Interviews</h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Keep track of your upcoming interviews, interview tasks and hiring progress.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm shadow-sm">
          <CalendarDays className="size-4 text-primary" />

          <span className="font-medium">{interviews.length}</span>

          <span className="text-muted-foreground">interview{interviews.length === 1 ? '' : 's'}</span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard icon={CalendarDays} label="Upcoming" value={upcoming.length} />

        <OverviewCard icon={Clock3} label="In progress" value={inProgress.length} />

        <OverviewCard icon={CheckCircle2} label="Completed" value={completed.length} />

        <OverviewCard icon={XCircle} label="Cancelled" value={cancelled.length} />
      </section>

      {upcoming.length > 0 ? (
        <InterviewSection title="Upcoming interviews" description="Your next scheduled interviews.">
          {upcoming.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </InterviewSection>
      ) : (
        <EmptyState
          title="No upcoming interviews"
          description="When an employer schedules an interview with you, it will appear here."
        />
      )}

      {inProgress.length > 0 && (
        <InterviewSection title="In progress" description="Interviews currently taking place.">
          {inProgress.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </InterviewSection>
      )}

      {completed.length > 0 && (
        <InterviewSection title="Completed" description="Your completed interview history.">
          {completed.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </InterviewSection>
      )}

      {cancelled.length > 0 && (
        <InterviewSection title="Cancelled" description="Interviews that were cancelled.">
          {cancelled.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
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
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="size-4.5 text-primary" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function InterviewSection({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">{children}</div>
    </section>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-2xl border border-dashed bg-card p-10 text-center">
      <CalendarDays className="mx-auto size-7 text-muted-foreground" />

      <h2 className="mt-4 text-sm font-semibold">{title}</h2>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-muted-foreground">{description}</p>
    </section>
  );
}

function InterviewCard({
  interview
}: {
  interview: Awaited<ReturnType<typeof getJobSeekerInterviews>>['interviews'][number];
}) {
  const company = interview.job.company;

  const isOnline = interview.type === 'ONLINE';

  const isInPerson = interview.type === 'IN_PERSON';

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
              {company.companyLogoUrl ? (
                <img
                  src={company.companyLogoUrl}
                  alt={company.companyName}
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-5 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold">
                {interview.title || `Interview for ${interview.job.title}`}
              </h3>

              <p className="mt-1 truncate text-xs text-muted-foreground">{company.companyName}</p>

              <p className="mt-2 truncate text-xs font-medium text-primary">{interview.job.title}</p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
              interview.status
            )}`}>
            {formatLabel(interview.status)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Date
            </div>

            <p className="mt-1 text-sm font-semibold">{formatDate(interview.scheduledAt)}</p>
          </div>

          <div className="rounded-xl bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 className="size-3.5" />
              Time
            </div>

            <p className="mt-1 text-sm font-semibold">{formatTime(interview.scheduledAt)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-background p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              {getTypeIcon(interview.type)}
            </div>

            <div>
              <p className="text-sm font-medium">{formatLabel(interview.type)}</p>

              <p className="text-xs text-muted-foreground">
                {interview.durationMinutes
                  ? `${interview.durationMinutes} minutes`
                  : 'Duration not specified'}
              </p>
            </div>
          </div>

          {isOnline && interview.meetingUrl && (
            <a
              href={interview.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              Join
              <ArrowRight className="size-3.5" />
            </a>
          )}
        </div>

        {isInPerson && interview.location && (
          <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">
            <MapPin className="size-4 shrink-0" />

            <span>{interview.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="size-4 text-muted-foreground" />

            <div>
              <p className="text-xs font-medium">Your interview tasks</p>

              <p className="text-[11px] text-muted-foreground">Tasks assigned to you</p>
            </div>
          </div>

          <span className="text-xs font-semibold">{getTaskSummary(interview.tasks)}</span>
        </div>

        {interview.outcome !== 'PENDING' && (
          <div className="rounded-xl border bg-background p-3">
            <p className="text-[11px] text-muted-foreground">Interview outcome</p>

            <p className="mt-1 text-sm font-semibold">{formatLabel(interview.outcome)}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <p className="text-[11px] text-muted-foreground">{interview.timezone || 'Africa/Lagos'}</p>

          <Link
            href={`/dashboard/interviews/${interview.id}`}
            className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-xs font-medium hover:bg-muted">
            View interview
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
