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

export async function createInterviewNote(
  interviewId: string,
  formData: FormData
): Promise<NoteResult> {
  try {
    const user = await requireAuth();

    const interview = await getEmployerInterview(
      interviewId,
      user.id
    );

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

    const note = await prisma.interviewNote.create({
      data: {
        interviewId: interview.id,
        authorId: user.id,
        body: cleanBody
      },
      select: {
        id: true
      }
    });

    await prisma.interviewEvent.create({
      data: {
        interviewId: interview.id,
        actorId: user.id,
        type: 'NOTE_ADDED',
        metadata: {
          noteId: note.id
        }
      }
    });

    revalidatePath(
      `/dashboard/employer/interviews/${interview.id}`
    );

    revalidatePath(
      '/dashboard/employer/interviews'
    );

    return {
      success: true,
      noteId: note.id
    };
  } catch (error) {
    console.error(
      'createInterviewNote failed:',
      error
    );

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

    const note = await prisma.interviewNote.findUnique({
      where: {
        id: noteId
      },
      select: {
        id: true,
        authorId: true,
        interviewId: true,
        interview: {
          select: {
            id: true,
            employerId: true
          }
        }
      }
    });

    if (!note) {
      return {
        success: false,
        error: 'Interview note not found.'
      };
    }

    const isAuthor = note.authorId === user.id;
    const isEmployer =
      note.interview.employerId === user.id;

    if (!isAuthor && !isEmployer) {
      return {
        success: false,
        error: 'You are not authorized to update this note.'
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

    revalidatePath(
      `/dashboard/employer/interviews/${note.interviewId}`
    );

    revalidatePath(
      '/dashboard/employer/interviews'
    );

    return {
      success: true,
      noteId: note.id
    };
  } catch (error) {
    console.error(
      'updateInterviewNote failed:',
      error
    );

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

    const note = await prisma.interviewNote.findUnique({
      where: {
        id: noteId
      },
      select: {
        id: true,
        authorId: true,
        interviewId: true,
        interview: {
          select: {
            id: true,
            employerId: true
          }
        }
      }
    });

    if (!note) {
      return {
        success: false,
        error: 'Interview note not found.'
      };
    }

    const isAuthor = note.authorId === user.id;
    const isEmployer =
      note.interview.employerId === user.id;

    if (!isAuthor && !isEmployer) {
      return {
        success: false,
        error: 'You are not authorized to delete this note.'
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
            action: 'NOTE_UPDATED'
            }
        }
        })
    ]);

    revalidatePath(
      `/dashboard/employer/interviews/${note.interviewId}`
    );

    revalidatePath(
      '/dashboard/employer/interviews'
    );

    return {
      success: true,
      noteId: note.id
    };
  } catch (error) {
    console.error(
      'deleteInterviewNote failed:',
      error
    );

    return {
      success: false,
      error: 'Unable to delete the interview note.'
    };
  }
}