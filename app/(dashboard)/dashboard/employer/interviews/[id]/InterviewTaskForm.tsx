'use client';

import { useActionState, useEffect, useRef } from 'react';
import { AlertCircle, CalendarClock, CheckCircle2, ClipboardPlus, Loader2, UserRound } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type ActionState = {
  success: boolean;
  error?: string;
};

type Participant = {
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type InterviewTaskFormProps = {
  action: (previousState: ActionState, formData: FormData) => Promise<ActionState>;
  participants: Participant[];
  employerId: string;
  candidateId: string;
};

const initialState: ActionState = {
  success: false
};

function formatRole(role: string) {
  return role
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export default function InterviewTaskForm({
  action,
  participants,
  employerId,
  candidateId
}: InterviewTaskFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const availablePeople = [
    ...participants,
    {
      userId: employerId,
      role: 'EMPLOYER',
      user: {
        id: employerId,
        name: 'Employer',
        email: ''
      }
    },
    {
      userId: candidateId,
      role: 'CANDIDATE',
      user: {
        id: candidateId,
        name: 'Candidate',
        email: ''
      }
    }
  ].filter((person, index, array) => array.findIndex(item => item.userId === person.userId) === index);

  function handleCancel() {
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Details */}
      <section className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ClipboardPlus className="size-4 text-primary" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Task details</h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Define what needs to be completed during this interview.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">
            Task title
            <span className="ml-1 text-destructive">*</span>
          </Label>

          <Input
            id="title"
            name="title"
            required
            disabled={pending}
            placeholder="e.g. Review candidate portfolio"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>

          <Textarea
            id="description"
            name="description"
            rows={4}
            disabled={pending}
            placeholder="Describe what needs to be completed..."
            className="min-h-28 resize-none rounded-xl"
          />

          <p className="text-[11px] leading-4 text-muted-foreground">
            Add useful context so the assignee knows exactly what is expected.
          </p>
        </div>
      </section>

      {/* Assignment */}
      <section className="space-y-4 border-t pt-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
            <UserRound className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Assignment</h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Choose who will be responsible for this task.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="assignedToId">Assign to</Label>

            <Select name="assignedToId" defaultValue="" disabled={pending}>
              <SelectTrigger id="assignedToId" className="h-11 w-full rounded-xl">
                <SelectValue placeholder="Leave unassigned" />
              </SelectTrigger>

              <SelectContent>
                {/* Important: empty string matches the server action */}
                <SelectItem value="unassigned">Unassigned</SelectItem>

                {availablePeople.map(person => (
                  <SelectItem key={person.userId} value={person.userId}>
                    <span className="truncate">{person.user.name}</span>

                    <span className="ml-1 text-muted-foreground">— {formatRole(person.role)}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>

            <Select name="priority" defaultValue="MEDIUM" disabled={pending}>
              <SelectTrigger id="priority" className="h-11 w-full rounded-xl">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="LOW">Low priority</SelectItem>

                <SelectItem value="MEDIUM">Medium priority</SelectItem>

                <SelectItem value="HIGH">High priority</SelectItem>

                <SelectItem value="URGENT">Urgent priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Scheduling */}
      <section className="space-y-4 border-t pt-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <CalendarClock className="size-4 text-primary" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Scheduling</h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Optionally give the task a deadline.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueAt">Due date</Label>

          <Input
            id="dueAt"
            name="dueAt"
            type="datetime-local"
            disabled={pending}
            className="h-11 w-full rounded-xl"
          />
        </div>
      </section>

      {/* Feedback */}
      {state.error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="size-4" />

          <AlertTitle>Unable to create task</AlertTitle>

          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.success && (
        <Alert className="rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />

          <AlertTitle>Task created</AlertTitle>

          <AlertDescription>The interview task was created successfully.</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="border-t pt-6">
        <div className="grid gap-2 sm:flex sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={handleCancel}
            className="order-2 h-11 w-full rounded-xl sm:order-1 sm:w-auto">
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={pending}
            className="order-1 h-11 w-full rounded-xl px-5 sm:order-2 sm:w-auto">
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating task...
              </>
            ) : (
              <>
                <ClipboardPlus className="size-4" />
                Create task
              </>
            )}
          </Button>
        </div>

        <p className="mt-3 text-center text-[11px] text-muted-foreground sm:text-right">
          You can update task progress after creation.
        </p>
      </div>
    </form>
  );
}
