'use client';

import { FormEvent, useState, useTransition } from 'react';
import { CalendarDays, Clock3, Loader2, MapPin, Video } from 'lucide-react';

import { scheduleApplicationInterview } from '@/server/actions/dashboard/employer/applications/scheduleApplicationInterview';

interface ScheduleInterviewFormProps {
  applicationId: string;
}

export default function ScheduleInterviewForm({ applicationId }: ScheduleInterviewFormProps) {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const scheduledAt = String(formData.get('scheduledAt') ?? '');

    const durationMinutes = Number(formData.get('durationMinutes') ?? 30);

    const meetingUrl = String(formData.get('meetingUrl') ?? '');

    const location = String(formData.get('location') ?? '');

    const notes = String(formData.get('notes') ?? '');

    /*
     * datetime-local gives us a local browser time.
     * Convert it to ISO so the server stores a real UTC timestamp.
     */
    const localDate = new Date(scheduledAt);

    if (Number.isNaN(localDate.getTime())) {
      setError('Please select a valid interview date and time.');
      return;
    }

    const isoScheduledAt = localDate.toISOString();

    startTransition(async () => {
      const result = await scheduleApplicationInterview(applicationId, {
        scheduledAt: isoScheduledAt,
        durationMinutes,
        meetingUrl,
        location,
        notes
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(true);
      form.reset();

      window.location.reload();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="scheduledAt" className="text-sm font-medium">
            Interview date & time
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              required
              disabled={isPending}
              className="h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="durationMinutes" className="text-sm font-medium">
            Duration
          </label>

          <div className="relative">
            <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <select
              id="durationMinutes"
              name="durationMinutes"
              defaultValue="30"
              disabled={isPending}
              className="h-10 w-full appearance-none rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1 hour 30 minutes</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
              <option value="240">4 hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="meetingUrl" className="text-sm font-medium">
          Meeting URL
          <span className="ml-1 text-xs font-normal text-muted-foreground">optional</span>
        </label>

        <div className="relative">
          <Video className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            id="meetingUrl"
            name="meetingUrl"
            type="url"
            placeholder="https://meet.google.com/..."
            disabled={isPending}
            className="h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Physical location
          <span className="ml-1 text-xs font-normal text-muted-foreground">optional</span>
        </label>

        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            id="location"
            name="location"
            type="text"
            placeholder="Office address or interview location"
            disabled={isPending}
            className="h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Interview notes
          <span className="ml-1 text-xs font-normal text-muted-foreground">optional</span>
        </label>

        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Add instructions, preparation details, or internal notes..."
          disabled={isPending}
          className="w-full resize-none rounded-md border bg-background px-3 py-2.5 text-sm leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-600 dark:text-emerald-400">
          Interview scheduled successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
        {isPending && <Loader2 className="size-4 animate-spin" />}

        {isPending ? 'Scheduling...' : 'Schedule Interview'}
      </button>
    </form>
  );
}
