
'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

type InterviewAction =
  | 'START'
  | 'COMPLETE'
  | 'CANCEL'
  | 'NO_SHOW'
  | 'RESTORE';

function getNotificationForAction(
  action: InterviewAction,
  interviewTitle: string
) {
  switch (action) {
    case 'START':
      return {
        title: 'Interview started',
        message: `Your interview "${interviewTitle}" has been started.`,
        priority: 'HIGH' as const
      };

    case 'COMPLETE':
      return {
        title: 'Interview completed',
        message: `Your interview "${interviewTitle}" has been marked as completed.`,
        priority: 'NORMAL' as const
      };

    case 'CANCEL':
      return {
        title: 'Interview cancelled',
        message: `Your interview "${interviewTitle}" has been cancelled.`,
        priority: 'HIGH' as const
      };

    case 'NO_SHOW':
      return {
        title: 'Interview marked as no-show',
        message: `Your interview "${interviewTitle}" has been marked as a no-show.`,
        priority: 'HIGH' as const
      };

    case 'RESTORE':
      return {
        title: 'Interview restored',
        message: `Your interview "${interviewTitle}" has been restored and is scheduled again.`,
        priority: 'HIGH' as const
      };
  }
}

export async function manageInterview(
  interviewId: string,
  action: InterviewAction,
  formData?: FormData
) {
  const reason = formData?.get('reason');

  const cancellationReason =
    typeof reason === 'string' && reason.trim()
      ? reason.trim()
      : undefined;

  const user = await requireAuth();

  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId
    },
    select: {
      id: true,
      title: true,
      status: true,
      employerId: true,
      candidateId: true,
      scheduledAt: true,
      cancellationReason: true,
      job: {
        select: {
          title: true
        }
      }
    }
  });

  if (!interview) {
    return {
      success: false,
      error: 'Interview not found.'
    };
  }

  if (interview.employerId !== user.id) {
    return {
      success: false,
      error: 'You are not authorized to manage this interview.'
    };
  }

  const now = new Date();
  const scheduledAt = new Date(interview.scheduledAt);

  if (action === 'START') {
    if (
      interview.status !== 'SCHEDULED' &&
      interview.status !== 'RESCHEDULED'
    ) {
      return {
        success: false,
        error: 'Only scheduled interviews can be started.'
      };
    }

    if (scheduledAt.getTime() > now.getTime()) {
      return {
        success: false,
        error:
          'This interview cannot be started before its scheduled time.'
      };
    }
  }

  if (
    action === 'COMPLETE' &&
    interview.status !== 'IN_PROGRESS'
  ) {
    return {
      success: false,
      error:
        'Only interviews currently in progress can be completed.'
    };
  }

  if (action === 'CANCEL') {
    if (
      ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(
        interview.status
      )
    ) {
      return {
        success: false,
        error: 'This interview can no longer be cancelled.'
      };
    }

    if (!cancellationReason) {
      return {
        success: false,
        error: 'A cancellation reason is required.'
      };
    }
  }

  if (action === 'NO_SHOW') {
    if (
      ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(
        interview.status
      )
    ) {
      return {
        success: false,
        error:
          'This interview cannot be marked as a no-show.'
      };
    }

    if (scheduledAt.getTime() > now.getTime()) {
      return {
        success: false,
        error:
          'An interview cannot be marked as a no-show before its scheduled time.'
      };
    }
  }

  if (action === 'RESTORE') {
    if (interview.status !== 'CANCELLED') {
      return {
        success: false,
        error:
          'Only cancelled interviews can be restored.'
      };
    }
  }

  const updateData =
    action === 'START'
      ? {
          status: 'IN_PROGRESS' as const,
          startedAt: now
        }
      : action === 'COMPLETE'
        ? {
            status: 'COMPLETED' as const,
            endedAt: now
          }
        : action === 'CANCEL'
          ? {
              status: 'CANCELLED' as const,
              cancelledAt: now,
              cancellationReason:
                cancellationReason ?? null
            }
          : action === 'RESTORE'
            ? {
                status: 'SCHEDULED' as const,
                cancelledAt: null,
                cancellationReason: null
              }
            : {
                status: 'NO_SHOW' as const,
                endedAt: now
              };

  const eventType =
    action === 'START'
      ? 'STARTED'
      : action === 'COMPLETE'
        ? 'COMPLETED'
        : action === 'CANCEL'
          ? 'CANCELLED'
          : action === 'NO_SHOW'
            ? 'NO_SHOW'
            : 'RESTORED';

  const notification = getNotificationForAction(
    action,
    interview.title || interview.job.title
  );

  try {
    await prisma.$transaction([
      prisma.interview.update({
        where: {
          id: interview.id
        },
        data: updateData
      }),

      prisma.interviewEvent.create({
        data: {
          interviewId: interview.id,
          actorId: user.id,
          type: eventType
        }
      }),

      prisma.notification.create({
        data: {
          userId: interview.candidateId,
          type: 'INTERVIEW',
          priority: notification.priority,
          title: notification.title,
          message: notification.message,
          href: `/dashboard/interviews/${interview.id}`
        }
      })
    ]);

    revalidatePath('/dashboard/employer/interviews');

    revalidatePath(
      `/dashboard/employer/interviews/${interview.id}`
    );

    revalidatePath(
      `/dashboard/employer/applications/${interview.id}`
    );

    revalidatePath('/dashboard/interviews');

    revalidatePath(
      `/dashboard/interviews/${interview.id}`
    );

    return {
      success: true
    };
  } catch (error) {
    console.error('Failed to manage interview:', error);

    return {
      success: false,
      error:
        'Unable to update the interview. Please try again.'
    };
  }
}