'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function createPortfolioProject(_previousState: unknown, formData: FormData) {
  const user = await requireAuth();
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();

  if (!title || !description) {
    return { error: 'A title and description are required.' };
  }

  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!profile) return { error: 'Complete your job-seeker profile before adding a portfolio project.' };

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${crypto.randomUUID().slice(0, 8)}`;
  await prisma.portfolioProject.create({
    data: {
      profileId: profile.id,
      title,
      description,
      category: String(formData.get('category') ?? '').trim() || null,
      projectUrl: String(formData.get('projectUrl') ?? '').trim() || null,
      githubUrl: String(formData.get('githubUrl') ?? '').trim() || null,
      skills: String(formData.get('skills') ?? '').split(',').map(value => value.trim()).filter(Boolean),
      slug,
      status: 'PUBLISHED',
      publishedAt: new Date()
    }
  });

  revalidatePath('/dashboard/portfolio');
  return { success: true };
}
