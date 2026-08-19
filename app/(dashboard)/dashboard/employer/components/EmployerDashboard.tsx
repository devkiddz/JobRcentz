'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import EmployerProfileHero from './EmployerProfileHero';
import EmployerStats from './EmployerStats';
import EmployerAnalytics from './EmployerAnalytics';
import RecentApplications from './RecentApplications';
import RecentJobs from './RecentJobs';
import UpcomingInterviews from './UpcomingInterviews';
import EmployerCompanyCard from './EmployerCompanyCard';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

interface EmployerDashboardProps {
  dashboard: EmployerDashboardData;
}

export default function EmployerDashboard({ dashboard }: EmployerDashboardProps) {
  const { user, company, profile, stats, analytics, recentJobs, recentApplications, upcomingInterviews } =
    dashboard;

  // Ref for the stats container to control button-assisted scrolling
  const statsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to selectively show/hide hover arrows
  const checkScroll = () => {
    const el = statsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = statsScrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = statsScrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 md:px-4 py-6 lg:px-8">
      {/* Hero Header Banner */}
      <EmployerProfileHero user={user} company={company} profile={profile} />

      {/* KPI Stats Section with Hover Revealed Scroll Buttons */}
      <div className="group/scroll relative">
        {/* Left Scroll Button (Revealed on Hover) */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="absolute -left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-md transition-all duration-200 opacity-0 group-hover/scroll:opacity-100 hover:bg-accent hover:scale-110 active:scale-95">
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* Right Scroll Button (Revealed on Hover) */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="absolute -right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-md transition-all duration-200 opacity-0 group-hover/scroll:opacity-100 hover:bg-accent hover:scale-110 active:scale-95">
            <ChevronRight className="size-5" />
          </button>
        )}

        {/* Scrollable Container Wrapper */}
        <div ref={statsScrollRef} className="overflow-x-auto scrollbar-none">
          <EmployerStats stats={stats} applicationTrend={analytics.applicationTrend} />
        </div>
      </div>

      {/* Analytics Section */}
      <div className="rounded-3xl border border-border/60 bg-card/50 p-1 shadow-2xs backdrop-blur-xs">
        <EmployerAnalytics analytics={analytics} />
      </div>

      {/* Main Content Layout: Jobs Feed + Company Snapshot Card */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <RecentJobs jobs={recentJobs} />
        </div>

        <div className="min-w-0">
          <EmployerCompanyCard company={company} stats={stats} profile={profile} />
        </div>
      </section>

      {/* Applications + Upcoming Interviews Feed */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <RecentApplications applications={recentApplications} />
        </div>

        <div className="min-w-0">
          <UpcomingInterviews interviews={upcomingInterviews} />
        </div>
      </section>
    </div>
  );
}
