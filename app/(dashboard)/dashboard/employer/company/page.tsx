import { notFound } from 'next/navigation';

import { EmployerCompanyEditor } from '@/components/dashboard/employer/EmployerCompanyEditor';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';

export default async function EmployerCompanyPage() {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },

    select: {
      id: true,
      role: true,

      company: {
        select: {
          id: true,

          companyName: true,
          companyWebsite: true,
          companySize: true,
          companyIndustry: true,
          companyDescription: true,
          companyLocation: true,
          companyAddress: true,

          companyContactEmail: true,
          companyContactPhone: true,

          companyLinkedIn: true,
          companyX: true,
          companyFacebook: true,

          companyLogoUrl: true,
          companyLogoPublicId: true,

          bannerUrl: true,
          bannerPublicId: true,

          onboardingStatus: true,
          visibility: true,
          isDiscoverable: true,
          profileViews: true
        }
      }
    }
  });

  if (!dbUser) {
    notFound();
  }

  if (dbUser.role !== 'EMPLOYER') {
    notFound();
  }

  if (!dbUser.company) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl md:px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Company</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your company&lsquo;s information and visibility.
        </p>
      </div>

      <EmployerCompanyEditor company={dbUser.company} />
    </main>
  );
}
