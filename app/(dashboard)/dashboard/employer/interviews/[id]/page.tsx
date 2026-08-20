import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  MonitorPlay,
  UserRound,
  Video
} from 'lucide-react';

import { getEmployerInterview } from '@/server/actions/dashboard/employer/interviews/getEmployerInterview';
import { createInterviewTask } from '@/server/actions/dashboard/employer/interviews/manageInterviewTask';

import InterviewTaskActions from './InterviewTaskActions';
import InterviewTaskForm from './InterviewTaskForm';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
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

    case 'IN_PROGRESS':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';

    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';

    case 'CANCELLED':
    case 'NO_SHOW':
      return 'bg-destructive/10 text-destructive';

    case 'RESCHEDULED':
      return 'bg-violet-500/10 text-violet-600 dark:text-violet-400';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getTaskStatusClasses(status: string) {
  switch (status) {
    case 'TODO':
      return 'bg-muted text-muted-foreground';

    case 'IN_PROGRESS':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';

    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';

    case 'CANCELLED':
      return 'bg-destructive/10 text-destructive';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case 'URGENT':
      return 'bg-destructive/10 text-destructive';

    case 'HIGH':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';

    case 'MEDIUM':
      return 'bg-primary/10 text-primary';

    case 'LOW':
      return 'bg-muted text-muted-foreground';

    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getInterviewTypeIcon(type: string) {
  switch (type) {
    case 'ONLINE':
      return <Video className="size-4 text-primary" />;

    case 'AI':
      return <MonitorPlay className="size-4 text-primary" />;

    default:
      return <MapPin className="size-4 text-primary" />;
  }
}

export default async function EmployerInterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { interview } = await getEmployerInterview(id);

  const taskFormAction = async (
    _previousState: {
      success: boolean;
      error?: string;
    },
    formData: FormData
  ) => {
    'use server';

    return createInterviewTask(interview.id, formData);
  };

  const completedTasks = interview.tasks.filter(task => task.status === 'COMPLETED').length;

  const taskProgress =
    interview.tasks.length > 0 ? Math.round((completedTasks / interview.tasks.length) * 100) : 0;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/employer/interviews"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to interviews
      </Link>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
                {interview.candidate.jobSeeker?.profilePhotoUrl || interview.candidate.image ? (
                  <img
                    src={interview.candidate.jobSeeker?.profilePhotoUrl ?? interview.candidate.image ?? ''}
                    alt={interview.candidate.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound className="size-6 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Interview workspace
                </p>

                <h1 className="mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl">
                  {interview.title || `Interview with ${interview.candidate.name}`}
                </h1>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {interview.candidate.name} · {interview.job.title}
                </p>
              </div>
            </div>

            <span
              className={`w-fit shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                interview.status
              )}`}>
              {formatLabel(interview.status)}
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <div className="rounded-xl bg-muted/40 p-4">
            <CalendarDays className="size-4 text-primary" />

            <p className="mt-3 text-[11px] text-muted-foreground">Date</p>

            <p className="mt-1 text-sm font-semibold">{formatDate(interview.scheduledAt)}</p>
          </div>

          <div className="rounded-xl bg-muted/40 p-4">
            <Clock3 className="size-4 text-primary" />

            <p className="mt-3 text-[11px] text-muted-foreground">Time</p>

            <p className="mt-1 text-sm font-semibold">{formatTime(interview.scheduledAt)}</p>
          </div>

          <div className="rounded-xl bg-muted/40 p-4">
            {getInterviewTypeIcon(interview.type)}

            <p className="mt-3 text-[11px] text-muted-foreground">Interview type</p>

            <p className="mt-1 text-sm font-semibold">{formatLabel(interview.type)}</p>
          </div>

          <div className="rounded-xl bg-muted/40 p-4">
            <CheckCircle2 className="size-4 text-primary" />

            <p className="mt-3 text-[11px] text-muted-foreground">Duration</p>

            <p className="mt-1 text-sm font-semibold">
              {interview.durationMinutes ? `${interview.durationMinutes} minutes` : 'Not specified'}
            </p>
          </div>
        </div>

        {(interview.meetingUrl || interview.location) && (
          <div className="border-t px-5 py-4 sm:px-6">
            {interview.type === 'ONLINE' && interview.meetingUrl && (
              <a
                href={interview.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                <Video className="size-3.5" />
                Join online interview
              </a>
            )}

            {interview.type !== 'ONLINE' && interview.location && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="size-4" />
                {interview.location}
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-base font-semibold">Interview tasks</h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Assign and track work required before, during or after the interview.
                </p>
              </div>

              <span className="text-xs font-semibold tabular-nums">
                {completedTasks}/{interview.tasks.length}
              </span>
            </div>

            {interview.tasks.length > 0 && (
              <div className="border-b p-5">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${taskProgress}%`
                    }}
                  />
                </div>

                <p className="mt-2 text-[11px] text-muted-foreground">{taskProgress}% complete</p>
              </div>
            )}

            <div className="divide-y">
              {interview.tasks.length === 0 ? (
                <div className="p-8 text-center">
                  <FileCheck2 className="mx-auto size-6 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium">No interview tasks yet</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Create the first task using the form below.
                  </p>
                </div>
              ) : (
                interview.tasks.map(task => (
                  <div key={task.id} className="space-y-3 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold">{task.title}</h3>

                          <span
                            className={`rounded-md px-2 py-1 text-[10px] font-semibold ${getTaskStatusClasses(
                              task.status
                            )}`}>
                            {formatLabel(task.status)}
                          </span>

                          <span
                            className={`rounded-md px-2 py-1 text-[10px] font-semibold ${getPriorityClasses(
                              task.priority
                            )}`}>
                            {formatLabel(task.priority)}
                          </span>
                        </div>

                        {task.description && (
                          <p className="mt-2 text-xs leading-5 text-muted-foreground">{task.description}</p>
                        )}
                      </div>

                      <InterviewTaskActions taskId={task.id} status={task.status} />
                    </div>

                    <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground">
                      <span>
                        Assigned to:{' '}
                        <strong className="font-medium text-foreground">
                          {task.assignedTo?.name ?? 'Unassigned'}
                        </strong>
                      </span>

                      {task.dueAt && (
                        <span>
                          Due:{' '}
                          <strong className="font-medium text-foreground">
                            {formatDate(task.dueAt)} · {formatTime(task.dueAt)}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t p-5">
              <h3 className="text-sm font-semibold">Create interview task</h3>

              <p className="mb-4 mt-1 text-xs text-muted-foreground">
                Tasks can be assigned to the candidate or an interview participant.
              </p>

              <InterviewTaskForm
                action={taskFormAction}
                participants={interview.participants}
                employerId={interview.employerId}
                candidateId={interview.candidateId}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Candidate</h2>

            <div className="mt-4">
              <p className="text-sm font-semibold">{interview.candidate.name}</p>

              <p className="mt-1 text-xs text-muted-foreground">{interview.candidate.email}</p>

              {interview.candidate.jobSeeker?.headline && (
                <p className="mt-3 text-xs text-primary">{interview.candidate.jobSeeker.headline}</p>
              )}

              {interview.candidate.jobSeeker?.location && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {interview.candidate.jobSeeker.location}
                </p>
              )}

              {interview.candidate.jobSeeker?.currentRole && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Current role:{' '}
                  <span className="font-medium text-foreground">
                    {interview.candidate.jobSeeker.currentRole}
                  </span>
                </p>
              )}

              {interview.candidate.jobSeeker?.yearsOfExperience !== null &&
                interview.candidate.jobSeeker?.yearsOfExperience !== undefined && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Experience:{' '}
                    <span className="font-medium text-foreground">
                      {interview.candidate.jobSeeker.yearsOfExperience} years
                    </span>
                  </p>
                )}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Application</h2>

            {!interview.application ? (
              <p className="mt-4 text-xs text-muted-foreground">
                This interview is not linked to an application.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">Status</p>

                  <p className="mt-1 text-xs font-semibold">{formatLabel(interview.application.status)}</p>
                </div>

                <div>
                  <p className="text-[11px] text-muted-foreground">Applied</p>

                  <p className="mt-1 text-xs font-medium">{formatDate(interview.application.appliedAt)}</p>
                </div>

                {interview.application.coverLetter && (
                  <div>
                    <p className="text-[11px] text-muted-foreground">Cover letter</p>

                    <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                      {interview.application.coverLetter}
                    </p>
                  </div>
                )}

                {interview.application.cvUrl && (
                  <a
                    href={interview.application.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center rounded-lg border px-2.5 text-[11px] font-medium hover:bg-muted">
                    View CV
                  </a>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Interview notes</h2>

            <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">
              {interview.notesEntries.length > 0
                ? interview.notesEntries[0].body
                : 'No interview notes have been added yet.'}
            </p>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Participants</h2>

            <div className="mt-4 space-y-3">
              {interview.participants.length === 0 ? (
                <p className="text-xs text-muted-foreground">No additional participants.</p>
              ) : (
                interview.participants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {participant.user.image ? (
                        <img
                          src={participant.user.image}
                          alt={participant.user.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <UserRound className="size-3.5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{participant.user.name}</p>

                      <p className="truncate text-[10px] text-muted-foreground">
                        {formatLabel(participant.role)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Activity</h2>

            <div className="mt-4 space-y-4">
              {interview.events.length === 0 ? (
                <p className="text-xs text-muted-foreground">No activity recorded yet.</p>
              ) : (
                interview.events.map(event => (
                  <div key={event.id} className="flex gap-3">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />

                    <div className="min-w-0">
                      <p className="text-xs font-medium">{formatLabel(event.type)}</p>

                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDate(event.createdAt)} · {formatTime(event.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
