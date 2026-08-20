'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type TaskAction =
  | 'START'
  | 'COMPLETE'
  | 'CANCEL';

type TaskResult =
  | {
      success: true;
      taskId: string;
    }
  | {
      success: false;
      error: string;
    };

function getTaskNotification(action: TaskAction, taskTitle: string) {
  switch (action) {
    case 'START':
      return {
        title: 'Interview task started',
        message: `The interview task "${taskTitle}" has been started.`,
        priority: 'NORMAL' as const
      };

    case 'COMPLETE':
      return {
        title: 'Interview task completed',
        message: `The interview task "${taskTitle}" has been completed.`,
        priority: 'NORMAL' as const
      };

    case 'CANCEL':
      return {
        title: 'Interview task cancelled',
        message: `The interview task "${taskTitle}" has been cancelled.`,
        priority: 'HIGH' as const
      };
  }
}

async function getEmployerInterview(interviewId: string, userId: string) {
  return prisma.interview.findFirst({
    where: {
      id: interviewId,
      employerId: userId
    },
    select: {
      id: true,
      jobId: true,
      employerId: true,
      candidateId: true,
      title: true
    }
  });
}

export async function createInterviewTask(
  interviewId: string,
  formData: FormData
): Promise<TaskResult> {
  try {
    const user = await requireAuth();

    const interview = await getEmployerInterview(interviewId, user.id);

    if (!interview) {
      return {
        success: false,
        error: 'Interview not found.'
      };
    }

    const title = formData.get('title');
    const description = formData.get('description');
    const priority = formData.get('priority');
    const assignedToId = formData.get('assignedToId');
    const dueAt = formData.get('dueAt');

    if (typeof title !== 'string' || !title.trim()) {
      return {
        success: false,
        error: 'Task title is required.'
      };
    }

    const cleanTitle = title.trim();

    const cleanDescription =
      typeof description === 'string' && description.trim()
        ? description.trim()
        : null;

    const cleanPriority =
      priority === 'LOW' ||
      priority === 'MEDIUM' ||
      priority === 'HIGH' ||
      priority === 'URGENT'
        ? priority
        : 'MEDIUM';

    let parsedDueAt: Date | null = null;

    if (typeof dueAt === 'string' && dueAt.trim()) {
      const date = new Date(dueAt);

      if (Number.isNaN(date.getTime())) {
        return {
          success: false,
          error: 'Please provide a valid task due date.'
        };
      }

      parsedDueAt = date;
    }

    let cleanAssignedToId: string | null = null;

    if (typeof assignedToId === 'string' && assignedToId.trim()) {
      const participant = await prisma.interviewParticipant.findFirst({
        where: {
          interviewId,
          userId: assignedToId
        },
        select: {
          userId: true
        }
      });

      const isEmployer = assignedToId === interview.employerId;
      const isCandidate = assignedToId === interview.candidateId;

      if (!participant && !isEmployer && !isCandidate) {
        return {
          success: false,
          error: 'The selected user is not part of this interview.'
        };
      }

      cleanAssignedToId = assignedToId;
    }

    const task = await prisma.interviewTask.create({
      data: {
        interviewId,
        assignedToId: cleanAssignedToId,
        title: cleanTitle,
        description: cleanDescription,
        priority: cleanPriority,
        dueAt: parsedDueAt
      },
      select: {
        id: true,
        title: true,
        assignedToId: true
      }
    });

    await prisma.interviewEvent.create({
      data: {
        interviewId,
        actorId: user.id,
        type: 'TASK_CREATED',
        metadata: {
          taskId: task.id,
          title: task.title
        }
      }
    });

    if (task.assignedToId && task.assignedToId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: task.assignedToId,
          type: 'INTERVIEW',
          priority: cleanPriority === 'URGENT'
            ? 'URGENT'
            : cleanPriority === 'HIGH'
              ? 'HIGH'
              : 'NORMAL',
          title: 'New interview task',
          message: `You have been assigned the interview task "${task.title}".`,
          href: `/dashboard/interviews/${interview.id}`
        }
      });
    }

    revalidatePath(`/dashboard/employer/interviews/${interviewId}`);
    revalidatePath('/dashboard/employer/interviews');

    return {
      success: true,
      taskId: task.id
    };
  } catch (error) {
    console.error('createInterviewTask failed:', error);

    return {
      success: false,
      error: 'Unable to create the interview task.'
    };
  }
}

export async function manageInterviewTask(
  taskId: string,
  action: TaskAction
): Promise<TaskResult> {
  try {
    const user = await requireAuth();

    const task = await prisma.interviewTask.findUnique({
      where: {
        id: taskId
      },
      select: {
        id: true,
        title: true,
        status: true,
        interviewId: true,
        assignedToId: true,
        interview: {
          select: {
            id: true,
            employerId: true,
            candidateId: true,
            title: true
          }
        }
      }
    });

    if (!task) {
      return {
        success: false,
        error: 'Interview task not found.'
      };
    }

    const isEmployer = task.interview.employerId === user.id;
    const isAssignee = task.assignedToId === user.id;

    if (!isEmployer && !isAssignee) {
      return {
        success: false,
        error: 'You are not authorized to manage this task.'
      };
    }

    if (action === 'START' && task.status !== 'TODO') {
      return {
        success: false,
        error: 'Only pending tasks can be started.'
      };
    }

    if (action === 'COMPLETE' && task.status !== 'IN_PROGRESS') {
      return {
        success: false,
        error: 'Only tasks currently in progress can be completed.'
      };
    }

    if (
      action === 'CANCEL' &&
      ['COMPLETED', 'CANCELLED'].includes(task.status)
    ) {
      return {
        success: false,
        error: 'This task can no longer be cancelled.'
      };
    }

    const now = new Date();

    const updateData =
      action === 'START'
        ? {
            status: 'IN_PROGRESS' as const,
            startedAt: now
          }
        : action === 'COMPLETE'
          ? {
              status: 'COMPLETED' as const,
              completedAt: now
            }
          : {
              status: 'CANCELLED' as const
            };

    await prisma.$transaction([
      prisma.interviewTask.update({
        where: {
          id: task.id
        },
        data: updateData
      }),

      prisma.interviewEvent.create({
        data: {
          interviewId: task.interviewId,
          actorId: user.id,
          type: action === 'COMPLETE' ? 'TASK_COMPLETED' : 'UPDATED',
          metadata: {
            taskId: task.id,
            action
          }
        }
      })
    ]);

    const notification = getTaskNotification(action, task.title);

    const recipientId =
      task.assignedToId && task.assignedToId !== user.id
        ? task.assignedToId
        : task.interview.candidateId !== user.id
          ? task.interview.candidateId
          : task.interview.employerId !== user.id
            ? task.interview.employerId
            : null;

    if (recipientId) {
      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'INTERVIEW',
          priority: notification.priority,
          title: notification.title,
          message: notification.message,
          href: `/dashboard/interviews/${task.interviewId}`
        }
      });
    }

    revalidatePath(`/dashboard/employer/interviews/${task.interviewId}`);
    revalidatePath('/dashboard/employer/interviews');

    return {
      success: true,
      taskId: task.id
    };
  } catch (error) {
    console.error('manageInterviewTask failed:', error);

    return {
      success: false,
      error: 'Unable to update the interview task.'
    };
  }
}