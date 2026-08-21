'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type NoteResult =
  | {
      success: true;
      noteId: string;
    }
  | {
      success: false;
      error: string;
    };

async function getEmployerInterview(interviewId: string, userId: string) {
  return prisma.interview.findFirst({
    where: {
      id: interviewId,
      employerId: userId
    },
    select: {
      id: true,
      employerId: true,
      candidateId: true,
      title: true
    }
  });
}

async function getEmployerNote(noteId: string, userId: string) {
  return prisma.interviewNote.findFirst({
    where: {
      id: noteId,
      interview: {
        employerId: userId
      }
    },
    select: {
      id: true,
      interviewId: true,
      authorId: true
    }
  });
}

function revalidateInterviewPaths(interviewId: string) {
  revalidatePath(`/dashboard/employer/interviews/${interviewId}`);
  revalidatePath('/dashboard/employer/interviews');
}

export async function createInterviewNote(
  interviewId: string,
  formData: FormData
): Promise<NoteResult> {
  try {
    const user = await requireAuth();

    const interview = await getEmployerInterview(interviewId, user.id);

    if (!interview) {
      return {
        success: false,
        error: 'Interview not found.'
      };
    }

    const body = formData.get('body');

    if (typeof body !== 'string' || !body.trim()) {
      return {
        success: false,
        error: 'Note content is required.'
      };
    }

    const cleanBody = body.trim();

    const note = await prisma.$transaction(async tx => {
      const createdNote = await tx.interviewNote.create({
        data: {
          interviewId: interview.id,
          authorId: user.id,
          body: cleanBody
        },
        select: {
          id: true
        }
      });

      await tx.interviewEvent.create({
        data: {
          interviewId: interview.id,
          actorId: user.id,
          type: 'NOTE_ADDED',
          metadata: {
            noteId: createdNote.id
          }
        }
      });

      return createdNote;
    });

    revalidateInterviewPaths(interview.id);

    return {
      success: true,
      noteId: note.id
    };
  } catch (error) {
    console.error('createInterviewNote failed:', error);

    return {
      success: false,
      error: 'Unable to create the interview note.'
    };
  }
}

export async function updateInterviewNote(
  noteId: string,
  formData: FormData
): Promise<NoteResult> {
  try {
    const user = await requireAuth();

    const body = formData.get('body');

    if (typeof body !== 'string' || !body.trim()) {
      return {
        success: false,
        error: 'Note content is required.'
      };
    }

    const cleanBody = body.trim();

    const note = await getEmployerNote(noteId, user.id);

    if (!note) {
      return {
        success: false,
        error: 'Interview note not found.'
      };
    }

    await prisma.$transaction([
      prisma.interviewNote.update({
        where: {
          id: note.id
        },
        data: {
          body: cleanBody
        }
      }),

      prisma.interviewEvent.create({
        data: {
          interviewId: note.interviewId,
          actorId: user.id,
          type: 'UPDATED',
          metadata: {
            noteId: note.id,
            action: 'NOTE_UPDATED'
          }
        }
      })
    ]);

    revalidateInterviewPaths(note.interviewId);

    return {
      success: true,
      noteId: note.id
    };
  } catch (error) {
    console.error('updateInterviewNote failed:', error);

    return {
      success: false,
      error: 'Unable to update the interview note.'
    };
  }
}

export async function deleteInterviewNote(
  noteId: string
): Promise<NoteResult> {
  try {
    const user = await requireAuth();

    const note = await getEmployerNote(noteId, user.id);

    if (!note) {
      return {
        success: false,
        error: 'Interview note not found.'
      };
    }

    await prisma.$transaction([
      prisma.interviewNote.delete({
        where: {
          id: note.id
        }
      }),

      prisma.interviewEvent.create({
        data: {
          interviewId: note.interviewId,
          actorId: user.id,
          type: 'UPDATED',
          metadata: {
            noteId: note.id,
            action: 'NOTE_DELETED'
          }
        }
      })
    ]);

    revalidateInterviewPaths(note.interviewId);

    return {
      success: true,
      noteId: note.id
    };
  } catch (error) {
    console.error('deleteInterviewNote failed:', error);

    return {
      success: false,
      error: 'Unable to delete the interview note.'
    };
  }
}