'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Loader2, MapPin, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
  createInterview,
  type CreateInterviewInput
} from '@/server/actions/dashboard/employer/interviews/createInterview';

type Props = {
  applicationId: string;
};

type InterviewType = CreateInterviewInput['type'];

type MeetingProvider = NonNullable<CreateInterviewInput['meetingProvider']>;

export default function CreateInterviewForm({ applicationId }: Props) {
  const router = useRouter();

  const [type, setType] = useState<InterviewType>('ONLINE');
  const [provider, setProvider] = useState<MeetingProvider>('INTERNAL');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await createInterview({
        applicationId,
        type,
        title: String(formData.get('title') ?? '').trim() || undefined,
        description: String(formData.get('description') ?? '').trim() || undefined,
        scheduledAt: String(formData.get('scheduledAt') ?? ''),
        durationMinutes: Number(formData.get('durationMinutes') ?? 60),
        timezone: 'Africa/Lagos',

        meetingProvider: type === 'ONLINE' ? provider : undefined,

        meetingUrl:
          type === 'ONLINE' ? String(formData.get('meetingUrl') ?? '').trim() || undefined : undefined,

        meetingId:
          type === 'ONLINE' ? String(formData.get('meetingId') ?? '').trim() || undefined : undefined,

        meetingPasscode:
          type === 'ONLINE' ? String(formData.get('meetingPasscode') ?? '').trim() || undefined : undefined,

        location:
          type === 'IN_PERSON' ? String(formData.get('location') ?? '').trim() || undefined : undefined,

        notes: String(formData.get('notes') ?? '').trim() || undefined
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/dashboard/employer/interviews/${result.interviewId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to schedule the interview.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Interview details */}
      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Video className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">Interview details</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Configure how and when the interview will take place.
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-6">
          <div>
            <label className="text-sm font-medium">Interview type</label>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <TypeOption
                active={type === 'ONLINE'}
                icon={<Video className="size-4" />}
                title="Online"
                description="Video or virtual meeting"
                onClick={() => {
                  setType('ONLINE');
                  setError('');
                }}
              />

              <TypeOption
                active={type === 'IN_PERSON'}
                icon={<MapPin className="size-4" />}
                title="In person"
                description="Physical interview"
                onClick={() => {
                  setType('IN_PERSON');
                  setError('');
                }}
              />

              <TypeOption
                active={type === 'AI'}
                icon={<Video className="size-4" />}
                title="AI interview"
                description="AI-assisted interview"
                onClick={() => {
                  setType('AI');
                  setError('');
                }}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Interview title" name="title" placeholder="e.g. Frontend Developer Interview" />

            <div>
              <label htmlFor="durationMinutes" className="text-sm font-medium">
                Duration
              </label>

              <Select name="durationMinutes" defaultValue="60">
                <SelectTrigger id="durationMinutes" className="mt-2 h-11 w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>

                  <SelectItem value="30">30 minutes</SelectItem>

                  <SelectItem value="45">45 minutes</SelectItem>

                  <SelectItem value="60">1 hour</SelectItem>

                  <SelectItem value="90">1 hour 30 minutes</SelectItem>

                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="scheduledAt" className="text-sm font-medium">
              Date and time
            </label>

            <div className="relative mt-2">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                required
                className="h-11 pl-10"
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">Timezone: Africa/Lagos (WAT)</p>
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>

            <Textarea
              id="description"
              name="description"
              placeholder="What should the candidate expect from this interview?"
              className="mt-2 min-h-28"
            />
          </div>
        </div>
      </section>

      {/* Online */}
      {type === 'ONLINE' && (
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-semibold">Online meeting</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add the details the candidate will use to join.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium">Meeting provider</label>

              <Select value={provider} onValueChange={value => setProvider(value as MeetingProvider)}>
                <SelectTrigger className="mt-2 h-11 w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="INTERNAL">JobRcentz</SelectItem>

                  <SelectItem value="GOOGLE_MEET">Google Meet</SelectItem>

                  <SelectItem value="ZOOM">Zoom</SelectItem>

                  <SelectItem value="MICROSOFT_TEAMS">Microsoft Teams</SelectItem>

                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {provider !== 'INTERNAL' && (
              <Field label="Meeting URL" name="meetingUrl" type="url" placeholder="https://..." required />
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Meeting ID" name="meetingId" placeholder="Optional" />

              <Field label="Passcode" name="meetingPasscode" placeholder="Optional" />
            </div>
          </div>
        </section>
      )}

      {/* In person */}
      {type === 'IN_PERSON' && (
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-semibold">Interview location</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Tell the candidate where the interview will take place.
          </p>

          <div className="relative mt-6">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              name="location"
              required
              placeholder="Office address or interview venue"
              className="h-11 pl-10"
            />
          </div>
        </section>
      )}

      {/* AI */}
      {type === 'AI' && (
        <section className="rounded-2xl border border-dashed bg-muted/20 p-6 sm:p-8">
          <h2 className="font-semibold">AI interview</h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            The interview can be created and managed as an AI interview record. AI interview infrastructure
            can be connected later.
          </p>
        </section>
      )}

      {/* Notes */}
      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <label htmlFor="notes" className="text-sm font-medium">
          Internal notes
        </label>

        <p className="mt-1 text-sm text-muted-foreground">Optional notes for the hiring team.</p>

        <Textarea
          id="notes"
          name="notes"
          rows={5}
          placeholder="Interview agenda, preparation notes, evaluation focus..."
          className="mt-5 min-h-32"
        />
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push(`/dashboard/employer/applications/${applicationId}`)}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
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
        </Button>
      </div>
    </form>
  );
}

function TypeOption({
  active,
  icon,
  title,
  description,
  onClick
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all ${
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
  name,
  placeholder,
  type = 'text',
  required = false
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 h-11"
      />
    </div>
  );
}
