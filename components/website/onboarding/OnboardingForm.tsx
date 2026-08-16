'use client';

import React, { useState } from 'react';
import LogoContainer from '../LogoContainer';
import OnboardingMessage from './OnboardingMessage';
import CompanyForm from './CompanyForm';
import JobSeekerForm from './JobSeekerForm';

type UserSelectionType = 'company' | 'jobseeker' | null;

export default function OnboardingForm() {
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
        return userType === 'company' ? (
          <CompanyForm onBack={handleBack} />
        ) : (
          <JobSeekerForm onBack={handleBack} />
        );

      default:
        return null;
    }
  }

  return (
    <div className="flex w-full max-w-7xl flex-col items-center justify-center space-y-4 rounded-lg border border-border/50 p-4 backdrop-blur-3xl sm:p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col items-center pb-2 text-center">
        <LogoContainer className="scale-80" href="/" spin={logoSpin} />

        <p className="text-sm text-primary">Welcome to Job Rcentz</p>
      </div>

      {/* Content */}
      <div className="flex w-full items-center justify-center">{renderStepContent()}</div>
    </div>
  );
}
