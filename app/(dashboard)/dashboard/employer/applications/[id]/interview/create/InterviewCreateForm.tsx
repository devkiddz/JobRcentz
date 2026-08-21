'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Loader2, MapPin, Video } from 'lucide-react';

import {
  createInterview,
  type CreateInterviewInput
} from '@/server/actions/dashboard/employer/interviews/createInterview';

type Props = {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
};

type InterviewType = CreateInterviewInput['type'];

type MeetingProvider = NonNullable<CreateInterviewInput['meetingProvider']>;

export default function InterviewCreateForm({ applicationId, candidateName, jobTitle }: Props) {
  const router = useRouter();

  const [type, setType] = useState<InterviewType>('ONLINE');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');

  const [meetingProvider, setMeetingProvider] = useState<MeetingProvider>('INTERNAL');

  const [meetingUrl, setMeetingUrl] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [meetingPasscode, setMeetingPasscode] = useState('');

  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleTypeChange(nextType: InterviewType) {
    setType(nextType);
    setError('');

    if (nextType !== 'ONLINE') {
      setMeetingProvider('INTERNAL');
      setMeetingUrl('');
      setMeetingId('');
      setMeetingPasscode('');
    }

    if (nextType !== 'IN_PERSON') {
      setLocation('');
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!scheduledAt) {
      setError('Please select an interview date and time.');
      return;
    }

    if (type === 'IN_PERSON' && !location.trim()) {
      setError('Please provide the interview location.');
      return;
    }

    if (type === 'ONLINE' && meetingProvider !== 'INTERNAL' && !meetingUrl.trim()) {
      setError('Please provide the meeting URL.');
      return;
    }

    const scheduledDate = new Date(scheduledAt);

    if (Number.isNaN(scheduledDate.getTime())) {
      setError('The selected interview date and time is invalid.');
      return;
    }

    if (scheduledDate.getTime() <= Date.now()) {
      setError('The interview must be scheduled for a future date and time.');
      return;
    }

    const duration = Number(durationMinutes);

    if (!Number.isInteger(duration) || duration <= 0 || duration > 480) {
      setError('Interview duration must be between 1 and 480 minutes.');
      return;
    }

    setIsSubmitting(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Lagos';

      const result = await createInterview({
        applicationId,
        type,

        title: title.trim() || undefined,

        description: description.trim() || undefined,

        scheduledAt: scheduledDate.toISOString(),

        durationMinutes: duration,

        timezone,

        meetingProvider: type === 'ONLINE' ? meetingProvider : undefined,

        meetingUrl: type === 'ONLINE' ? meetingUrl.trim() || undefined : undefined,

        meetingId: type === 'ONLINE' ? meetingId.trim() || undefined : undefined,

        meetingPasscode: type === 'ONLINE' ? meetingPasscode.trim() || undefined : undefined,

        location: type === 'IN_PERSON' ? location.trim() || undefined : undefined,

        notes: notes.trim() || undefined
      });

      if (!result.success) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      router.push(`/dashboard/employer/interviews/${result.interviewId}`);

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while scheduling the interview.');

      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Video className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">Interview details</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Configure how and when the interview will take place.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium">Interview type</label>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <TypeOption
                value="ONLINE"
                current={type}
                icon={<Video className="size-4" />}
                title="Online"
                description="Video or virtual meeting"
                onChange={handleTypeChange}
              />

              <TypeOption
                value="IN_PERSON"
                current={type}
                icon={<MapPin className="size-4" />}
                title="In person"
                description="Physical interview"
                onChange={handleTypeChange}
              />

              <TypeOption
                value="AI"
                current={type}
                icon={<Video className="size-4" />}
                title="AI interview"
                description="AI-assisted interview"
                onChange={handleTypeChange}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Interview title"
              value={title}
              onChange={setTitle}
              placeholder={`Interview with ${candidateName}`}
            />

            <Field
              label="Duration"
              type="number"
              value={durationMinutes}
              onChange={setDurationMinutes}
              placeholder="60"
              min="1"
              max="480"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date and time</label>

            <div className="relative mt-2">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={event => setScheduledAt(event.target.value)}
                className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Your browser timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone || 'local time'}) will
              be used for scheduling.
            </p>
          </div>

          <TextareaField
            label="Description"
            value={description}
            onChange={setDescription}
            placeholder="What should the candidate expect from this interview?"
          />
        </div>
      </section>

      {type === 'ONLINE' && (
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-semibold">Online meeting</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add the details the candidate will use to join.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium">Meeting provider</label>

              <select
                value={meetingProvider}
                onChange={event => setMeetingProvider(event.target.value as MeetingProvider)}
                className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="INTERNAL">JobRcentz</option>

                <option value="ZOOM">Zoom</option>

                <option value="GOOGLE_MEET">Google Meet</option>

                <option value="MICROSOFT_TEAMS">Microsoft Teams</option>

                <option value="OTHER">Other</option>
              </select>
            </div>

            {meetingProvider !== 'INTERNAL' && (
              <Field
                label="Meeting URL"
                value={meetingUrl}
                onChange={setMeetingUrl}
                placeholder="https://..."
                type="url"
                required
              />
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Meeting ID" value={meetingId} onChange={setMeetingId} placeholder="Optional" />

              <Field
                label="Passcode"
                value={meetingPasscode}
                onChange={setMeetingPasscode}
                placeholder="Optional"
              />
            </div>
          </div>
        </section>
      )}

      {type === 'IN_PERSON' && (
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-semibold">Interview location</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Tell the candidate where the interview will take place.
          </p>

          <div className="mt-6">
            <Field
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="e.g. 14 Marina Road, Lagos"
              required
            />
          </div>
        </section>
      )}

      {type === 'AI' && (
        <section className="rounded-2xl border border-dashed bg-muted/20 p-6 sm:p-8">
          <h2 className="font-semibold">AI interview</h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            AI interview infrastructure will be connected later. For now, the interview can be created and
            managed as an AI interview record.
          </p>
        </section>
      )}

      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <TextareaField
          label="Internal notes"
          value={notes}
          onChange={setNotes}
          placeholder="Optional notes for the hiring team."
        />
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/employer/applications/${applicationId}`)}
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50">
          <ArrowLeft className="size-4" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <CalendarDays className="size-4" />
              Schedule Interview
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        This interview will be attached to {jobTitle} and the candidate&apos;s application.
      </p>
    </form>
  );
}

function TypeOption({
  value,
  current,
  icon,
  title,
  description,
  onChange
}: {
  value: InterviewType;
  current: InterviewType;
  icon: React.ReactNode;
  title: string;
  description: string;
  onChange: (value: InterviewType) => void;
}) {
  const active = current === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`rounded-xl border p-4 text-left transition-colors ${
        active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'
      }`}>
      <div className="flex items-center gap-2">
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${
            active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}>
          {icon}
        </div>

        <span className="text-sm font-semibold">{title}</span>
      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  max?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <input
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="mt-2 w-full resize-y rounded-md border bg-background px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
