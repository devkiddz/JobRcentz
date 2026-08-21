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

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

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

function getTaskStatusClasses(status: string) {
  switch (status) {
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

async function getJobSeekerInterview(interviewId: string) {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!dbUser) {
    throw new Error('User account not found.');
  }

  if (dbUser.role !== 'JOB_SEEKER') {
    throw new Error('Job seeker account required.');
  }

  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
      candidateId: user.id
    },

    select: {
      id: true,
      title: true,
      description: true,

      type: true,
      status: true,
      outcome: true,

      scheduledAt: true,
      startedAt: true,
      endedAt: true,
      durationMinutes: true,
      timezone: true,

      meetingProvider: true,
      meetingUrl: true,
      meetingId: true,

      location: true,

      notes: true,

      cancellationReason: true,
      cancelledAt: true,

      createdAt: true,
      updatedAt: true,

      job: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          workMode: true,
          employmentType: true,

          company: {
            select: {
              id: true,
              companyName: true,
              companyLogoUrl: true,
              companyLocation: true
            }
          }
        }
      },

      application: {
        select: {
          id: true,
          status: true,
          appliedAt: true,
          coverLetter: true,
          cvUrl: true,
          cvName: true
        }
      },

      participants: {
        select: {
          id: true,
          role: true,
          joinedAt: true,
          leftAt: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },

      tasks: {
        where: {
          assignedToId: user.id
        },

        orderBy: {
          createdAt: 'asc'
        },

        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueAt: true,
          startedAt: true,
          completedAt: true,
          createdAt: true
        }
      },

      notesEntries: {
        where: {
          visibility: 'SHARED'
        },

        orderBy: {
          createdAt: 'desc'
        },

        select: {
          id: true,
          body: true,
          createdAt: true,
          updatedAt: true,

          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      },

      sessions: {
        orderBy: {
          startedAt: 'desc'
        },

        select: {
          id: true,
          type: true,
          provider: true,
          startedAt: true,
          endedAt: true,
          status: true,
          recordingUrl: true,
          transcriptUrl: true
        }
      }
    }
  });

  if (!interview) {
    throw new Error('Interview not found.');
  }

  return interview;
}

export default async function JobSeekerInterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const interview = await getJobSeekerInterview(id);

  const completedTasks = interview.tasks.filter(task => task.status === 'COMPLETED').length;

  const taskProgress =
    interview.tasks.length > 0 ? Math.round((completedTasks / interview.tasks.length) * 100) : 0;

  const isOnline = interview.type === 'ONLINE';

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/interviews"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to interviews
      </Link>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
                {interview.job.company.companyLogoUrl ? (
                  <img
                    src={interview.job.company.companyLogoUrl}
                    alt={interview.job.company.companyName}
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

                <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                  {interview.title || `Interview for ${interview.job.title}`}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  {interview.job.company.companyName} · {interview.job.title}
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

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
          <InfoCard icon={CalendarDays} label="Date" value={formatDate(interview.scheduledAt)} />

          <InfoCard icon={Clock3} label="Time" value={formatTime(interview.scheduledAt)} />

          <InfoCard
            icon={() => getInterviewTypeIcon(interview.type)}
            label="Interview type"
            value={formatLabel(interview.type)}
          />

          <InfoCard
            icon={CheckCircle2}
            label="Duration"
            value={interview.durationMinutes ? `${interview.durationMinutes} minutes` : 'Not specified'}
          />
        </div>

        {(isOnline && interview.meetingUrl) || (!isOnline && interview.location) ? (
          <div className="border-t px-5 py-4 sm:px-6">
            {isOnline && interview.meetingUrl ? (
              <a
                href={interview.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                <Video className="size-4" />
                Join interview
              </a>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="size-4" />
                {interview.location}
              </div>
            )}
          </div>
        ) : null}
      </section>

      {interview.status === 'CANCELLED' && interview.cancellationReason && (
        <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
          <p className="text-xs font-semibold text-destructive">Interview cancelled</p>

          <p className="mt-2 text-sm text-muted-foreground">{interview.cancellationReason}</p>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="space-y-6">
          <section className="rounded-2xl border bg-card shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-base font-semibold">Interview details</h2>

              <p className="mt-1 text-xs text-muted-foreground">Information provided for your interview.</p>
            </div>

            <div className="space-y-5 p-5">
              {interview.description && (
                <div>
                  <p className="text-xs font-semibold">Description</p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {interview.description}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold">Company</p>

                <p className="mt-2 text-sm font-medium">{interview.job.company.companyName}</p>

                <p className="mt-1 text-xs text-muted-foreground">{interview.job.company.companyLocation}</p>
              </div>

              <div>
                <p className="text-xs font-semibold">Job</p>

                <p className="mt-2 text-sm font-medium">{interview.job.title}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {formatLabel(interview.job.workMode)} · {formatLabel(interview.job.employmentType)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-base font-semibold">Your interview tasks</h2>

                <p className="mt-1 text-xs text-muted-foreground">Tasks assigned specifically to you.</p>
              </div>

              <span className="text-xs font-semibold tabular-nums">
                {completedTasks}/{interview.tasks.length}
              </span>
            </div>

            {interview.tasks.length > 0 && (
              <div className="border-b p-5">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${taskProgress}%`
                    }}
                  />
                </div>

                <p className="mt-2 text-[11px] text-muted-foreground">{taskProgress}% complete</p>
              </div>
            )}

            {interview.tasks.length === 0 ? (
              <div className="p-8 text-center">
                <FileCheck2 className="mx-auto size-6 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">No tasks assigned</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You currently have no tasks assigned for this interview.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {interview.tasks.map(task => (
                  <div key={task.id} className="space-y-3 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
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
                    </div>

                    <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground">
                      {task.dueAt && (
                        <span>
                          Due:{' '}
                          <strong className="font-medium text-foreground">
                            {formatDate(task.dueAt)} · {formatTime(task.dueAt)}
                          </strong>
                        </span>
                      )}

                      {task.completedAt && (
                        <span>
                          Completed:{' '}
                          <strong className="font-medium text-foreground">
                            {formatDate(task.completedAt)}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {interview.notesEntries.length > 0 && (
            <section className="rounded-2xl border bg-card shadow-sm">
              <div className="border-b p-5">
                <h2 className="text-base font-semibold">Shared notes</h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Notes that the interview team has explicitly shared with you.
                </p>
              </div>

              <div className="divide-y">
                {interview.notesEntries.map(note => (
                  <div key={note.id} className="p-5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold">{note.author.name}</p>

                      <span className="text-[10px] text-muted-foreground">{formatDate(note.createdAt)}</span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {note.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Interview information</h2>

            <div className="mt-4 space-y-4">
              <InfoRow label="Type" value={formatLabel(interview.type)} />

              <InfoRow label="Status" value={formatLabel(interview.status)} />

              <InfoRow label="Timezone" value={interview.timezone || 'Africa/Lagos'} />

              {interview.meetingProvider && (
                <InfoRow label="Provider" value={formatLabel(interview.meetingProvider)} />
              )}

              {interview.outcome !== 'PENDING' && (
                <InfoRow label="Outcome" value={formatLabel(interview.outcome)} />
              )}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Interview team</h2>

            <div className="mt-4 space-y-3">
              {interview.participants.map(participant => (
                <div key={participant.id} className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                    {participant.user.image ? (
                      <img
                        src={participant.user.image}
                        alt={participant.user.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <UserRound className="size-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{participant.user.name}</p>

                    <p className="text-[10px] text-muted-foreground">{formatLabel(participant.role)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {interview.application && (
            <section className="rounded-2xl border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Application</h2>

              <div className="mt-4 space-y-4">
                <InfoRow label="Status" value={formatLabel(interview.application.status)} />

                <InfoRow label="Applied" value={formatDate(interview.application.appliedAt)} />

                {interview.application.cvUrl && (
                  <a
                    href={interview.application.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center rounded-lg border px-3 text-xs font-medium hover:bg-muted">
                    View submitted CV
                  </a>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-4">
      <Icon className="size-4 text-primary" />

      <p className="mt-3 text-[11px] text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>

      <p className="mt-1 text-xs font-semibold">{value}</p>
    </div>
  );
}
