'use server';
import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getMyInvitations() {
  const user = await requireAuth();
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
  if (!dbUser || dbUser.role !== 'JOB_SEEKER') return [];
  await prisma.jobInvitation.updateMany({ where: { recipientId: user.id, status: 'PENDING', expiresAt: { lt: new Date() } }, data: { status: 'EXPIRED' } });
  return prisma.jobInvitation.findMany({ where: { recipientId: user.id }, orderBy: { createdAt: 'desc' }, select: { id: true, message: true, status: true, expiresAt: true, createdAt: true, job: { select: { id: true, title: true, location: true, workMode: true, employmentType: true, company: { select: { companyName: true, companyLogoUrl: true } } } }, sender: { select: { id: true, name: true } } } });
}
