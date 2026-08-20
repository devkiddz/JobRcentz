'use client';

import { useState } from 'react';
import { Check, FileText, Loader2, Pencil, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import {
  createInterviewNote,
  deleteInterviewNote,
  updateInterviewNote
} from '@/server/actions/dashboard/employer/interviews/manageInterviewNote';

type InterviewNote = {
  id: string;
  body: string;
  visibility: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  author: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

type InterviewNotesProps = {
  interviewId: string;
  notes: InterviewNote[];
};

type NoteAction =
  | {
      type: 'CREATE';
    }
  | {
      type: 'EDIT';
      noteId: string;
    }
  | {
      type: 'DELETE';
      noteId: string;
    };

export default function InterviewNotes({ interviewId, notes }: InterviewNotesProps) {
  const [body, setBody] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');
  const [loadingAction, setLoadingAction] = useState<NoteAction | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!body.trim() || loadingAction) {
      return;
    }

    setLoadingAction({
      type: 'CREATE'
    });

    try {
      const formData = new FormData();
      formData.set('body', body);

      const result = await createInterviewNote(interviewId, formData);

      if (!result.success) {
        window.alert(result.error);
        return;
      }

      setBody('');
      window.location.reload();
    } catch (error) {
      console.error('Failed to create interview note:', error);

      window.alert('Unable to create the interview note.');
    } finally {
      setLoadingAction(null);
    }
  }

  function startEditing(note: InterviewNote) {
    setEditingNoteId(note.id);
    setEditingBody(note.body);
  }

  function cancelEditing() {
    if (loadingAction) {
      return;
    }

    setEditingNoteId(null);
    setEditingBody('');
  }

  async function handleUpdate(noteId: string) {
    if (!editingBody.trim() || loadingAction) {
      return;
    }

    setLoadingAction({
      type: 'EDIT',
      noteId
    });

    try {
      const formData = new FormData();
      formData.set('body', editingBody);

      const result = await updateInterviewNote(noteId, formData);

      if (!result.success) {
        window.alert(result.error);
        return;
      }

      setEditingNoteId(null);
      setEditingBody('');

      window.location.reload();
    } catch (error) {
      console.error('Failed to update interview note:', error);

      window.alert('Unable to update the interview note.');
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDelete(noteId: string) {
    if (loadingAction) {
      return;
    }

    const confirmed = window.confirm('Delete this interview note? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    setLoadingAction({
      type: 'DELETE',
      noteId
    });

    try {
      const result = await deleteInterviewNote(noteId);

      if (!result.success) {
        window.alert(result.error);
        return;
      }

      if (editingNoteId === noteId) {
        setEditingNoteId(null);
        setEditingBody('');
      }

      window.location.reload();
    } catch (error) {
      console.error('Failed to delete interview note:', error);

      window.alert('Unable to delete the interview note.');
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <section className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FileText className="size-4 text-primary" />
        </div>

        <div>
          <h2 className="text-sm font-semibold">Interview notes</h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Keep track of important observations, decisions and interview context.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="space-y-3">
        <Textarea
          value={body}
          onChange={event => setBody(event.target.value)}
          placeholder="Write an interview note..."
          rows={4}
          disabled={loadingAction !== null}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={!body.trim() || loadingAction !== null}>
            {loadingAction?.type === 'CREATE' && <Loader2 className="mr-2 size-4 animate-spin" />}
            Add note
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <FileText className="mx-auto size-5 text-muted-foreground" />

            <p className="mt-2 text-sm font-medium">No interview notes yet</p>

            <p className="mt-1 text-xs text-muted-foreground">Add the first note to this interview.</p>
          </div>
        ) : (
          notes.map(note => {
            const isEditing = editingNoteId === note.id;

            const isEditingThisNote = loadingAction?.type === 'EDIT' && loadingAction.noteId === note.id;

            const isDeletingThisNote = loadingAction?.type === 'DELETE' && loadingAction.noteId === note.id;

            return (
              <article key={note.id} className="rounded-xl border bg-background p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{note.author.name}</p>

                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {formatNoteDate(note.createdAt)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {formatVisibility(note.visibility)}
                  </span>
                </div>

                {isEditing ? (
                  <div className="mt-4 space-y-3">
                    <Textarea
                      value={editingBody}
                      onChange={event => setEditingBody(event.target.value)}
                      rows={5}
                      disabled={isEditingThisNote}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                        disabled={loadingAction !== null}>
                        <X className="mr-1.5 size-3.5" />
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleUpdate(note.id)}
                        disabled={!editingBody.trim() || loadingAction !== null}>
                        {isEditingThisNote ? (
                          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        ) : (
                          <Check className="mr-1.5 size-3.5" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {note.body}
                    </p>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(note)}
                        disabled={loadingAction !== null}>
                        <Pencil className="mr-1.5 size-3.5" />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(note.id)}
                        disabled={loadingAction !== null}>
                        {isDeletingThisNote ? (
                          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="mr-1.5 size-3.5" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function formatNoteDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));
}

function formatVisibility(visibility: string) {
  return visibility
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
