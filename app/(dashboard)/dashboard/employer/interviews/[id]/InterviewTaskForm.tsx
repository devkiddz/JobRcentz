'use client';

import { useActionState } from 'react';
import { CalendarClock, Plus, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type ActionState = { success: boolean; error?: string };
type Participant = { userId: string; role: string; user: { id: string; name: string; email: string } };

export type InterviewTaskFormTask = {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedToId: string | null;
  dueAt: Date | null;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
};

type Props = {
  action: (previousState: ActionState, formData: FormData) => Promise<ActionState>;
  participants: Participant[];
  employerId: string;
  candidateId: string;
  mode?: 'create' | 'edit';
  task?: InterviewTaskFormTask;
};

function localDateTime(date: Date | null | undefined) {
  if (!date) return '';
  const value = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return value.toISOString().slice(0, 16);
}

export default function InterviewTaskForm({
  action,
  participants,
  employerId,
  candidateId,
  mode = 'create',
  task
}: Props) {
  const [state, formAction, pending] = useActionState(action, { success: false });
  const isEdit = mode === 'edit';

  const people = [
    ...participants,
    { userId: employerId, role: 'EMPLOYER', user: { id: employerId, name: 'Employer', email: '' } },
    { userId: candidateId, role: 'CANDIDATE', user: { id: candidateId, name: 'Candidate', email: '' } }
  ].filter((person, index, all) => all.findIndex(item => item.userId === person.userId) === index);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="task-title" className="text-xs font-medium">Task title</label>
          <Input id="task-title" name="title" required defaultValue={task?.title ?? ''} placeholder="e.g. Review candidate portfolio" />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="task-description" className="text-xs font-medium">Description</label>
          <Textarea id="task-description" name="description" rows={4} defaultValue={task?.description ?? ''} placeholder="Describe what needs to be completed..." className="resize-none" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="task-assignee" className="text-xs font-medium">Assign to</label>
          <Select name="assignedToId" defaultValue={task?.assignedToId ?? 'unassigned'}>
            <SelectTrigger id="task-assignee" className="h-10 w-full"><SelectValue placeholder="Unassigned" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {people.map(person => (
                <SelectItem key={person.userId} value={person.userId}>{person.user.name} — {person.role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="task-priority" className="text-xs font-medium">Priority</label>
          <Select name="priority" defaultValue={task?.priority ?? 'MEDIUM'}>
            <SelectTrigger id="task-priority" className="h-10 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="task-due-at" className="flex items-center gap-1.5 text-xs font-medium"><CalendarClock className="size-3.5 text-muted-foreground" />Due date</label>
          <Input id="task-due-at" name="dueAt" type="datetime-local" defaultValue={localDateTime(task?.dueAt)} />
        </div>
      </div>

      {state.error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">{state.error}</p>}
      {state.success && <p role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">{isEdit ? 'Interview task updated successfully.' : 'Interview task created successfully.'}</p>}

      <Button type="submit" disabled={pending} size="sm">
        {pending ? 'Saving...' : isEdit ? <><Save className="size-3.5" />Save changes</> : <><Plus className="size-3.5" />Create task</>}
      </Button>
    </form>
  );
}
