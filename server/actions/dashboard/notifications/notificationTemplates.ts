import { NotificationPriority, NotificationType } from '@/lib/generated/prisma/browser';
import { createNotification } from './createNotification';

export async function notifyApplicationStatusChanged(input: { userId: string; applicationId: string; jobTitle: string; status: string }) {
  const copy: Record<string, { title: string; message: string; priority: NotificationPriority }> = {
    REVIEWING: { title: 'Application under review', message: `Your application for ${input.jobTitle} is now under review.`, priority: NotificationPriority.NORMAL },
    SHORTLISTED: { title: 'You have been shortlisted', message: `Great news — you have been shortlisted for ${input.jobTitle}.`, priority: NotificationPriority.HIGH },
    INTERVIEW: { title: 'Interview stage reached', message: `Your application for ${input.jobTitle} has moved to the interview stage.`, priority: NotificationPriority.HIGH },
    REJECTED: { title: 'Application update', message: `Your application for ${input.jobTitle} was not selected for the next stage.`, priority: NotificationPriority.NORMAL },
    HIRED: { title: 'Congratulations!', message: `Your application for ${input.jobTitle} has been marked as hired.`, priority: NotificationPriority.URGENT },
    PENDING: { title: 'Application received', message: `Your application for ${input.jobTitle} is pending review.`, priority: NotificationPriority.NORMAL }
  };
  const selected = copy[input.status] ?? { title: 'Application update', message: `Your application for ${input.jobTitle} has been updated.`, priority: NotificationPriority.NORMAL };
  return createNotification({ userId: input.userId, type: NotificationType.APPLICATION_STATUS, priority: selected.priority, title: selected.title, message: selected.message, href: `/dashboard/applications/${input.applicationId}` });
}

export async function notifyNewApplication(input: { userId: string; applicationId: string; jobId: string; jobTitle: string; candidateName: string }) {
  return createNotification({ userId: input.userId, type: NotificationType.APPLICATION, priority: NotificationPriority.NORMAL, title: 'New job application', message: `${input.candidateName} applied for ${input.jobTitle}.`, href: `/dashboard/employer/applications/${input.applicationId}` });
}

export async function notifyInterviewScheduled(input: { userId: string; interviewId: string; jobTitle: string; scheduledAt: Date }) {
  const date = input.scheduledAt.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
  return createNotification({ userId: input.userId, type: NotificationType.INTERVIEW, priority: NotificationPriority.HIGH, title: 'Interview scheduled', message: `An interview for ${input.jobTitle} has been scheduled for ${date}.`, href: `/dashboard/interviews/${input.interviewId}` });
}

export async function notifyJobInvitationReceived(input: { userId: string; invitationId: string; companyName: string; jobTitle: string }) {
  return createNotification({ userId: input.userId, type: NotificationType.JOB_INVITATION, priority: NotificationPriority.HIGH, title: 'New job invitation', message: `${input.companyName} invited you to apply for ${input.jobTitle}.`, href: `/dashboard/invitations?id=${input.invitationId}` });
}
