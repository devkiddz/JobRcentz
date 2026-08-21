import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, MapPin, UserRound, Video } from 'lucide-react';

import { getEmployerApplicationById } from '@/server/actions/dashboard/employer/applications/getEmployerApplicationById';
import InterviewCreateForm from './InterviewCreateForm';

export default async function CreateInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let application;

  try {
    application = await getEmployerApplicationById(id);
  } catch {
    notFound();
  }

  if (!application) {
    notFound();
  }

  const candidateName = application.applicant.name?.trim() || 'Candidate';

  const profileImage = application.jobSeekerProfile.profilePhotoUrl ?? application.applicant.image;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      <Link
        href={`/dashboard/employer/applications/${application.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Application
      </Link>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {profileImage ? (
                <img src={profileImage} alt={candidateName} className="size-full object-cover" />
              ) : (
                <UserRound className="size-6 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Interview scheduling
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Schedule Interview</h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Schedule an interview with {candidateName}.
              </p>
            </div>
          </div>

          <div className="grid gap-3 border-t pt-5 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound className="size-4 text-primary" />
              <span className="truncate">{candidateName}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BriefcaseBusiness className="size-4 text-primary" />
              <span className="truncate">{application.job.title}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              <span className="truncate">{application.job.location ?? 'Location not specified'}</span>
            </div>
          </div>
        </div>
      </section>

      <InterviewCreateForm
        applicationId={application.id}
        candidateName={candidateName}
        jobTitle={application.job.title}
      />
    </main>
  );
}
