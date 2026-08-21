'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Loader2, MapPin, Video } from 'lucide-react';

import { createInterview } from '@/server/actions/dashboard/employer/interviews/createInterview';

type Props = {
  applicationId: string;
};

const initialState = {
  success: false,
  error: undefined as string | undefined,
  interviewId: undefined as string | undefined
};

export default function CreateInterviewForm({ applicationId }: Props) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(createInterview, initialState);

  const [type, setType] = useState('ONLINE');

  const [provider, setProvider] = useState('INTERNAL');

  useEffect(() => {
    if (state.success && state.interviewId) {
      router.push(`/dashboard/employer/interviews/${state.interviewId}`);
    }
  }, [state.success, state.interviewId, router]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="applicationId" value={applicationId} />

      <section className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold">Interview details</h2>

          <p className="mt-1 text-xs text-muted-foreground">Define the basic interview information.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="title" className="text-sm font-medium">
              Interview title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Frontend Developer Interview"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
            />

            <p className="text-[11px] text-muted-foreground">
              Leave blank to generate a title automatically.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Interview type
            </label>

            <select
              id="type"
              name="type"
              value={type}
              onChange={event => setType(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option value="ONLINE">Online</option>

              <option value="IN_PERSON">In person</option>

              <option value="AI">AI interview</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="durationMinutes" className="text-sm font-medium">
              Duration
            </label>

            <select
              id="durationMinutes"
              name="durationMinutes"
              defaultValue="60"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option value="15">15 minutes</option>

              <option value="30">30 minutes</option>

              <option value="45">45 minutes</option>

              <option value="60">60 minutes</option>

              <option value="90">90 minutes</option>

              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t pt-8">
        <div>
          <h2 className="text-sm font-semibold">Date and time</h2>

          <p className="mt-1 text-xs text-muted-foreground">Choose when the candidate should attend.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="scheduledAt" className="text-sm font-medium">
              Date and time
            </label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                required
                className="h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="timezone" className="text-sm font-medium">
              Timezone
            </label>

            <select
              id="timezone"
              name="timezone"
              defaultValue="Africa/Lagos"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option value="Africa/Lagos">Africa/Lagos — WAT</option>

              <option value="Africa/Accra">Africa/Accra — GMT</option>

              <option value="Europe/London">Europe/London</option>

              <option value="Europe/Berlin">Europe/Berlin</option>

              <option value="America/New_York">America/New_York</option>

              <option value="America/Los_Angeles">America/Los_Angeles</option>
            </select>
          </div>
        </div>
      </section>

      {type === 'ONLINE' && (
        <section className="space-y-5 border-t pt-8">
          <div>
            <h2 className="text-sm font-semibold">Online meeting</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Add the meeting information the candidate will use.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="meetingProvider" className="text-sm font-medium">
                Meeting provider
              </label>

              <select
                id="meetingProvider"
                name="meetingProvider"
                value={provider}
                onChange={event => setProvider(event.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                <option value="INTERNAL">Rcentz</option>

                <option value="ZOOM">Zoom</option>

                <option value="GOOGLE_MEET">Google Meet</option>

                <option value="MICROSOFT_TEAMS">Microsoft Teams</option>

                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="meetingUrl" className="text-sm font-medium">
                Meeting URL
              </label>

              <input
                id="meetingUrl"
                name="meetingUrl"
                type="url"
                required={type === 'ONLINE'}
                placeholder="https://..."
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="meetingId" className="text-sm font-medium">
                Meeting ID
              </label>

              <input
                id="meetingId"
                name="meetingId"
                type="text"
                placeholder="Optional"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="meetingPasscode" className="text-sm font-medium">
                Passcode
              </label>

              <input
                id="meetingPasscode"
                name="meetingPasscode"
                type="text"
                placeholder="Optional"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </section>
      )}

      {type === 'IN_PERSON' && (
        <section className="space-y-5 border-t pt-8">
          <div>
            <h2 className="text-sm font-semibold">Interview location</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Tell the candidate where the interview will take place.
            </p>
          </div>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />

            <input
              name="location"
              type="text"
              required={type === 'IN_PERSON'}
              placeholder="e.g. 12 Airport Road, Warri"
              className="h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </section>
      )}

      {type === 'AI' && (
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold">AI interview</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            AI interview infrastructure is part of the Rcentz platform architecture, but the actual AI
            interview experience will be connected in a later development phase.
          </p>
        </section>
      )}

      <section className="space-y-5 border-t pt-8">
        <div>
          <h2 className="text-sm font-semibold">Additional information</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Give the candidate context about the interview.
          </p>
        </div>

        <textarea
          name="description"
          rows={5}
          placeholder="Interview agenda, preparation instructions, topics to discuss..."
          className="w-full resize-none rounded-md border bg-background px-3 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-primary/20"
        />
      </section>

      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/employer/applications/${applicationId}`)}
          disabled={isPending}
          className="h-10 rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <Video className="size-4" />
              Schedule Interview
            </>
          )}
        </button>
      </div>
    </form>
  );
}
