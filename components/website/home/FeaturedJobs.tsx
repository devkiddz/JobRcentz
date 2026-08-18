'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

import FadeIn from '@/components/motion/FadeIn';
import StaggerContainer from '@/components/motion/StaggerContainer';
import StaggerItem from '@/components/motion/StaggerItem';

interface FeaturedJobsProps {
  jobs: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    workMode: string;
    employmentType: string;
    skills: string[];
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

function getSkillIcon(skill: string) {
  const value = skill.toLowerCase();

  if (
    value.includes('react') ||
    value.includes('next') ||
    value.includes('typescript') ||
    value.includes('javascript') ||
    value.includes('node') ||
    value.includes('python')
  ) {
    return '◆';
  }

  if (
    value.includes('css') ||
    value.includes('tailwind') ||
    value.includes('html') ||
    value.includes('design')
  ) {
    return '✦';
  }

  if (
    value.includes('sql') ||
    value.includes('postgres') ||
    value.includes('mongo') ||
    value.includes('database')
  ) {
    return '◇';
  }

  return '•';
}

export default function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  const visibleJobs = jobs.slice(0, 6);

  return (
    <section className="relative isolate overflow-hidden border-y bg-muted/20">
      {/* =========================================================
          ATMOSPHERE
      ========================================================= */}

      <div className="absolute inset-0 -z-30 bg-background" />

      {/* Main brand glow */}
      <div className="absolute left-1/2 top-0 -z-20 size-[650px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/[0.075] blur-[140px]" />

      {/* Secondary glow */}
      <div className="absolute right-[-120px] top-[35%] -z-20 size-[380px] rounded-full bg-primary/[0.045] blur-[120px]" />

      {/* Technical grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.075]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '44px 44px'
        }}
      />

      {/* Top grid fade */}
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-background via-background/70 to-transparent" />

      {/* Bottom grid fade */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />

      {/* Center spotlight */}
      <div className="absolute left-1/2 top-[38%] -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/[0.025] blur-[110px]" />

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:py-28 lg:px-8 lg:py-32">
        {/* =======================================================
            HEADER
        ======================================================= */}

        <FadeIn>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* Section badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                Fresh opportunities
              </div>

              {/* Heading */}
              <h2 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
                Jobs worth
                <span className="text-primary"> looking at.</span>
              </h2>

              {/* Description */}
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Explore opportunities from companies looking for people who are ready to build, contribute,
                and make an impact.
              </p>

              {/* Live indicator */}
              {visibleJobs.length > 0 && (
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  {visibleJobs.length} opportunities currently featured
                </div>
              )}
            </div>

            {/* View all */}
            {visibleJobs.length > 0 && (
              <Link
                href="/jobs"
                className="group inline-flex w-fit items-center gap-2 rounded-full border bg-background px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-md">
                View all jobs
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </FadeIn>

        {/* =======================================================
            JOBS
        ======================================================= */}

        {visibleJobs.length === 0 ? (
          <FadeIn>
            <div className="mt-12 overflow-hidden rounded-[1.75rem] border bg-card shadow-sm">
              <div className="relative px-6 py-16 text-center sm:px-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.035] via-transparent to-transparent" />

                <div className="relative">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-muted shadow-sm">
                    <BriefcaseBusiness className="size-6 text-muted-foreground" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">New opportunities are coming.</h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    There are no published positions available right now. Check back soon for new
                    opportunities.
                  </p>

                  <Link
                    href="/jobs"
                    className="mt-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2.5 text-sm font-semibold transition hover:border-primary/30 hover:text-primary">
                    Browse jobs
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleJobs.map(job => (
              <StaggerItem key={job.id}>
                <Link href={`/jobs/${job.id}`} className="group block h-full">
                  <article className="relative flex h-full min-h-[355px] flex-col overflow-hidden rounded-[1.75rem] border bg-card p-5 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.07]">
                    {/* Card hover atmosphere */}
                    <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/[0.045] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                    {/* =================================================
                        COMPANY / JOB HEADER
                    ================================================= */}

                    <div className="relative flex items-start gap-3.5">
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted shadow-sm">
                        {job.company.companyLogoUrl ? (
                          <img src={job.company.companyLogoUrl} alt="" className="size-full object-cover" />
                        ) : (
                          <BriefcaseBusiness className="size-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-semibold uppercase tracking-wide text-primary">
                            {job.company.companyName}
                          </p>

                          <CheckCircle2 className="size-3.5 shrink-0 text-primary/70" />
                        </div>

                        <h3 className="mt-1.5 line-clamp-2 text-base font-semibold leading-5 tracking-tight transition-colors duration-300 group-hover:text-primary">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p className="relative mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {job.description}
                    </p>

                    {/* =================================================
                        META
                    ================================================= */}

                    <div className="relative mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {formatLabel(job.workMode)}
                      </span>

                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {formatLabel(job.employmentType)}
                      </span>

                      {job.location && (
                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                          <MapPin className="size-3 shrink-0" />

                          <span className="truncate">{job.location}</span>
                        </span>
                      )}
                    </div>

                    {/* =================================================
                        SKILLS
                    ================================================= */}

                    {job.skills.length > 0 && (
                      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
                        {job.skills.slice(0, 4).map(skill => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors group-hover:border-primary/15">
                            <span className="text-primary">{getSkillIcon(skill)}</span>

                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="relative mt-5 flex items-center justify-between border-t pt-4">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
                        Opportunity
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        View job
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* =======================================================
            BOTTOM CTA
        ======================================================= */}

        {visibleJobs.length > 0 && (
          <FadeIn>
            <div className="mt-10 flex justify-center">
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 rounded-full border bg-background px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-md">
                Explore more opportunities
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
