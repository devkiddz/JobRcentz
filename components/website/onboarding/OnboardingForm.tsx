'use client';

import React, { useState } from 'react';

import LogoContainer from '../LogoContainer';
import OnboardingMessage from './OnboardingMessage';
import CompanyForm from './CompanyForm';
import JobSeekerForm from './JobSeekerForm';

import type { JobSeekerProfileData } from '@/server/actions/onboarding/jobseeker/getJobSeekerProfile';
import type { CompanyProfileData } from '@/server/actions/onboarding/companies/getCompanyProfile';

type UserSelectionType = 'company' | 'jobseeker' | null;

interface OnboardingFormProps {
  initialJobSeekerProfile: JobSeekerProfileData;
  initialCompanyProfile: CompanyProfileData;
}

export default function OnboardingForm({
  initialJobSeekerProfile,
  initialCompanyProfile
}: OnboardingFormProps) {
  const [step, setStep] = useState(1);

  const [userType, setUserType] = useState<UserSelectionType>(null);

  const [logoSpin, setLogoSpin] = useState(0);

  function handleUserTypeSelection(type: UserSelectionType) {
    setLogoSpin(prev => prev + 1);
    setUserType(type);
    setStep(2);
  }

  function handleBack() {
    setLogoSpin(prev => prev + 1);
    setUserType(null);
    setStep(1);
  }

  function renderStepContent() {
    switch (step) {
      case 1:
        return <OnboardingMessage onSelect={handleUserTypeSelection} />;

      case 2:
        if (userType === 'company') {
          return <CompanyForm onBack={handleBack} initialProfile={initialCompanyProfile} />;
        }

        if (userType === 'jobseeker') {
          return <JobSeekerForm onBack={handleBack} initialProfile={initialJobSeekerProfile} />;
        }

        return null;

      default:
        return null;
    }
  }

  return (
    <div className="flex max-w-7xl flex-col items-center justify-center space-y-4 p-4 sm:p-6 md:p-10">
      <div className="flex flex-col items-center pb-2 text-center">
        <LogoContainer className="scale-80" href="/" spin={logoSpin} />

        <p className="text-sm text-primary">Welcome to Job Rcentz</p>
      </div>

      <div className="flex w-full items-center justify-center">{renderStepContent()}</div>
    </div>
  );
}
