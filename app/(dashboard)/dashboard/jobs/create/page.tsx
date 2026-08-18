import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';

import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import { CreateJobForm } from '@/components/dashboard/employer/CreateJobForm';

export default async function CreateJobPage() {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      role: true,
      company: {
        select: {
          companyName: true,
          onboardingStatus: true
        }
      }
    }
  });

  if (!dbUser || dbUser.role !== 'EMPLOYER' || !dbUser.company) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Jobs
        </Link>

        <div className="mt-6 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <BriefcaseBusiness className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-sm font-medium text-primary">{dbUser.company.companyName}</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Create a Job</h1>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Create a professional job listing for candidates on JobMan.
            </p>
          </div>
        </div>
      </div>

      {dbUser.company.onboardingStatus !== 'APPROVED' ? (
        <section className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">Company approval required</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Your company profile must be approved before you can publish job listings.
          </p>
        </section>
      ) : (
        <CreateJobForm />
      )}
    </main>
  );
}
