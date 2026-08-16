import { Button } from '@/components/ui/button';
import React from 'react';

interface CompanyFormProps {
  onBack: () => void;
}

export default function JobSeekerForm({ onBack }: CompanyFormProps) {
  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="mb-4 cursor-pointer hover:text-primary transition-all">
        ← Back
      </Button>
      JobSeekerForm
    </div>
  );
}
