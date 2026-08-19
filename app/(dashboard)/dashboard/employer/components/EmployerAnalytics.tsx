'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

import ApplicationStatusChart from './ApplicationStatusChart';
import ApplicationTrendChart from './ApplicationTrendChart';
import JobPerformanceChart from './JobPerformanceChart';

interface EmployerAnalyticsProps {
  analytics: EmployerDashboardData['analytics'];
}

export default function EmployerAnalytics({ analytics }: EmployerAnalyticsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to selectively enable/disable control buttons
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="space-y-4">
      {/* Header & Carousel Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">
            Understand candidate conversion and job engagement performance.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll analytics left"
            className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-card text-muted-foreground transition-all hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll analytics right"
            className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-card text-muted-foreground transition-all hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Analytics Charts Carousel Container */}
      <div
        ref={scrollRef}
        className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 pt-1 snap-x snap-mandatory scrollbar-none sm:mx-0 sm:px-0">
        {/* Application Activity Trend */}
        <div className="w-[85vw] min-w-[85vw] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)] lg:min-w-[calc(33.333%-0.666rem)]">
          <ApplicationTrendChart data={analytics.applicationTrend} />
        </div>

        {/* Application Status Pipeline */}
        <div className="w-[85vw] min-w-[85vw] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)] lg:min-w-[calc(33.333%-0.666rem)]">
          <ApplicationStatusChart data={analytics.applicationStatus} />
        </div>

        {/* Job Performance Breakdown */}
        <div className="w-[85vw] min-w-[85vw] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)] lg:min-w-[calc(33.333%-0.666rem)]">
          <JobPerformanceChart data={analytics.jobPerformance} />
        </div>
      </div>
    </section>
  );
}
