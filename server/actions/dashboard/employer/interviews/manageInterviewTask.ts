'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type TaskAction = 'START' | 'COMPLETE' | 'CANCEL';
type TaskResult = { success: true; taskId: string } | { success: false; error: string };

type ParsedTask = {
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedToId: string | null;
  dueAt: Date | null;
};

function parseTaskForm(formData: FormData): ParsedTask | { error: string } {
  const title = formData.get('title');
  if (typeof title !== 'string' || !title.trim()) {
    return { error: 'Task title is required.' };
  }

  const rawPriority = formData.get('priority');
  const priority: ParsedTask['priority'] =
    rawPriority === 'LOW' || rawPriority === 'HIGH' || rawPriority === 'URGENT'
      ? rawPriority
      : 'MEDIUM';

  const rawDueAt = formData.get('dueAt');
  let dueAt: Date | null = null;
  if (typeof rawDueAt === 'string' && rawDueAt.trim()) {
    dueAt = new Date(rawDueAt);
    if (Number.isNaN(dueAt.getTime())) {
      return { error: 'Please provide a valid due date.' };
    }
  }

  const rawAssignedToId = formData.get('assignedToId');

  return {
    title: title.trim(),
    description:
      typeof formData.get('description') === 'string' && String(formData.get('description')).trim()
        ? String(formData.get('description')).trim()
        : null,
    priority,
    assignedToId:
      typeof rawAssignedToId === 'string' && rawAssignedToId !== 'unassigned'
        ? rawAssignedToId
        : null,
    dueAt
  };
}

async function getInterviewForEmployer(interviewId: string, userId: string) {
  return prisma.interview.findFirst({
    where: { id: interviewId, employerId: userId },
    select: { id: true, employerId: true, candidateId: true }
  });
}

async function isValidAssignee(
  interviewId: string,
  employerId: string,
  candidateId: string,
  assignedToId: string | null
) {
  if (!assignedToId) return true;
  if (assignedToId === employerId || assignedToId === candidateId) return true;

  const participant = await prisma.interviewParticipant.findFirst({
    where: { interviewId, userId: assignedToId },
    select: { userId: true }
  });

  return Boolean(participant);
}

export async function createInterviewTask(
  interviewId: string,
  formData: FormData
): Promise<TaskResult> {
  try {
    const user = await requireAuth();
    const interview = await getInterviewForEmployer(interviewId, user.id);
    if (!interview) return { success: false, error: 'Interview not found.' };

    const parsed = parseTaskForm(formData);
    if ('error' in parsed) return { success: false, error: parsed.error };

    if (!(await isValidAssignee(
      interviewId,
      interview.employerId,
      interview.candidateId,
      parsed.assignedToId
    ))) {
      return { success: false, error: 'The selected user is not part of this interview.' };
    }

    const task = await prisma.$transaction(async tx => {
      const created = await tx.interviewTask.create({
        data: { interviewId, ...parsed },
        select: { id: true, title: true, assignedToId: true }
      });

      await tx.interviewEvent.create({
        data: {
          interviewId,
          actorId: user.id,
          type: 'TASK_CREATED',
          metadata: { taskId: created.id, title: created.title }
        }
      });

      return created;
    });

    revalidatePath(`/dashboard/employer/interviews/${interviewId}`);
    revalidatePath('/dashboard/employer/interviews');
    return { success: true, taskId: task.id };
  } catch (error) {
    console.error('createInterviewTask failed:', error);
    return { success: false, error: 'Unable to create the interview task.' };
  }
}

export async function updateInterviewTask(
  taskId: string,
  formData: FormData
): Promise<TaskResult> {
  try {
    const user = await requireAuth();

    const task = await prisma.interviewTask.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        interviewId: true,
        title: true,
        status: true,
        assignedToId: true,
        interview: {
          select: { id: true, employerId: true, candidateId: true }
        }
      }
    });

    if (!task) return { success: false, error: 'Interview task not found.' };
    if (task.interview.employerId !== user.id) {
      return { success: false, error: 'Only the employer can edit this task.' };
    }
    if (task.status === 'COMPLETED' || task.status === 'CANCELLED') {
      return { success: false, error: 'Completed or cancelled tasks can no longer be edited.' };
    }

    const parsed = parseTaskForm(formData);
    if ('error' in parsed) return { success: false, error: parsed.error };

    if (!(await isValidAssignee(
      task.interviewId,
      task.interview.employerId,
      task.interview.candidateId,
      parsed.assignedToId
    ))) {
      return { success: false, error: 'The selected user is not part of this interview.' };
    }

    await prisma.$transaction(async tx => {
      await tx.interviewTask.update({
        where: { id: task.id },
        data: parsed
      });

      await tx.interviewEvent.create({
        data: {
          interviewId: task.interviewId,
          actorId: user.id,
          type: 'UPDATED',
          metadata: { taskId: task.id, action: 'EDITED', title: parsed.title }
        }
      });
    });

    revalidatePath(`/dashboard/employer/interviews/${task.interviewId}`);
    revalidatePath('/dashboard/employer/interviews');
    return { success: true, taskId: task.id };
  } catch (error) {
    console.error('updateInterviewTask failed:', error);
    return { success: false, error: 'Unable to update the interview task.' };
  }
}

export async function manageInterviewTask(
  taskId: string,
  action: TaskAction
): Promise<TaskResult> {
  try {
    const user = await requireAuth();

    const task = await prisma.interviewTask.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        title: true,
        status: true,
        interviewId: true,
        assignedToId: true,
        interview: {
          select: { employerId: true, candidateId: true }
        }
      }
    });

    if (!task) return { success: false, error: 'Interview task not found.' };

    const canManage =
      task.interview.employerId === user.id || task.assignedToId === user.id;
    if (!canManage) {
      return { success: false, error: 'You are not authorized to manage this task.' };
    }

    if (action === 'START' && task.status !== 'TODO') {
      return { success: false, error: 'Only pending tasks can be started.' };
    }
    if (action === 'COMPLETE' && task.status !== 'IN_PROGRESS') {
      return { success: false, error: 'Only tasks currently in progress can be completed.' };
    }
    if (action === 'CANCEL' && ['COMPLETED', 'CANCELLED'].includes(task.status)) {
      return { success: false, error: 'This task can no longer be cancelled.' };
    }

    const now = new Date();
    const data =
      action === 'START'
        ? { status: 'IN_PROGRESS' as const, startedAt: now }
        : action === 'COMPLETE'
          ? { status: 'COMPLETED' as const, completedAt: now }
          : { status: 'CANCELLED' as const };

    await prisma.$transaction(async tx => {
      await tx.interviewTask.update({ where: { id: task.id }, data });
      await tx.interviewEvent.create({
        data: {
          interviewId: task.interviewId,
          actorId: user.id,
          type: action === 'COMPLETE' ? 'TASK_COMPLETED' : 'UPDATED',
          metadata: { taskId: task.id, action }
        }
      });
    });

    revalidatePath(`/dashboard/employer/interviews/${task.interviewId}`);
    revalidatePath('/dashboard/employer/interviews');
    return { success: true, taskId: task.id };
  } catch (error) {
    console.error('manageInterviewTask failed:', error);
    return { success: false, error: 'Unable to update the interview task.' };
  }
}
