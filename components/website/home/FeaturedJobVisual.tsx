'use client';

import { ArrowUpRight, BriefcaseBusiness, MapPin, Sparkles } from 'lucide-react';

import Floating from '@/components/motion/Floating';

interface FeaturedJobVisualProps {
  jobs: {
    id: string;
    title: string;
    location: string | null;
    workMode: string;
    employmentType: string;
    company: {
      companyName: string;
      companyLogoUrl: string | null;
    };
  }[];
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function CompanyLogo({ company }: { company: FeaturedJobVisualProps['jobs'][number]['company'] }) {
  if (company.companyLogoUrl) {
    return <img src={company.companyLogoUrl} alt="" className="size-full object-cover" />;
  }

  return <BriefcaseBusiness className="size-6 text-white/60" />;
}

export default function FeaturedJobVisual({ jobs }: FeaturedJobVisualProps) {
  const [primary, secondary, tertiary] = jobs.slice(0, 3);

  if (!primary) {
    return (
      <div className="relative mx-auto flex h-[520px] w-full max-w-[560px] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-center backdrop-blur-xl">
          <BriefcaseBusiness className="mx-auto size-10 text-white/50" />

          <p className="mt-4 text-sm text-white/60">New opportunities are coming soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[560px] w-full max-w-[560px]">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[110px]" />

      {/* Secondary card */}
      {secondary && (
        <Floating delay={0.8} duration={6} distance={12} className="absolute right-0 top-12 z-10 w-[300px]">
          <div className="rotate-[5deg] rounded-3xl border border-white/10 bg-black/35 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10">
                <CompanyLogo company={secondary.company} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{secondary.title}</p>

                <p className="mt-0.5 truncate text-xs text-white/50">{secondary.company.companyName}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/60">
                {formatLabel(secondary.workMode)}
              </span>

              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/60">
                {formatLabel(secondary.employmentType)}
              </span>
            </div>
          </div>
        </Floating>
      )}

      {/* Tertiary card */}
      {tertiary && (
        <Floating
          delay={1.4}
          duration={5.5}
          distance={10}
          className="absolute bottom-10 left-0 z-10 w-[285px]">
          <div className="-rotate-[5deg] rounded-3xl border border-white/10 bg-black/35 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10">
                <CompanyLogo company={tertiary.company} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{tertiary.title}</p>

                <p className="truncate text-xs text-white/50">{tertiary.company.companyName}</p>
              </div>
            </div>

            {tertiary.location && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-white/45">
                <MapPin className="size-3.5" />
                {tertiary.location}
              </div>
            )}
          </div>
        </Floating>
      )}

      {/* Main featured card */}
      <Floating
        delay={0}
        duration={5.8}
        distance={8}
        className="absolute left-1/2 top-1/2 z-20 w-[390px] max-w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2">
        <div className="overflow-hidden rounded-[28px] border border-white/15 bg-black/65 shadow-2xl shadow-black/50 backdrop-blur-2xl">
          {/* Accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-transparent" />

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                  <CompanyLogo company={primary.company} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    Featured opportunity
                  </p>

                  <p className="mt-1 truncate text-sm text-white/60">{primary.company.companyName}</p>
                </div>
              </div>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                <Sparkles className="size-4 text-primary" />
              </div>
            </div>

            <h3 className="mt-7 text-2xl font-bold leading-tight tracking-tight text-white">
              {primary.title}
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary">
                {formatLabel(primary.workMode)}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/65">
                {formatLabel(primary.employmentType)}
              </span>
            </div>

            {primary.location && (
              <div className="mt-5 flex items-center gap-2 text-sm text-white/50">
                <MapPin className="size-4" />
                {primary.location}
              </div>
            )}

            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">Looking for your next move?</p>

                  <p className="mt-1 text-sm font-medium text-white/80">Explore this opportunity</p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <ArrowUpRight className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Floating>
    </div>
  );
}
