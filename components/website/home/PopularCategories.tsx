'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { popularCategories } from '@/data/website/popularCategories';

const DESKTOP_PAGE_SIZE = 9;
const MOBILE_PAGE_SIZE = 4;

const trustedCompanies = [
  {
    id: 'techwave',
    name: 'TechWave',
    shortName: 'TW',
    color: '#2563EB'
  },
  {
    id: 'vertex',
    name: 'Vertex Labs',
    shortName: 'VL',
    color: '#7C3AED'
  },
  {
    id: 'nexora',
    name: 'Nexora',
    shortName: 'N',
    color: '#0891B2'
  },
  {
    id: 'cloudnest',
    name: 'CloudNest',
    shortName: 'CN',
    color: '#0F766E'
  },
  {
    id: 'brightpath',
    name: 'BrightPath',
    shortName: 'BP',
    color: '#EA580C'
  },
  {
    id: 'orbit',
    name: 'Orbit Systems',
    shortName: 'OS',
    color: '#4F46E5'
  },
  {
    id: 'pixelworks',
    name: 'PixelWorks',
    shortName: 'PW',
    color: '#DB2777'
  },
  {
    id: 'scaleup',
    name: 'ScaleUp',
    shortName: 'S',
    color: '#16A34A'
  }
];

export default function PopularCategories() {
  const [desktopPage, setDesktopPage] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);

  const desktopPages = useMemo(() => {
    const result = [];

    for (let index = 0; index < popularCategories.length; index += DESKTOP_PAGE_SIZE) {
      result.push(popularCategories.slice(index, index + DESKTOP_PAGE_SIZE));
    }

    return result;
  }, []);

  const mobilePages = useMemo(() => {
    const result = [];

    for (let index = 0; index < popularCategories.length; index += MOBILE_PAGE_SIZE) {
      result.push(popularCategories.slice(index, index + MOBILE_PAGE_SIZE));
    }

    return result;
  }, []);

  const currentDesktopPage = desktopPages[desktopPage] ?? [];
  const currentMobilePage = mobilePages[mobilePage] ?? [];

  const hasPreviousDesktop = desktopPage > 0;
  const hasNextDesktop = desktopPage < desktopPages.length - 1;

  const hasPreviousMobile = mobilePage > 0;
  const hasNextMobile = mobilePage < mobilePages.length - 1;

  return (
    <section className="relative isolate overflow-hidden border-y bg-muted/20">
      {/* Atmosphere */}
      <div className="absolute left-[15%] top-0 -z-10 size-[420px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]" />

      <div className="absolute bottom-0 right-[15%] -z-10 size-[360px] translate-x-1/2 rounded-full bg-primary/[0.045] blur-[130px]" />

      <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        {/* =========================================================
            TRUSTED COMPANIES — TOP
        ========================================================= */}

        <TrustedCompanies />

        {/* =========================================================
            CATEGORIES HEADER
        ========================================================= */}

        <div className="mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:mt-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="size-3.5" />
              Explore what&apos;s in demand
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.7rem]">
              Popular job categories.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Discover the skills and career paths companies are actively looking for.
            </p>
          </div>

          <Link
            href="/jobs"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary">
            Explore all jobs
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* =========================================================
            DESKTOP — 3 × 3
        ========================================================= */}

        <div className="mt-10 hidden lg:block">
          <motion.div
            key={desktopPage}
            initial={{
              opacity: 0,
              x: desktopPage > 0 ? 24 : -24
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="grid grid-cols-3 gap-4">
            {currentDesktopPage.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </motion.div>

          {desktopPages.length > 1 && (
            <div className="mt-7 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {desktopPages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show category page ${index + 1}`}
                    aria-current={index === desktopPage ? 'true' : undefined}
                    onClick={() => setDesktopPage(index)}
                    className={[
                      'h-1.5 rounded-full transition-all duration-300',
                      index === desktopPage
                        ? 'w-8 bg-primary'
                        : 'w-1.5 bg-foreground/20 hover:bg-foreground/40'
                    ].join(' ')}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!hasPreviousDesktop}
                  onClick={() => setDesktopPage(current => current - 1)}
                  className="flex size-9 items-center justify-center rounded-full border bg-background transition hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Previous category page">
                  <ArrowLeft className="size-4" />
                </button>

                <button
                  type="button"
                  disabled={!hasNextDesktop}
                  onClick={() => setDesktopPage(current => current + 1)}
                  className="flex size-9 items-center justify-center rounded-full border bg-background transition hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Next category page">
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            MOBILE — 2 × 2
        ========================================================= */}

        <div className="mt-8 lg:hidden">
          <div className="relative -mx-4">
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {mobilePages.map((page, pageIndex) => (
                <motion.div
                  key={pageIndex}
                  initial={{
                    opacity: 0,
                    x: 16
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="grid w-[96%] shrink-0 snap-start grid-cols-2 gap-3">
                  {page.map((category, index) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      index={pageIndex * MOBILE_PAGE_SIZE + index}
                      compact
                    />
                  ))}
                </motion.div>
              ))}
            </div>
          </div>

          {mobilePages.length > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {mobilePages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show category page ${index + 1}`}
                    aria-current={index === mobilePage ? 'true' : undefined}
                    onClick={() => setMobilePage(index)}
                    className={[
                      'h-1.5 rounded-full transition-all duration-300',
                      index === mobilePage ? 'w-7 bg-primary' : 'w-1.5 bg-muted-foreground/30'
                    ].join(' ')}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!hasPreviousMobile}
                  onClick={() => setMobilePage(current => current - 1)}
                  className="flex size-9 items-center justify-center rounded-full border bg-background transition hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Previous category page">
                  <ArrowLeft className="size-4" />
                </button>

                <button
                  type="button"
                  disabled={!hasNextMobile}
                  onClick={() => setMobilePage(current => current + 1)}
                  className="flex size-9 items-center justify-center gap-1 rounded-full border bg-background px-3 text-primary transition hover:border-primary/30 disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Next category page">
                  <span className="text-xs font-semibold">Next</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground/60">
            Swipe to explore more categories
          </p>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================= */
/* TRUSTED COMPANIES                                                         */
/* ========================================================================= */

function TrustedCompanies() {
  return (
    <div className="w-full">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <Building2 className="size-3.5" />
          Trusted by growing companies
        </div>

        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Companies are already looking for the people who can help them build what&apos;s next.
        </p>
      </div>

      <div className="relative mt-7 overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-muted/20 to-transparent" />

        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-muted/20 to-transparent" />

        <motion.div
          animate={{
            x: ['0%', '-50%']
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="flex w-max items-center">
          {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
            <div
              key={`${company.id}-${index}`}
              className="group flex h-16 min-w-[150px] items-center justify-center px-5 sm:min-w-[175px]">
              <div className="flex items-center gap-2.5 opacity-75 transition-opacity duration-300 group-hover:opacity-100">
                <div
                  className="flex size-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{
                    backgroundColor: company.color
                  }}>
                  {company.shortName}
                </div>

                <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground">
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-3 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/50">
          More companies joining the network
        </span>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* CATEGORY CARD                                                             */
/* ========================================================================= */

interface CategoryCardProps {
  category: (typeof popularCategories)[number];
  index: number;
  compact?: boolean;
}

function CategoryCard({ category, index, compact = false }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        amount: 0.15
      }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.3)
      }}
      whileHover={{
        y: -4
      }}
      className="h-full">
      <Link
        href={`/jobs?q=${encodeURIComponent(category.search)}`}
        className={[
          'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300',
          'hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5',
          compact ? 'min-h-[210px] p-4' : 'min-h-[225px] p-5'
        ].join(' ')}>
        {/* Ambient accent */}
        <div
          className="absolute right-0 top-0 size-28 translate-x-1/3 -translate-y-1/3 rounded-full opacity-[0.10] blur-2xl transition-transform duration-500 group-hover:scale-150"
          style={{
            backgroundColor: category.color
          }}
        />

        {/* Icon */}
        <div
          className={[
            'relative flex shrink-0 items-center justify-center rounded-2xl border transition-all duration-300',
            compact ? 'size-10' : 'size-12'
          ].join(' ')}
          style={{
            color: category.color,
            backgroundColor: `${category.color}12`,
            borderColor: `${category.color}25`
          }}>
          <Icon className={compact ? 'size-5' : 'size-5.5'} />
        </div>

        {/* Content */}
        <div className="relative mt-5">
          <h3
            className={[
              'font-semibold tracking-tight text-foreground transition-colors',
              'group-hover:text-primary',
              compact ? 'text-sm' : 'text-base'
            ].join(' ')}>
            {category.label}
          </h3>

          <p
            className={[
              'mt-2 leading-5 text-muted-foreground',
              compact ? 'line-clamp-3 text-[11px]' : 'line-clamp-3 text-sm'
            ].join(' ')}>
            {category.description}
          </p>
        </div>

        {/* CTA */}
        <div
          className="relative mt-auto flex items-center gap-1.5 pt-5 text-xs font-semibold"
          style={{
            color: category.color
          }}>
          Explore jobs
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
