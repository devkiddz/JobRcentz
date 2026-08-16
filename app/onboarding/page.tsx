import OnboardingForm from '@/components/website/onboarding/OnboardingForm';
import { getCompanyProfile } from '@/server/actions/companies/getCompanyProfile';
import { getJobSeekerProfile } from '@/server/actions/onboarding/getJobSeekerProfile';

export default async function OnboardingPage() {
  const [jobSeekerData, companyData] = await Promise.all([getJobSeekerProfile(), getCompanyProfile()]);

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center space-y-4 p-4 md:p-10">
      <OnboardingForm initialJobSeekerProfile={jobSeekerData} initialCompanyProfile={companyData} />
    </div>
  );
}
