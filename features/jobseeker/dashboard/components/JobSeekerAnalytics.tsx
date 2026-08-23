'use client';

import { Activity } from 'lucide-react';

import type { JobSeekerAnalyticsData } from '@/server/actions/dashboard/jobseeker/getJobSeekerAnalytics';

import AnalyticsOverview from './AnalyticsOverview';
import ProfileViewsChart from './ProfileViewsChart';
import AnalyticsPeriodSummary from './AnalyticsPeriodSummary';

interface JobSeekerAnalyticsProps {
  analytics: JobSeekerAnalyticsData;
}

export default function JobSeekerAnalytics({ analytics }: JobSeekerAnalyticsProps) {
  const { stats, chart } = analytics;

  return (
    <section className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div>
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-primary" />

          <h2 className="text-xl font-semibold tracking-tight">Dashboard Analytics</h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Understand how employers are discovering and engaging with your professional profile.
        </p>
      </div>

      {/* =========================================================
          OVERVIEW
      ========================================================= */}

      <AnalyticsOverview stats={stats} />

      {/* =========================================================
          PROFILE VIEWS
      ========================================================= */}

      <ProfileViewsChart data={chart.data} peakViews={chart.peakViews} />

      {/* =========================================================
          PERIOD SUMMARY
      ========================================================= */}

      <AnalyticsPeriodSummary today={stats.todayViews} week={stats.weekViews} month={stats.monthViews} />
    </section>
  );
}
