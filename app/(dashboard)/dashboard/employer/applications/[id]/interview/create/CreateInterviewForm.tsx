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
  candidateName: string;
  jobTitle: string;
};

export default function CreateInterviewForm({ applicationId, candidateName, jobTitle }: Props) {
  const router = useRouter();

  const [type, setType] = useState<CreateInterviewInput['type']>('ONLINE');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');

  const [meetingProvider, setMeetingProvider] =
    useState<CreateInterviewInput['meetingProvider']>('GOOGLE_MEET');

  const [meetingUrl, setMeetingUrl] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [meetingPasscode, setMeetingPasscode] = useState('');

  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const result = await createInterview({
        applicationId,
        type,
        title,
        description,
        scheduledAt,
        durationMinutes: Number(durationMinutes),
        timezone: 'Africa/Lagos',
        meetingProvider: type === 'ONLINE' ? meetingProvider : undefined,
        meetingUrl: type === 'ONLINE' ? meetingUrl : undefined,
        meetingId: type === 'ONLINE' ? meetingId : undefined,
        meetingPasscode: type === 'ONLINE' ? meetingPasscode : undefined,
        location: type === 'IN_PERSON' ? location : undefined,
        notes
      });

      if (!result.success) {
        throw new Error('Unable to create interview.');
      }

      router.push(`/dashboard/employer/applications/${applicationId}`);

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while scheduling the interview.');

      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">Interview Details</h2>

            <p className="mt-1 text-sm text-muted-foreground">Set the basic details for this interview.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Interview title
            </label>

            <Input
              id="title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder={`Interview for ${jobTitle}`}
              className="mt-2 h-10"
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>

            <Textarea
              id="description"
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="Add any information the candidate should know before the interview."
              className="mt-2 min-h-28"
            />
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">Schedule</h2>

            <p className="mt-1 text-sm text-muted-foreground">Choose when the interview will take place.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="scheduledAt" className="text-sm font-medium">
              Date & time
            </label>

            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={event => setScheduledAt(event.target.value)}
              required
              className="mt-2 h-10"
            />

            <p className="mt-2 text-xs text-muted-foreground">Timezone: Africa/Lagos</p>
          </div>

          <div>
            <label htmlFor="duration" className="text-sm font-medium">
              Duration
            </label>

            <Select value={durationMinutes} onValueChange={value => setDurationMinutes(value ?? '60')}>
              <SelectTrigger className="mt-2 h-10 w-full">
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
      </section>

      {/* Interview Type */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Video className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">Interview Format</h2>

            <p className="mt-1 text-sm text-muted-foreground">Choose how you will interview the candidate.</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium">Interview type</label>

          <Select value={type} onValueChange={value => setType(value as CreateInterviewInput['type'])}>
            <SelectTrigger className="mt-2 h-10 w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ONLINE">Online interview</SelectItem>

              <SelectItem value="IN_PERSON">In-person interview</SelectItem>

              <SelectItem value="AI">AI interview</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Online */}
        {type === 'ONLINE' && (
          <div className="mt-6 space-y-5 rounded-xl border bg-muted/20 p-5">
            <div>
              <label className="text-sm font-medium">Meeting provider</label>

              <Select
                value={meetingProvider}
                onValueChange={value => setMeetingProvider(value as CreateInterviewInput['meetingProvider'])}>
                <SelectTrigger className="mt-2 h-10 w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="GOOGLE_MEET">Google Meet</SelectItem>

                  <SelectItem value="ZOOM">Zoom</SelectItem>

                  <SelectItem value="MICROSOFT_TEAMS">Microsoft Teams</SelectItem>

                  <SelectItem value="INTERNAL">JobRcentz meeting</SelectItem>

                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {meetingProvider !== 'INTERNAL' && (
              <div>
                <label htmlFor="meetingUrl" className="text-sm font-medium">
                  Meeting URL
                </label>

                <Input
                  id="meetingUrl"
                  type="url"
                  value={meetingUrl}
                  onChange={event => setMeetingUrl(event.target.value)}
                  placeholder="https://..."
                  required
                  className="mt-2 h-10"
                />
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="meetingId" className="text-sm font-medium">
                  Meeting ID
                </label>

                <Input
                  id="meetingId"
                  value={meetingId}
                  onChange={event => setMeetingId(event.target.value)}
                  placeholder="Optional"
                  className="mt-2 h-10"
                />
              </div>

              <div>
                <label htmlFor="meetingPasscode" className="text-sm font-medium">
                  Passcode
                </label>

                <Input
                  id="meetingPasscode"
                  value={meetingPasscode}
                  onChange={event => setMeetingPasscode(event.target.value)}
                  placeholder="Optional"
                  className="mt-2 h-10"
                />
              </div>
            </div>
          </div>
        )}

        {/* In person */}
        {type === 'IN_PERSON' && (
          <div className="mt-6 rounded-xl border bg-muted/20 p-5">
            <div>
              <label htmlFor="location" className="text-sm font-medium">
                Interview location
              </label>

              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="location"
                  value={location}
                  onChange={event => setLocation(event.target.value)}
                  placeholder="Office address or interview venue"
                  required
                  className="h-10 pl-9"
                />
              </div>
            </div>
          </div>
        )}

        {/* AI */}
        {type === 'AI' && (
          <div className="mt-6 rounded-xl border border-dashed bg-muted/20 p-5">
            <p className="text-sm font-medium">AI Interview</p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              AI interview infrastructure will be connected later. For now, the interview record can be
              created and managed as an AI interview.
            </p>
          </div>
        )}
      </section>

      {/* Notes */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <h2 className="font-semibold">Internal Notes</h2>

        <p className="mt-1 text-sm text-muted-foreground">Add notes for the hiring team.</p>

        <Textarea
          value={notes}
          onChange={event => setNotes(event.target.value)}
          placeholder="Optional internal interview notes..."
          className="mt-5 min-h-32"
        />
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push(`/dashboard/employer/applications/${applicationId}`)}>
          Cancel
        </Button>

        <Button type="submit" size="lg" disabled={isSubmitting}>
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
