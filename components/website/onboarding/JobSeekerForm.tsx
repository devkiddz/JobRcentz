import { Button } from '@/components/ui/button';
import React from 'react';
import BackButton from '../BackButton';

interface CompanyFormProps {
  onBack: () => void;
}

export default function JobSeekerForm({ onBack }: CompanyFormProps) {
  return (
    <div className=" flex items-center justify-center gap-4">
      <BackButton onBack={onBack} className="sm:h-11 sm:w-11" />
      JobSeekerForm
    </div>
  );
}
