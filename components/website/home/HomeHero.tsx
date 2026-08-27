'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

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
   * Automatically rotate the desktop showcase, pausing when hovered.
   */
  useEffect(() => {
    if (cards.length < 2 || isHovered) return;

    const interval = window.setInterval(() => {
      setFeaturedIndex(current => (current + 1) % cards.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [cards.length, isHovered]);

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
          <div
            className="relative mx-auto hidden h-[600px] w-full max-w-[620px] lg:block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {/* =====================================================
                LARGE SOFT GLOW
            ===================================================== */}
            <div className="absolute left-1/2 top-1/2 -z-20 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.10] blur-[110px]" />

            {/* =====================================================
                SECONDARY ATMOSPHERIC GLOW
            ===================================================== */}
            <div className="absolute right-[8%] top-[20%] -z-20 size-[180px] rounded-full bg-primary/[0.07] blur-[90px]" />

            {/* =====================================================
                SHOWCASE RING
            ===================================================== */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute left-1/2 top-1/2 -z-10 size-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/[0.06]"
            />

            {/* =====================================================
                INNER RING
            ===================================================== */}
            <div className="absolute left-1/2 top-1/2 -z-10 size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/[0.07]" />

            {/* =====================================================
                JOB CARDS (GPU-COMPOSITED TRANSFORM ROTATION)
            ===================================================== */}
            <div className="relative flex h-full w-full items-center justify-center">
              {cards.map((job, index) => {
                const position = (index - featuredIndex + cards.length) % cards.length;
                const featured = position === 0;

                const getCardStyle = (pos: number) => {
                  switch (pos) {
                    case 0:
                      return {
                        x: 0,
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        zIndex: 30
                      };
                    case 1:
                      return {
                        x: 120,
                        y: -110,
                        scale: 0.82,
                        opacity: 0.85,
                        zIndex: 20
                      };
                    case 2:
                      return {
                        x: -120,
                        y: 110,
                        scale: 0.82,
                        opacity: 0.7,
                        zIndex: 10
                      };
                    default:
                      return { x: 0, y: 0, scale: 0.6, opacity: 0, zIndex: 0 };
                  }
                };

                const style = getCardStyle(position);

                return (
                  <motion.div
                    key={job.id}
                    initial={false}
                    animate={{
                      x: style.x,
                      y: style.y,
                      scale: style.scale,
                      opacity: style.opacity,
                      zIndex: style.zIndex
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 26,
                      mass: 0.8
                    }}
                    className="absolute w-[440px] origin-center cursor-pointer will-change-transform"
                    onClick={() => setFeaturedIndex(index)}>
                    <FloatingJobCard job={job} featured={featured} />
                  </motion.div>
                );
              })}
            </div>

            {/* =====================================================
                DESKTOP INDICATORS (ADJUSTED POSITIONING)
            ===================================================== */}
            {cards.length > 1 && (
              <div className="absolute bottom-12 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/40 bg-background/50 px-3 py-1.5 backdrop-blur-md">
                {cards.map((job, index) => (
                  <button
                    key={job.id}
                    type="button"
                    aria-label={`Show ${job.title}`}
                    aria-current={index === featuredIndex ? 'true' : undefined}
                    onClick={() => setFeaturedIndex(index)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      index === featuredIndex
                        ? 'w-6 bg-primary shadow-sm shadow-primary/40'
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
      <div className="absolute inset-0 -z-40 bg-background" />
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_25%,hsl(var(--primary)/0.09),transparent_32%),radial-gradient(circle_at_82%_48%,hsl(var(--primary)/0.06),transparent_34%)]" />
      <div
        className="absolute inset-0 -z-20 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />
      <div className="absolute left-[35%] top-0 -z-20 h-px w-[30%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute left-[42%] top-[18%] -z-20 size-[420px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[130px]" />
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
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="size-3 text-primary" />
        </span>
        <span>A smarter way to connect talent and opportunity</span>
      </div>

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

      <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
        Discover meaningful opportunities, connect with growing companies, and take the next step in your
        career with Job Rcentz.
      </p>

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

      <HeroJobSearch />
    </div>
  );
}
