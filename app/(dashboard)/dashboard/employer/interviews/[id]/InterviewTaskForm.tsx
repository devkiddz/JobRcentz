'use client';

import { useActionState } from 'react';
import { Plus } from 'lucide-react';

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

export default function InterviewTaskForm({
  action,
  participants,
  employerId,
  candidateId
}: InterviewTaskFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

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

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="title" className="text-xs font-medium">
            Task title
          </label>

          <input
            id="title"
            name="title"
            required
            placeholder="e.g. Review candidate portfolio"
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="description" className="text-xs font-medium">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Describe what needs to be completed..."
            className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="assignedToId" className="text-xs font-medium">
            Assign to
          </label>

          <select
            id="assignedToId"
            name="assignedToId"
            defaultValue=""
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">Unassigned</option>

            {availablePeople.map(person => (
              <option key={person.userId} value={person.userId}>
                {person.user.name} — {person.role}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="priority" className="text-xs font-medium">
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            defaultValue="MEDIUM"
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="dueAt" className="text-xs font-medium">
            Due date
          </label>

          <input
            id="dueAt"
            name="dueAt"
            type="datetime-local"
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {state.error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">
          Interview task created successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
        <Plus className="size-3.5" />

        {pending ? 'Creating...' : 'Create task'}
      </button>
    </form>
  );
}
