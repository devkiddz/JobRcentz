'use server';
import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function getEmployerInvitations() {
  const user = await requireAuth();
  const employer = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true, company: { select: { id: true } } } });
  if (!employer || employer.role !== 'EMPLOYER' || !employer.company) return [];
  return prisma.jobInvitation.findMany({
    where: { job: { companyId: employer.company.id } }, orderBy: { createdAt: 'desc' },
    select: { id: true, message: true, status: true, expiresAt: true, createdAt: true, job: { select: { id: true, title: true, location: true, workMode: true, employmentType: true } }, recipient: { select: { id: true, name: true, image: true, jobSeeker: { select: { headline: true, currentRole: true, location: true, profilePhotoUrl: true } } } } }
  });
}
