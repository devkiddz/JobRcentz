import { requireAdmin } from '@/server/auth/requireAdmin';
import { prisma } from '@/server/db/prisma';

export async function getEmployers() {
  await requireAdmin();

  const employers = await prisma.companyProfile.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      },
      _count: {
        select: {
          jobs: true
        }
      }
    }
  });

  return employers;
}

export type EmployersData = Awaited<ReturnType<typeof getEmployers>>;