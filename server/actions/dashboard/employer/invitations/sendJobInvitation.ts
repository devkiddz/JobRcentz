'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import { notifyJobInvitationReceived } from '@/server/actions/dashboard/notifications/notificationTemplates';

type Result = { success: true; invitationId: string } | { success: false; error: string };

export async function sendJobInvitation(input: { jobId: string; candidateId: string; message?: string }): Promise<Result> {
  try {
    const user = await requireAuth();
    const employer = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true, company: { select: { id: true, companyName: true } } } });
    if (!employer || employer.role !== 'EMPLOYER' || !employer.company) return { success: false, error: 'Employer account required.' };

    const [job, candidate] = await Promise.all([
      prisma.job.findFirst({ where: { id: input.jobId, companyId: employer.company.id, status: 'PUBLISHED', approvalStatus: 'APPROVED' }, select: { id: true, title: true } }),
      prisma.user.findFirst({ where: { id: input.candidateId, role: 'JOB_SEEKER' }, select: { id: true, jobSeeker: { select: { isAvailable: true, isDiscoverable: true, visibility: true } } } })
    ]);
    if (!job) return { success: false, error: 'That job is not available for invitations.' };
    if (!candidate?.jobSeeker) return { success: false, error: 'Job seeker profile not found.' };
    if (!candidate.jobSeeker.isAvailable || !candidate.jobSeeker.isDiscoverable || candidate.jobSeeker.visibility === 'PRIVATE') return { success: false, error: 'This job seeker is not currently available for invitations.' };

    const existingApplication = await prisma.application.findUnique({ where: { jobId_applicantId: { jobId: job.id, applicantId: candidate.id } }, select: { id: true } });
    if (existingApplication) return { success: false, error: 'This candidate has already applied for this job.' };

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    const existing = await prisma.jobInvitation.findUnique({ where: { jobId_recipientId: { jobId: job.id, recipientId: candidate.id } }, select: { id: true } });
    const invitation = existing
      ? await prisma.jobInvitation.update({ where: { id: existing.id }, data: { senderId: user.id, message: input.message?.trim() || null, status: 'PENDING', expiresAt }, select: { id: true } })
      : await prisma.jobInvitation.create({ data: { jobId: job.id, senderId: user.id, recipientId: candidate.id, message: input.message?.trim() || null, status: 'PENDING', expiresAt }, select: { id: true } });

    await notifyJobInvitationReceived({ userId: candidate.id, invitationId: invitation.id, companyName: employer.company.companyName, jobTitle: job.title });
    revalidatePath(`/dashboard/employer/candidates/${candidate.id}`);
    revalidatePath('/dashboard/employer/invitations');
    revalidatePath('/dashboard/invitations');
    revalidatePath('/dashboard/notifications');
    return { success: true, invitationId: invitation.id };
  } catch (error) {
    console.error('sendJobInvitation failed:', error);
    return { success: false, error: 'Something went wrong while sending the invitation.' };
  }
}
