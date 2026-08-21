import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';

import { getEmployerApplicationById } from '@/server/actions/dashboard/employer/applications/getEmployerApplicationById';
import InterviewCreateForm from './InterviewCreateForm';
import CandidateDetails, { CandidateDetailsMobileTrigger } from './CandidateDetails';

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

  const location = application.job.location ?? 'Location not specified';

  return (
    <main className="min-h-full bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Back */}
        <Link
          href={`/dashboard/employer/applications/${application.id}`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:mb-8">
          <ArrowLeft className="size-4" />
          Back to Application
        </Link>

        {/* Mobile candidate sheet */}
        <div className="mb-5 lg:hidden">
          <CandidateDetailsMobileTrigger
            candidateName={candidateName}
            profileImage={profileImage}
            jobTitle={application.job.title}
            location={location}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
          {/* Main content */}
          <section className="min-w-0">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <FileText className="size-3.5" />
                Interview scheduling
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Schedule Interview</h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Set up the next step with <span className="font-medium text-foreground">{candidateName}</span>{' '}
                for the <span className="font-medium text-foreground">{application.job.title}</span> position.
              </p>
            </div>

            <InterviewCreateForm applicationId={application.id} />
          </section>

          {/* Desktop candidate sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <CandidateDetails
                candidateName={candidateName}
                profileImage={profileImage}
                jobTitle={application.job.title}
                location={location}
                applicationId={application.id}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
