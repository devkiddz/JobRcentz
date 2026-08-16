import OnboardingForm from '@/components/website/onboarding/OnboardingForm';
import { requireAuth } from '@/server/auth/requireAuth';

export default async function OnboardingPage() {
  await requireAuth();

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center space-y-4 p-4 md:p-10">
      <OnboardingForm />
    </div>
  );
}
