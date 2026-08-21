'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  Loader2,
  MapPin,
  MonitorPlay,
  Sparkles,
  Video,
  Users,
  FileText
} from 'lucide-react';

import {
  createInterview,
  type CreateInterviewInput,
  type CreateInterviewResult
} from '@/server/actions/dashboard/employer/interviews/createInterview';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  applicationId: string;
};

const initialState: CreateInterviewResult = {
  success: false,
  error: ''
};

type InterviewType = 'ONLINE' | 'IN_PERSON' | 'AI';

type Provider = 'INTERNAL' | 'ZOOM' | 'GOOGLE_MEET' | 'MICROSOFT_TEAMS' | 'OTHER';

async function createInterviewAction(
  _previousState: CreateInterviewResult,
  formData: FormData
): Promise<CreateInterviewResult> {
  const input: CreateInterviewInput = {
    applicationId: String(formData.get('applicationId') ?? ''),
    title: String(formData.get('title') ?? ''),
    type: String(formData.get('type') ?? 'ONLINE') as CreateInterviewInput['type'],
    scheduledAt: String(formData.get('scheduledAt') ?? ''),
    timezone: String(formData.get('timezone') ?? 'Africa/Lagos'),
    durationMinutes: Number(formData.get('durationMinutes') ?? 60),
    meetingProvider: String(
      formData.get('meetingProvider') ?? 'INTERNAL'
    ) as CreateInterviewInput['meetingProvider'],
    meetingUrl: String(formData.get('meetingUrl') ?? ''),
    meetingId: String(formData.get('meetingId') ?? ''),
    meetingPasscode: String(formData.get('meetingPasscode') ?? ''),
    location: String(formData.get('location') ?? ''),
    description: String(formData.get('description') ?? '')
  };

  return createInterview(input);
}

const interviewTypes = [
  {
    value: 'ONLINE' as const,
    title: 'Online',
    description: 'Meet through video',
    icon: Video
  },
  {
    value: 'IN_PERSON' as const,
    title: 'In person',
    description: 'Meet at a physical location',
    icon: MapPin
  },
  {
    value: 'AI' as const,
    title: 'AI interview',
    description: 'Automated interview experience',
    icon: Sparkles
  }
];

const providers = [
  {
    value: 'INTERNAL',
    label: 'Rcentz'
  },
  {
    value: 'GOOGLE_MEET',
    label: 'Google Meet'
  },
  {
    value: 'ZOOM',
    label: 'Zoom'
  },
  {
    value: 'MICROSOFT_TEAMS',
    label: 'Teams'
  },
  {
    value: 'OTHER',
    label: 'Other'
  }
];

export default function CreateInterviewForm({ applicationId }: Props) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(createInterviewAction, initialState);

  const [type, setType] = useState<InterviewType>('ONLINE');

  const [provider, setProvider] = useState<Provider>('INTERNAL');

  useEffect(() => {
    if (state.success && state.interviewId) {
      router.push(`/dashboard/employer/interviews/${state.interviewId}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mx-auto w-full max-w-5xl pb-24">
      <input type="hidden" name="applicationId" value={applicationId} />

      <input type="hidden" name="type" value={type} />

      <input type="hidden" name="meetingProvider" value={provider} />

      <div className="space-y-6">
        {/* -------------------------------------------------
            STEP / OVERVIEW
        ------------------------------------------------- */}
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="size-5" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight">Interview setup</h2>

                  <Badge variant="secondary" className="gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    New interview
                  </Badge>
                </div>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Configure the interview format, schedule, meeting details and candidate instructions.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
              <Users className="size-4" />
              Candidate interview
            </div>
          </div>

          <Separator />

          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Video className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Format</p>

                <p className="text-sm font-medium">
                  {type === 'ONLINE' ? 'Online' : type === 'IN_PERSON' ? 'In person' : 'AI interview'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Clock3 className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Duration</p>

                <p className="text-sm font-medium">60 minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <CalendarDays className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Timezone</p>

                <p className="text-sm font-medium">Africa/Lagos</p>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------
            INTERVIEW FORMAT
        ------------------------------------------------- */}
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MonitorPlay className="size-4" />
              </div>

              <div>
                <CardTitle className="text-base">Interview format</CardTitle>

                <CardDescription className="mt-1">Choose how you want to meet the candidate.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-5 sm:p-6">
            <RadioGroup
              value={type}
              onValueChange={value => setType(value as InterviewType)}
              className="grid gap-3 md:grid-cols-3">
              {interviewTypes.map(item => {
                const Icon = item.icon;
                const selected = type === item.value;

                return (
                  <Label
                    key={item.value}
                    htmlFor={`interview-type-${item.value}`}
                    className={[
                      'relative flex min-h-[116px] cursor-pointer items-start gap-3 rounded-xl border p-4',
                      'transition-all duration-200',
                      'hover:border-primary/40 hover:bg-muted/30',
                      selected
                        ? 'border-primary bg-primary/[0.045] shadow-sm ring-1 ring-primary/20'
                        : 'border-border'
                    ].join(' ')}>
                    <RadioGroupItem
                      id={`interview-type-${item.value}`}
                      value={item.value}
                      className="sr-only"
                    />

                    <div
                      className={[
                        'flex size-10 shrink-0 items-center justify-center rounded-lg',
                        selected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      ].join(' ')}>
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                        </div>

                        {selected && (
                          <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="title">Interview title</Label>

              <Input
                id="title"
                name="title"
                placeholder="e.g. Frontend Developer Interview"
                className="h-11"
              />

              <p className="text-xs leading-5 text-muted-foreground">
                Leave blank and Rcentz will generate an appropriate title automatically.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* -------------------------------------------------
            SCHEDULE
        ------------------------------------------------- */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="size-4" />
              </div>

              <div>
                <CardTitle className="text-base">Schedule</CardTitle>

                <CardDescription className="mt-1">Choose when the candidate should attend.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Date and time</Label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="scheduledAt"
                    name="scheduledAt"
                    type="datetime-local"
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration</Label>

                <Select name="durationMinutes" defaultValue="60">
                  <SelectTrigger id="durationMinutes" className="h-11">
                    <div className="flex items-center gap-2">
                      <Clock3 className="size-4 text-muted-foreground" />

                      <SelectValue placeholder="Select duration" />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>

                    <SelectItem value="30">30 minutes</SelectItem>

                    <SelectItem value="45">45 minutes</SelectItem>

                    <SelectItem value="60">60 minutes</SelectItem>

                    <SelectItem value="90">90 minutes</SelectItem>

                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>

              <Select name="timezone" defaultValue="Africa/Lagos">
                <SelectTrigger id="timezone" className="h-11">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Africa/Lagos">Africa/Lagos — WAT</SelectItem>

                  <SelectItem value="Africa/Accra">Africa/Accra — GMT</SelectItem>

                  <SelectItem value="Europe/London">Europe/London</SelectItem>

                  <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>

                  <SelectItem value="America/New_York">America/New_York</SelectItem>

                  <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Scheduling tip</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Make sure the selected time gives the candidate enough notice and matches the selected
                    timezone.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* -------------------------------------------------
            ONLINE MEETING
        ------------------------------------------------- */}
        {type === 'ONLINE' && (
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MonitorPlay className="size-4" />
                </div>

                <div>
                  <CardTitle className="text-base">Online meeting</CardTitle>

                  <CardDescription className="mt-1">Configure how the candidate will join.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-5 sm:p-6">
              <div className="space-y-3">
                <Label>Meeting provider</Label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {providers.map(item => {
                    const selected = provider === item.value;

                    return (
                      <Button
                        key={item.value}
                        type="button"
                        variant={selected ? 'default' : 'outline'}
                        className="h-10 text-xs sm:text-sm"
                        onClick={() => setProvider(item.value as Provider)}>
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="meetingUrl">
                  Meeting URL
                  {provider !== 'INTERNAL' && <span className="ml-1 text-destructive">*</span>}
                </Label>

                <div className="relative">
                  <ExternalLink className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="meetingUrl"
                    name="meetingUrl"
                    type="url"
                    required={provider !== 'INTERNAL'}
                    disabled={provider === 'INTERNAL'}
                    placeholder={
                      provider === 'INTERNAL' ? 'Generated automatically by Rcentz' : 'https://...'
                    }
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meetingId">Meeting ID</Label>

                  <Input id="meetingId" name="meetingId" placeholder="Optional" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingPasscode">Passcode</Label>

                  <Input
                    id="meetingPasscode"
                    name="meetingPasscode"
                    placeholder="Optional"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* -------------------------------------------------
            IN PERSON
        ------------------------------------------------- */}
        {type === 'IN_PERSON' && (
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>

                <div>
                  <CardTitle className="text-base">Interview location</CardTitle>

                  <CardDescription className="mt-1">Tell the candidate where to attend.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="location"
                    name="location"
                    required
                    placeholder="e.g. 12 Airport Road, Warri"
                    className="h-11 pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* -------------------------------------------------
            AI INTERVIEW
        ------------------------------------------------- */}
        {type === 'AI' && (
          <Card className="border-primary/20 bg-primary/[0.025] shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>

                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">AI interview</h3>

                    <Badge variant="secondary">Coming later</Badge>
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">
                    AI interview infrastructure is part of the Rcentz platform architecture. The actual AI
                    interview experience will be connected in a later development phase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* -------------------------------------------------
            ADDITIONAL INFORMATION
        ------------------------------------------------- */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4" />
              </div>

              <div>
                <CardTitle className="text-base">Additional information</CardTitle>

                <CardDescription className="mt-1">
                  Give the candidate useful context before the interview.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            <Textarea
              name="description"
              rows={6}
              placeholder="Interview agenda, preparation instructions, topics to discuss..."
              className="min-h-32 resize-none"
            />
          </CardContent>
        </Card>

        {/* -------------------------------------------------
            ERROR
        ------------------------------------------------- */}
        {!state.success && state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {/* -------------------------------------------------
            ACTION BAR
        ------------------------------------------------- */}
        <div className="sticky bottom-3 z-20">
          <div className="rounded-2xl border bg-background/95 p-3 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden min-w-0 sm:block">
                <p className="text-sm font-medium">Ready to schedule?</p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  The interview details will be saved to this application.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => router.push(`/dashboard/employer/applications/${applicationId}`)}
                  className="w-full sm:w-auto">
                  Cancel
                </Button>

                <Button type="submit" disabled={isPending} className="w-full gap-2 sm:w-auto">
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <CalendarDays className="size-4" />
                      Schedule interview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
