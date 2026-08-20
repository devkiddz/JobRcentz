'use server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import { createNotification } from '@/server/actions/dashboard/notifications/createNotification';

type Response = 'ACCEPTED' | 'DECLINED';
export async function respondToJobInvitation(invitationId: string, response: Response) {
  try {
    const user = await requireAuth();
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
    if (!dbUser || dbUser.role !== 'JOB_SEEKER') return { success: false, error: 'Job seeker account required.' };
    const invitation = await prisma.jobInvitation.findFirst({ where: { id: invitationId, recipientId: user.id }, select: { id: true, status: true, expiresAt: true, senderId: true, jobId: true, job: { select: { title: true, status: true, approvalStatus: true } } } });
    if (!invitation) return { success: false, error: 'Invitation not found.' };
    if (invitation.status !== 'PENDING') return { success: false, error: 'This invitation is no longer pending.' };
    if (invitation.expiresAt && invitation.expiresAt < new Date()) { await prisma.jobInvitation.update({ where: { id: invitation.id }, data: { status: 'EXPIRED' } }); return { success: false, error: 'This invitation has expired.' }; }
    if (response === 'DECLINED') {
      await prisma.jobInvitation.update({ where: { id: invitation.id }, data: { status: 'DECLINED' } });
      await prisma.notification.updateMany({
        where: { userId: user.id, type: 'JOB_INVITATION', href: `/dashboard/invitations?id=${invitation.id}`, isRead: false },
        data: { isRead: true, readAt: new Date() }
      });
      await createNotification({ userId: invitation.senderId, type: 'JOB_INVITATION', priority: 'NORMAL', title: 'Invitation declined', message: `The invitation for ${invitation.job.title} was declined.`, href: '/dashboard/employer/invitations' });
      revalidatePath('/dashboard/invitations'); revalidatePath('/dashboard/employer/invitations'); return { success: true };
    }
    if (invitation.job.status !== 'PUBLISHED' || invitation.job.approvalStatus !== 'APPROVED') return { success: false, error: 'This job is no longer accepting applications.' };
    const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (!profile) return { success: false, error: 'Complete your job seeker profile before accepting invitations.' };
    const application = await prisma.$transaction(async tx => {
      const existing = await tx.application.findUnique({ where: { jobId_applicantId: { jobId: invitation.jobId, applicantId: user.id } }, select: { id: true } });
      const application = existing ?? await tx.application.create({ data: { jobId: invitation.jobId, applicantId: user.id, jobSeekerProfileId: profile.id, status: 'PENDING' }, select: { id: true } });
      await tx.jobInvitation.update({ where: { id: invitation.id }, data: { status: 'ACCEPTED' } });
      await tx.notification.updateMany({
        where: { userId: user.id, type: 'JOB_INVITATION', href: `/dashboard/invitations?id=${invitation.id}`, isRead: false },
        data: { isRead: true, readAt: new Date() }
      });
      return application;
    });
    await createNotification({ userId: invitation.senderId, type: 'JOB_INVITATION', priority: 'HIGH', title: 'Invitation accepted', message: `The candidate accepted your invitation for ${invitation.job.title}.`, href: `/dashboard/employer/applications/${application.id}` });
    revalidatePath('/dashboard/invitations'); revalidatePath('/dashboard/employer/invitations'); revalidatePath('/dashboard/applications'); revalidatePath(`/dashboard/employer/applications/${application.id}`);
    return { success: true, applicationId: application.id };
  } catch (error) { console.error('respondToJobInvitation failed:', error); return { success: false, error: 'Something went wrong while responding to the invitation.' }; }
}
