'use client';

import Link from 'next/link';
import {
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  Globe2,
  MapPin,
  Sparkles,
  Terminal,
  Users,
  WandSparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingJobCardProps {
  job: {
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
  };

  /**
   * Featured controls the visual size/content density.
   *
   * floating controls whether this card participates
   * in the desktop floating showcase.
   */
  featured?: boolean;
  floating?: boolean;
}

/* ========================================================================= */
/* HELPERS                                                                   */
/* ========================================================================= */

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
    value.includes('vue') ||
    value.includes('angular')
  ) {
    return Code2;
  }

  if (
    value.includes('typescript') ||
    value.includes('javascript') ||
    value.includes('node') ||
    value.includes('python') ||
    value.includes('java') ||
    value.includes('php')
  ) {
    return Terminal;
  }

  if (
    value.includes('tailwind') ||
    value.includes('css') ||
    value.includes('html') ||
    value.includes('design')
  ) {
    return WandSparkles;
  }

  return Sparkles;
}

function getWorkModeIcon(workMode: string) {
  const value = workMode.toLowerCase();

  if (value.includes('remote')) {
    return Globe2;
  }

  if (value.includes('hybrid')) {
    return Users;
  }

  return BriefcaseBusiness;
}

/* ========================================================================= */
/* COMPONENT                                                                 */
/* ========================================================================= */

export default function FloatingJobCard({ job, featured = false, floating = false }: FloatingJobCardProps) {
  const visibleSkills = job.skills.slice(0, featured ? 4 : 2);

  const WorkModeIcon = getWorkModeIcon(job.workMode);

  return (
    <motion.div
      layout={floating}
      initial={false}
      animate={
        floating
          ? {
              scale: featured ? 1 : 0.82,
              opacity: featured ? 1 : 0.72,
              y: featured ? [0, -6, 0] : [0, -3, 0],
              rotate: featured ? 0 : -1
            }
          : {
              scale: 1,
              opacity: 1,
              y: 0,
              rotate: 0
            }
      }
      transition={
        floating
          ? {
              layout: {
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1]
              },

              scale: {
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1]
              },

              opacity: {
                duration: 0.7
              },

              rotate: {
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1]
              },

              y: {
                duration: featured ? 4.8 : 5.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }
          : {
              duration: 0.3,
              ease: 'easeOut'
            }
      }
      className={floating ? 'absolute inset-0' : 'relative h-full w-full'}>
      <Link
        href={`/jobs/${job.id}`}
        aria-label={`View ${job.title} at ${job.company.companyName}`}
        className="block h-full w-full">
        <article
          className={[
            /*
             * Base structure
             */
            'group relative flex h-full flex-col overflow-hidden',
            'rounded-[1.75rem] border',
            'bg-card text-card-foreground',

            /*
             * Solid surface — intentionally no transparency.
             */
            'shadow-lg shadow-black/10',

            /*
             * Interaction
             */
            'transition-all duration-300',
            'hover:-translate-y-1',
            'hover:border-primary/40',
            'hover:shadow-xl hover:shadow-primary/10',

            /*
             * Accessibility
             */
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-primary',
            'focus-visible:ring-offset-2',

            /*
             * Secondary floating cards remain visually quieter,
             * but their surface is still completely solid.
             */
            floating && !featured ? 'border-border/70 shadow-md shadow-black/10' : 'border-border'
          ].join(' ')}>
          {/* =========================================================
              FEATURED TOP ACCENT
          ========================================================= */}
          {featured && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
          )}

          {/* =========================================================
              HEADER
          ========================================================= */}
          <div className={['flex items-start gap-4', featured ? 'p-5 sm:p-6' : 'p-4'].join(' ')}>
            {/* Company logo */}
            <div
              className={[
                'flex shrink-0 items-center justify-center overflow-hidden',
                'rounded-2xl border border-border bg-muted',
                featured ? 'size-14 sm:size-16' : 'size-11'
              ].join(' ')}>
              {job.company.companyLogoUrl ? (
                <img
                  src={job.company.companyLogoUrl}
                  alt={`${job.company.companyName} logo`}
                  className="size-full object-cover"
                />
              ) : (
                <BriefcaseBusiness
                  className={featured ? 'size-6 text-muted-foreground' : 'size-5 text-muted-foreground'}
                />
              )}
            </div>

            {/* Company + title */}
            <div className="min-w-0 flex-1">
              <p
                className={[
                  'truncate font-semibold uppercase tracking-[0.12em] text-primary',
                  featured ? 'text-[10px]' : 'text-[9px]'
                ].join(' ')}>
                {job.company.companyName}
              </p>

              <h3
                className={[
                  'mt-1 line-clamp-2 font-bold leading-tight tracking-tight',
                  'text-card-foreground',
                  featured ? 'text-lg sm:text-xl' : 'text-sm'
                ].join(' ')}>
                {job.title}
              </h3>
            </div>

            {/* Accent icon */}
            <div
              className={[
                'flex shrink-0 items-center justify-center rounded-xl',
                'bg-primary/10 text-primary',
                featured ? 'size-9' : 'size-7'
              ].join(' ')}>
              <Sparkles className={featured ? 'size-4' : 'size-3.5'} />
            </div>
          </div>

          {/* =========================================================
              CONTENT
          ========================================================= */}
          <div className={['min-h-0 flex-1', featured ? 'px-5 sm:px-6' : 'px-4'].join(' ')}>
            {/* Description */}
            <p
              className={[
                'text-muted-foreground',
                'leading-6',
                featured ? 'line-clamp-3 text-sm' : 'line-clamp-2 text-xs leading-5'
              ].join(' ')}>
              {job.description}
            </p>

            {/* =======================================================
                JOB META
            ======================================================= */}
            <div className={['flex flex-wrap', featured ? 'mt-5 gap-2' : 'mt-3 gap-1.5'].join(' ')}>
              {/* Work mode */}
              <span
                className={[
                  'inline-flex items-center gap-1.5 rounded-full',
                  'bg-muted text-muted-foreground',
                  'font-medium',
                  featured ? 'px-3 py-1.5 text-[11px]' : 'px-2 py-1 text-[9px]'
                ].join(' ')}>
                <WorkModeIcon className={featured ? 'size-3.5' : 'size-3'} />

                {formatLabel(job.workMode)}
              </span>

              {/* Employment type */}
              <span
                className={[
                  'inline-flex items-center gap-1.5 rounded-full',
                  'bg-muted text-muted-foreground',
                  'font-medium',
                  featured ? 'px-3 py-1.5 text-[11px]' : 'px-2 py-1 text-[9px]'
                ].join(' ')}>
                <CalendarDays className={featured ? 'size-3.5' : 'size-3'} />

                {formatLabel(job.employmentType)}
              </span>

              {/* Location */}
              {job.location && (
                <span
                  className={[
                    'inline-flex min-w-0 items-center gap-1.5 rounded-full',
                    'bg-muted text-muted-foreground',
                    featured ? 'px-3 py-1.5 text-[11px]' : 'px-2 py-1 text-[9px]'
                  ].join(' ')}>
                  <MapPin className={featured ? 'size-3.5 shrink-0' : 'size-3 shrink-0'} />

                  <span className="max-w-32 truncate">{job.location}</span>
                </span>
              )}
            </div>

            {/* =======================================================
                SKILLS
            ======================================================= */}
            {visibleSkills.length > 0 && (
              <div className={['mt-auto', featured ? 'pt-5' : 'pt-4'].join(' ')}>
                {featured && (
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                    Skills
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {visibleSkills.map(skill => {
                    const SkillIcon = getSkillIcon(skill);

                    return (
                      <span
                        key={skill}
                        className={[
                          'inline-flex items-center gap-1.5',
                          'rounded-lg border border-border',
                          'bg-muted',
                          'font-medium text-muted-foreground',
                          'transition-colors duration-300',
                          'group-hover:border-primary/20',
                          featured ? 'px-2.5 py-1.5 text-[11px]' : 'px-2 py-1 text-[10px]'
                        ].join(' ')}>
                        <SkillIcon
                          className={['shrink-0 text-primary', featured ? 'size-3.5' : 'size-3'].join(' ')}
                        />

                        <span className="max-w-28 truncate">{skill}</span>
                      </span>
                    );
                  })}

                  {!featured && job.skills.length > 2 && (
                    <span className="inline-flex items-center rounded-lg bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                      +{job.skills.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================
              FOOTER
          ========================================================= */}
          <div
            className={['mt-auto border-t border-border', featured ? 'px-5 py-4 sm:px-6' : 'px-4 py-3'].join(
              ' '
            )}>
            <div className="flex items-center justify-between gap-4">
              {featured ? (
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Featured opportunity
                  </span>
                </div>
              ) : (
                <span className="text-[9px] font-medium text-muted-foreground">Job Rcentz</span>
              )}

              <span
                className={[
                  'font-semibold text-primary',
                  'transition-transform duration-300',
                  'group-hover:translate-x-1',
                  featured ? 'text-xs' : 'text-[10px]'
                ].join(' ')}>
                View opportunity →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
