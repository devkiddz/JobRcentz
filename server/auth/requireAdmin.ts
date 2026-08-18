import { redirect } from 'next/navigation';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export async function requireAdmin() {
  const sessionUser = await requireAuth('/adminlogin/login');

  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/adminlogin/login');
  }

  return user;
}