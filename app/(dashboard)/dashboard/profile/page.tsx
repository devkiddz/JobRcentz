import { redirect } from 'next/navigation';

import { getJobSeekerProfile } from '@/server/actions/onboarding/jobseeker/getJobSeekerProfile';
import { getOnboardingState } from '@/server/actions/getOnboardingState';

import JobSeekerProfileForm from '@/components/website/profile/JobSeekerProfileForm';

export default async function JobSeekerProfilePage() {
  const state = await getOnboardingState();

  if (state.user.role !== 'JOB_SEEKER') {
    redirect('/dashboard');
  }

  if (!state.jobSeeker) {
    redirect('/onboarding');
  }

  const profileData = await getJobSeekerProfile();

  if (!profileData.profile) {
    redirect('/onboarding');
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-sm text-muted-foreground">Account</p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Professional Profile</h1>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Keep your professional identity up to date so employers can discover and understand your experience.
        </p>
      </div>

      <JobSeekerProfileForm user={profileData.user} profile={profileData.profile} />
    </main>
  );
}
