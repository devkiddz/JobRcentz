import React from 'react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onBack: () => void;
  className?: string;
}

export default function BackButton({ onBack, className }: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onBack}
      aria-label="Go back"
      className={`
        group
        h-12
        w-12
        shrink-0
        cursor-pointer
        rounded-full
        border-0
        bg-primary/10
        p-0
        text-primary
        ring-1
        ring-primary/20
        transition-all
        duration-200
        hover:bg-primary/15
        hover:text-primary
        hover:ring-primary/40
        ${className ?? ''}
      `}>
      <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
    </Button>
  );
}
