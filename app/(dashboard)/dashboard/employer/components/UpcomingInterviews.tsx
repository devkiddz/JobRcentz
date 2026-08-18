import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock3, MapPin, Video } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

type Interview = EmployerDashboardData['upcomingInterviews'][number];

interface UpcomingInterviewsProps {
  interviews: Interview[];
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(new Date(date));
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));
}

export default function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-semibold">Upcoming Interviews</h2>

          <p className="mt-1 text-sm text-muted-foreground">Your next candidate meetings.</p>
        </div>

        <CalendarDays className="size-5 text-muted-foreground" />
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <CalendarDays className="size-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 font-semibold">No upcoming interviews</h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Scheduled candidate interviews will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {interviews.map(interview => (
            <article key={interview.id} className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="size-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="truncate text-sm font-semibold">
                      {interview.candidate.name ?? 'Candidate'}
                    </h3>

                    <span className="text-xs font-medium text-primary">
                      {formatTime(interview.scheduledAt)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-muted-foreground">{interview.job.title}</p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {formatDate(interview.scheduledAt)}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-3.5" />
                      {interview.durationMinutes} min
                    </span>

                    {interview.meetingUrl ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Video className="size-3.5" />
                        Online
                      </span>
                    ) : interview.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {interview.location}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {interviews.length > 0 && (
        <div className="border-t px-5 py-4 sm:px-6">
          <Link
            href="/dashboard/interviews"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            View interviews
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
