'use client';

import { Building2, UserRound, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserSelectionType = 'company' | 'jobseeker';

interface UserTypeSelectionProps {
  onSelect: (type: UserSelectionType) => void;
}

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <section className="flex w-full flex-col items-center px-4 pb-8 pt-2 text-center sm:pb-10">
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {/* Company / Organization */}
        <Button
          type="button"
          onClick={() => onSelect('company')}
          className="
            group relative h-28 overflow-hidden rounded-2xl
            border border-primary/30
            bg-primary/10
            p-5 text-left text-foreground
            shadow-[0_0_30px_rgba(32,178,170,0.12)]
            transition-all duration-300
            hover:-translate-y-1
            hover:border-primary/20
            hover:bg-primary/20
            hover:text-primary-foreground
            hover:shadow-[0_0_40px_rgba(32,178,170,0.35)]
            cursor-pointer
          ">
          <Building2
            className="
              absolute -bottom-5 -right-5 h-24 w-24
              opacity-5 transition-all duration-500
              group-hover:scale-110 group-hover:opacity-10
            "
          />

          <div className="relative flex h-full w-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 transition-colors group-hover:bg-white/15">
                <Building2 className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
              </div>

              <ArrowRight className="h-4 w-4 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </div>

            <div>
              <p className="font-semibold">I&apos;m hiring</p>

              <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/70">
                Find skilled professionals
              </p>
            </div>
          </div>
        </Button>

        {/* Job Seeker */}
        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect('jobseeker')}
          className="
            group relative h-28 overflow-hidden rounded-2xl
            border-border/70
            bg-background/40
            p-5 text-left
            transition-all duration-300
            hover:-translate-y-1
            hover:border-primary/50
            hover:bg-primary/5
            hover:shadow-[0_0_30px_rgba(32,178,170,0.15)]
            cursor-pointer
          ">
          <UserRound
            className="
              absolute -bottom-5 -right-5 h-24 w-24
              opacity-[0.03] transition-all duration-500
              group-hover:scale-110 group-hover:opacity-[0.07]
            "
          />

          <div className="relative flex h-full w-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                <UserRound className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <div>
              <p className="font-semibold">I&apos;m looking for work</p>

              <p className="text-xs text-muted-foreground">Discover jobs that fit your skills</p>
            </div>
          </div>
        </Button>
      </div>
    </section>
  );
}
