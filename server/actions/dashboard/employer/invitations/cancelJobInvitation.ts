'use server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import { createNotification } from '@/server/actions/dashboard/notifications/createNotification';

export async function cancelJobInvitation(invitationId: string) {
  try {
    const user = await requireAuth();
    const employer = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true, company: { select: { id: true } } } });
    if (!employer || employer.role !== 'EMPLOYER' || !employer.company) return { success: false, error: 'Employer account required.' };
    const invitation = await prisma.jobInvitation.findFirst({ where: { id: invitationId, job: { companyId: employer.company.id } }, select: { id: true, status: true, recipientId: true, job: { select: { title: true } } } });
    if (!invitation) return { success: false, error: 'Invitation not found.' };
    if (invitation.status !== 'PENDING') return { success: false, error: 'Only pending invitations can be cancelled.' };
    await prisma.jobInvitation.update({ where: { id: invitation.id }, data: { status: 'CANCELLED' } });
    await createNotification({ userId: invitation.recipientId, type: 'JOB_INVITATION', priority: 'NORMAL', title: 'Invitation cancelled', message: `The invitation for ${invitation.job.title} is no longer active.`, href: '/dashboard/invitations' });
    revalidatePath('/dashboard/employer/invitations'); revalidatePath('/dashboard/invitations'); revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (error) { console.error('cancelJobInvitation failed:', error); return { success: false, error: 'Something went wrong while cancelling the invitation.' }; }
}
