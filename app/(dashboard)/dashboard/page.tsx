import { redirect } from 'next/navigation';

import { getOnboardingState } from '@/server/actions/getOnboardingState';

export default async function DashboardPage() {
  const state = await getOnboardingState();

  switch (state.user.role) {
    case 'JOB_SEEKER':
      redirect('/dashboard/jobseeker');

    case 'EMPLOYER':
      redirect('/dashboard/employer');

    case 'ADMIN':
      redirect('/dashboard/admin');

    case 'UNASSIGNED':
    default:
      redirect('/onboarding');
  }
}
