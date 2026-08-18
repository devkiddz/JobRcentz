'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface MobileJobCarouselProps {
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
    return '◆';
  }

  if (
    value.includes('typescript') ||
    value.includes('javascript') ||
    value.includes('node') ||
    value.includes('python') ||
    value.includes('java') ||
    value.includes('php')
  ) {
    return '◇';
  }

  if (
    value.includes('tailwind') ||
    value.includes('css') ||
    value.includes('html') ||
    value.includes('design')
  ) {
    return '✦';
  }

  return '•';
}

/* ========================================================================= */
/* COMPONENT                                                                 */
/* ========================================================================= */

export default function MobileJobCarousel({ jobs }: MobileJobCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const autoplayTimeoutRef = useRef<number | null>(null);

  /* ----------------------------------------------------------------------- */
  /* Keep ref synchronized                                                   */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  /* ----------------------------------------------------------------------- */
  /* Reset when jobs change                                                  */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    if (!jobs.length) {
      setActiveIndex(0);
      activeIndexRef.current = 0;
      return;
    }

    setActiveIndex(current => {
      const next = current % jobs.length;
      activeIndexRef.current = next;
      return next;
    });
  }, [jobs.length]);

  /* ----------------------------------------------------------------------- */
  /* Horizontal-only card positioning                                        */
  /* ----------------------------------------------------------------------- */

  const scrollToJob = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const track = trackRef.current;

      if (!track || !jobs.length) return;

      const card = track.querySelector<HTMLElement>(`[data-index="${index}"]`);

      if (!card) return;

      /*
       * IMPORTANT:
       *
       * Do NOT use scrollIntoView().
       *
       * scrollIntoView() can scroll the entire page vertically.
       * We only want to modify the horizontal scroll position
       * of this carousel.
       */

      const trackRect = track.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const cardCenter = cardRect.left - trackRect.left + track.scrollLeft + cardRect.width / 2;

      const targetLeft = cardCenter - track.clientWidth / 2;

      isProgrammaticScrollRef.current = true;

      track.scrollTo({
        left: Math.max(0, targetLeft),
        behavior
      });

      activeIndexRef.current = index;
      setActiveIndex(index);

      /*
       * Release the programmatic-scroll guard after the smooth
       * scrolling animation has had time to settle.
       */
      window.setTimeout(
        () => {
          isProgrammaticScrollRef.current = false;
        },
        behavior === 'smooth' ? 650 : 50
      );
    },
    [jobs.length]
  );

  /* ----------------------------------------------------------------------- */
  /* Observe active card                                                     */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    const track = trackRef.current;

    if (!track || jobs.length <= 1) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-mobile-job-card]'));

    if (!cards.length) return;

    const observer = new IntersectionObserver(
      entries => {
        /*
         * While autoplay or a pagination button is moving the carousel,
         * don't let intermediate intersection events fight the target
         * index.
         */
        if (isProgrammaticScrollRef.current) return;

        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const current = visible[0];

        if (!current) return;

        const index = Number(current.target.getAttribute('data-index'));

        if (Number.isNaN(index)) return;

        activeIndexRef.current = index;
        setActiveIndex(index);
      },
      {
        root: track,

        /*
         * We want the card that is closest to the center of
         * the carousel to become active.
         */
        threshold: [0.5, 0.65, 0.8, 0.95]
      }
    );

    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [jobs]);

  /* ----------------------------------------------------------------------- */
  /* Autoplay                                                                */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    if (jobs.length <= 1) return;

    const startAutoplay = () => {
      autoplayTimeoutRef.current = window.setTimeout(() => {
        const current = activeIndexRef.current;

        const next = (current + 1) % jobs.length;

        scrollToJob(next, 'smooth');

        startAutoplay();
      }, 5500);
    };

    startAutoplay();

    return () => {
      if (autoplayTimeoutRef.current !== null) {
        window.clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [jobs.length, scrollToJob]);

  /* ----------------------------------------------------------------------- */
  /* Nothing to render                                                       */
  /* ----------------------------------------------------------------------- */

  if (!jobs.length) {
    return null;
  }

  return (
    <section className="mt-12 w-full lg:hidden">
      {/* =========================================================
          SECTION HEADER
      ========================================================= */}

      <div className="mb-5 flex items-end justify-between px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Live opportunities
            </p>
          </div>

          <p className="mt-1.5 text-sm text-muted-foreground">Swipe to explore available roles</p>
        </div>

        {jobs.length > 1 && (
          <span className="text-xs font-medium text-muted-foreground">
            {activeIndex + 1}/{jobs.length}
          </span>
        )}
      </div>

      {/* =========================================================
          CAROUSEL
      ========================================================= */}

      <div
        ref={trackRef}
        className={[
          'flex w-full gap-3',
          'overflow-x-auto',
          'overscroll-x-contain',
          'scroll-smooth',
          'snap-x snap-mandatory',
          'scroll-px-3',
          'pb-3',

          /*
           * Prevent the browser from trying to chain the
           * horizontal gesture into page scrolling.
           */
          'touch-pan-x',

          '[-ms-overflow-style:none]',
          '[scrollbar-width:none]',
          '[&::-webkit-scrollbar]:hidden'
        ].join(' ')}>
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            data-mobile-job-card
            data-index={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.2
            }}
            transition={{
              duration: 0.45,
              delay: Math.min(index * 0.05, 0.2),
              ease: [0.22, 1, 0.36, 1]
            }}
            className={[
              /*
               * 1½-card presentation.
               *
               * The card is deliberately wide enough that
               * the next card visibly peeks into the viewport.
               */
              'w-[78%] shrink-0 snap-center',
              'first:ml-1 last:mr-1',
              'sm:w-[72%]'
            ].join(' ')}>
            <Link
              href={`/jobs/${job.id}`}
              aria-label={`View ${job.title} at ${job.company.companyName}`}
              className="group block h-full">
              <article
                className={[
                  'relative flex h-full min-h-[350px] flex-col',
                  'overflow-hidden rounded-[1.5rem]',
                  'border border-border',
                  'bg-card text-card-foreground',
                  'shadow-xl shadow-black/10',
                  'transition-all duration-300',
                  'hover:-translate-y-1',
                  'hover:border-primary/35',
                  'hover:shadow-2xl hover:shadow-primary/5',
                  'group-active:scale-[0.99]'
                ].join(' ')}>
                {/* =================================================
                    TOP ACCENT
                ================================================= */}

                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-start gap-3 p-5">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                    {job.company.companyLogoUrl ? (
                      <img
                        src={job.company.companyLogoUrl}
                        alt={`${job.company.companyName} logo`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <BriefcaseBusiness className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                      {job.company.companyName}
                    </p>

                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-5 tracking-tight text-foreground">
                      {job.title}
                    </h3>
                  </div>

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* =================================================
                    BODY
                ================================================= */}

                <div className="flex min-h-0 flex-1 flex-col px-5">
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{job.description}</p>

                  {/* =================================================
                      METADATA
                  ================================================= */}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                      {formatLabel(job.workMode)}
                    </span>

                    <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                      {formatLabel(job.employmentType)}
                    </span>

                    {job.location && (
                      <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                        <MapPin className="size-3 shrink-0" />

                        <span className="max-w-40 truncate">{job.location}</span>
                      </span>
                    )}
                  </div>

                  {/* =================================================
                      SKILLS
                  ================================================= */}

                  {job.skills.length > 0 && (
                    <div className="mt-auto pt-6">
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                        Skills
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 4).map(skill => (
                          <span
                            key={skill}
                            className={[
                              'inline-flex items-center gap-1',
                              'rounded-lg border border-border',
                              'bg-muted/60',
                              'px-2 py-1',
                              'text-[10px] font-medium',
                              'text-muted-foreground',
                              'transition-colors duration-300',
                              'group-hover:border-primary/20'
                            ].join(' ')}>
                            <span className="text-primary">{getSkillIcon(skill)}</span>

                            <span className="max-w-28 truncate">{skill}</span>
                          </span>
                        ))}

                        {job.skills.length > 4 && (
                          <span className="inline-flex items-center rounded-lg border border-border bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                            +{job.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="mt-5 border-t border-border px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Opportunity
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      View job
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* =========================================================
          INDICATORS
      ========================================================= */}

      {jobs.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {jobs.map((job, index) => (
            <button
              key={job.id}
              type="button"
              aria-label={`Show ${job.title}`}
              aria-current={activeIndex === index ? 'true' : undefined}
              onClick={() => scrollToJob(index)}
              className={[
                'h-1.5 rounded-full',
                'transition-all duration-300',
                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary',
                'focus-visible:ring-offset-2',
                activeIndex === index
                  ? 'w-7 bg-primary'
                  : 'w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/50'
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </section>
  );
}
