import { redirect } from 'next/navigation';

import { getOnboardingState } from '@/server/actions/getOnboardingState';
import { getJobSeekerProfile } from '@/server/actions/onboarding/jobseeker/getJobSeekerProfile';
import { getCompanyProfile } from '@/server/actions/onboarding/companies/getCompanyProfile';
import { getAccountDestination } from '@/server/auth/getAccountDestination';
import OnboardingForm from '@/components/website/onboarding/OnboardingForm';

export default async function OnboardingPage() {
  const state = await getOnboardingState();

  /*
   * A boarded account cannot return to onboarding.
   */
  if (state.user.role !== 'UNASSIGNED') {
    redirect(getAccountDestination(state.user.role));
  }

  /*
   * These return the FULL objects expected
   * by OnboardingForm and its child forms.
   */
  const [initialJobSeekerProfile, initialCompanyProfile] = await Promise.all([
    getJobSeekerProfile(),
    getCompanyProfile()
  ]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <OnboardingForm
        initialJobSeekerProfile={initialJobSeekerProfile}
        initialCompanyProfile={initialCompanyProfile}
      />
    </main>
  );
}
