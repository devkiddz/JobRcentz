import { requireAdmin } from '@/server/auth/requireAdmin';
import { prisma } from '@/server/db/prisma';

export async function getEmployerById(companyId: string) {
  await requireAdmin();

  return prisma.companyProfile.findUnique({
    where: {
      id: companyId
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
      jobs: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

export type EmployerDetailsData = Awaited<
  ReturnType<typeof getEmployerById>
>;