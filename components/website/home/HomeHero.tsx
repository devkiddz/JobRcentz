'use client';

import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import MobileJobCarousel from './MobileJobCarousel';
import FloatingJobCard from './FloatingJobCard';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import HeroJobSearch from './HeroJobSearch';

interface HomeHeroProps {
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

export default function HomeHero({ jobs }: HomeHeroProps) {
  const cards = useMemo(() => jobs.slice(0, 3), [jobs]);

  const [featuredIndex, setFeaturedIndex] = useState(0);

  /*
   * Keep the active card valid when fresh jobs arrive.
   */
  useEffect(() => {
    if (cards.length === 0) {
      setFeaturedIndex(0);
      return;
    }

    setFeaturedIndex(current => current % cards.length);
  }, [cards.length]);

  /*
   * Automatically rotate the desktop showcase.
   */
  useEffect(() => {
    if (cards.length < 2) return;

    const interval = window.setInterval(() => {
      setFeaturedIndex(current => (current + 1) % cards.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [cards.length]);

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      <HeroBackground />

      <div
        className={cn(
          'mx-auto flex max-w-7xl flex-col justify-center',
          'px-4 py-16 sm:py-20',
          'lg:grid lg:min-h-[680px] lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-8',
          'lg:px-8 lg:py-20'
        )}>
        {/* =========================================================
            HERO COPY
        ========================================================= */}
        <HeroCopy />

        {/* =========================================================
            MOBILE JOB EXPERIENCE
        ========================================================= */}
        {cards.length > 0 && <MobileJobCarousel jobs={cards} />}

        {/* =========================================================
            DESKTOP JOB SHOWCASE
        ========================================================= */}
        {cards.length > 0 && (
          <div className="relative mx-auto hidden h-[600px] w-full max-w-[620px] lg:block">
            {/* Large soft glow */}
            <div className="absolute left-1/2 top-1/2 -z-20 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.10] blur-[110px]" />

            {/* Secondary atmospheric glow */}
            <div className="absolute right-[8%] top-[20%] -z-20 size-[180px] rounded-full bg-primary/[0.07] blur-[90px]" />

            {/* Showcase ring */}
            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute left-1/2 top-1/2 -z-10 size-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/[0.06]"
            />

            {/* Inner ring */}
            <div className="absolute left-1/2 top-1/2 -z-10 size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/[0.07]" />

            {/* =====================================================
                JOB CARDS
            ===================================================== */}
            <div className="absolute inset-0">
              {cards.map((job, index) => {
                const position = (index - featuredIndex + cards.length) % cards.length;

                const featured = position === 0;

                return (
                  <motion.div
                    key={job.id}
                    layout
                    initial={false}
                    animate={{
                      top: position === 0 ? '15%' : position === 1 ? '4%' : '61%',

                      left: position === 0 ? '20%' : position === 1 ? '0%' : '17%',

                      width: position === 0 ? 'min(500px, 88vw)' : 'min(285px, 62vw)',

                      height: position === 0 ? '390px' : '205px',

                      zIndex: position === 0 ? 30 : position === 1 ? 20 : 10
                    }}
                    transition={{
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute"
                    style={{
                      transform: position === 0 ? 'translate(-50%, -50%)' : 'translate(0, 0)'
                    }}>
                    <FloatingJobCard job={job} featured={featured} />
                  </motion.div>
                );
              })}
            </div>

            {/* =====================================================
                DESKTOP INDICATORS
            ===================================================== */}
            {cards.length > 1 && (
              <div className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
                {cards.map((job, index) => (
                  <button
                    key={job.id}
                    type="button"
                    aria-label={`Show ${job.title}`}
                    aria-current={index === featuredIndex ? 'true' : undefined}
                    onClick={() => setFeaturedIndex(index)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-500',
                      index === featuredIndex
                        ? 'w-8 bg-primary shadow-sm shadow-primary/40'
                        : 'w-1.5 bg-foreground/20 hover:bg-foreground/40'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ========================================================================= */
/* HERO BACKGROUND                                                           */
/* ========================================================================= */

function HeroBackground() {
  return (
    <>
      {/* =========================================================
          BASE
      ========================================================= */}
      <div className="absolute inset-0 -z-40 bg-background" />

      {/* =========================================================
          SUBTLE BRAND ATMOSPHERE
          Keep green controlled rather than washing the entire hero.
      ========================================================= */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_25%,hsl(var(--primary)/0.09),transparent_32%),radial-gradient(circle_at_82%_48%,hsl(var(--primary)/0.06),transparent_34%)]" />

      {/* =========================================================
          GRID
      ========================================================= */}
      <div
        className="absolute inset-0 -z-20 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* =========================================================
          TOP LIGHT
      ========================================================= */}
      <div className="absolute left-[35%] top-0 -z-20 h-px w-[30%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* =========================================================
          HERO GLOW
      ========================================================= */}
      <div className="absolute left-[42%] top-[18%] -z-20 size-[420px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[130px]" />

      {/* =========================================================
          BOTTOM FADE
      ========================================================= */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </>
  );
}

/* ========================================================================= */
/* HERO COPY                                                                 */
/* ========================================================================= */

function HeroCopy() {
  return (
    <div className="relative z-10 max-w-2xl">
      {/* =========================================================
          EYEBROW
      ========================================================= */}
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="size-3 text-primary" />
        </span>

        <span>A smarter way to connect talent and opportunity</span>
      </div>

      {/* =========================================================
          HEADING
      ========================================================= */}
      <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
        Find work that
        <span className="block text-primary">
          fits your ambition
          <motion.span
            aria-hidden="true"
            animate={{
              opacity: [1, 0.25, 1],
              scale: [1, 0.85, 1]
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="ml-1 inline-block origin-bottom text-primary">
            .
          </motion.span>
        </span>
      </h1>
      {/* =========================================================
          DESCRIPTION
      ========================================================= */}
      <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
        Discover meaningful opportunities, connect with growing companies, and take the next step in your
        career with Job Rcentz.
      </p>

      {/* =========================================================
          ACTIONS
      ========================================================= */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/jobs"
          className={cn(
            buttonVariants(),
            'group h-12 rounded-full px-6 text-sm font-semibold shadow-lg shadow-primary/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20'
          )}>
          Find your next job
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <Link
          href="/onboarding"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/60 px-6 text-sm font-semibold text-foreground shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-background/80">
          Build your profile
        </Link>
      </div>

      {/* =========================================================
          SEARCH
      ========================================================= */}
      <HeroJobSearch />
    </div>
  );
}
