import { Building2, UserRound, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserSelectionType = 'company' | 'jobseeker';

interface OnboardingMessageProps {
  onSelect: (type: UserSelectionType) => void;
}

export default function OnboardingMessage({ onSelect }: OnboardingMessageProps) {
  return (
    <section className="flex w-full flex-col items-center px-4 pb-8 pt-2 text-center sm:pb-10">
      {/* Hero */}
      <h1 className="max-w-5xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        Find the right opportunity.
        <br />
        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
          Build what&apos;s next.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        Connect with skilled professionals, discover meaningful jobs, and turn your skills into opportunities
        that move your career forward.
      </p>

      {/* Selection CTAs */}
      <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {/* Company */}
        <Button
          type="button"
          onClick={() => onSelect('company')}
          className="
            group relative h-32 overflow-hidden rounded-2xl
            border border-primary/30
            bg-primary/[0.07]
            p-5 text-left text-foreground
            shadow-[0_0_25px_rgba(32,178,170,0.08)]
            transition-all duration-500
            ease-out
            hover:-translate-y-1
            hover:border-primary/60
            hover:bg-primary/[0.12]
            hover:shadow-[0_12px_45px_rgba(32,178,170,0.18)]
            active:translate-y-0
            cursor-pointer
          ">
          {/* Animated glow */}
          <div
            className="
              pointer-events-none absolute -right-16 -top-16
              h-40 w-40 rounded-full
              bg-primary/20 blur-3xl
              opacity-0
              transition-opacity duration-500
              group-hover:opacity-100
            "
          />

          {/* Decorative icon */}
          <Building2
            className="
              pointer-events-none absolute -bottom-7 -right-7
              h-28 w-28
              text-primary
              opacity-[0.035]
              transition-all duration-700
              ease-out
              group-hover:rotate-6
              group-hover:scale-110
              group-hover:opacity-[0.09]
            "
          />

          <div className="relative flex h-full w-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div
                className="
                  flex h-10 w-10 items-center justify-center rounded-xl
                  border border-primary/20
                  bg-primary/10
                  shadow-sm
                  transition-all duration-300
                  group-hover:border-primary/40
                  group-hover:bg-primary/20
                  group-hover:shadow-[0_0_20px_rgba(32,178,170,0.2)]
                ">
                <Building2
                  className="
                    h-5 w-5 text-primary
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                />
              </div>

              <div
                className="
                  flex h-8 w-8 items-center justify-center rounded-full
                  border border-border/60
                  bg-background/50
                  transition-all duration-300
                  group-hover:border-primary/40
                  group-hover:bg-primary/10
                ">
                <ArrowUpRight
                  className="
                    h-4 w-4 text-muted-foreground
                    transition-all duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-primary
                  "
                />
              </div>
            </div>

            <div>
              <p className="font-semibold tracking-tight">I&apos;m hiring</p>

              <p className="mt-0.5 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70">
                Find skilled professionals
              </p>
            </div>
          </div>
        </Button>

        {/* Job seeker */}
        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect('jobseeker')}
          className="
            group relative h-32 overflow-hidden rounded-2xl
            border-border/70
            bg-background/40
            p-5 text-left text-foreground
            shadow-sm
            transition-all duration-500
            ease-out
            hover:-translate-y-1
            hover:border-primary/40
            hover:bg-primary/[0.04]
            hover:shadow-[0_12px_40px_rgba(32,178,170,0.12)]
            active:translate-y-0
            cursor-pointer
          ">
          {/* Animated glow */}
          <div
            className="
              pointer-events-none absolute -left-16 -top-16
              h-40 w-40 rounded-full
              bg-primary/10 blur-3xl
              opacity-0
              transition-opacity duration-500
              group-hover:opacity-100
            "
          />

          {/* Decorative icon */}
          <UserRound
            className="
              pointer-events-none absolute -bottom-7 -right-7
              h-28 w-28
              text-primary
              opacity-[0.025]
              transition-all duration-700
              ease-out
              group-hover:-rotate-6
              group-hover:scale-110
              group-hover:opacity-[0.07]
            "
          />

          <div className="relative flex h-full w-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div
                className="
                  flex h-10 w-10 items-center justify-center rounded-xl
                  border border-border/60
                  bg-muted/50
                  transition-all duration-300
                  group-hover:border-primary/30
                  group-hover:bg-primary/10
                  group-hover:shadow-[0_0_20px_rgba(32,178,170,0.12)]
                ">
                <UserRound
                  className="
                    h-5 w-5 text-muted-foreground
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:text-primary
                  "
                />
              </div>

              <div
                className="
                  flex h-8 w-8 items-center justify-center rounded-full
                  border border-border/60
                  bg-background/50
                  transition-all duration-300
                  group-hover:border-primary/30
                  group-hover:bg-primary/10
                ">
                <ArrowUpRight
                  className="
                    h-4 w-4 text-muted-foreground/60
                    transition-all duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-primary
                  "
                />
              </div>
            </div>

            <div>
              <p className="font-semibold tracking-tight">I&apos;m looking for work</p>

              <p className="mt-0.5 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70">
                Discover jobs that fit your skills
              </p>
            </div>
          </div>
        </Button>
      </div>
    </section>
  );
}
