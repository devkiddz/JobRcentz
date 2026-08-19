'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

const config = {
  applications: {
    label: 'Applications',
    color: 'hsl(var(--primary))'
  }
} satisfies ChartConfig;

export default function ApplicationTrendChart({
  data
}: {
  data: EmployerDashboardData['analytics']['applicationTrend'];
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold">Application activity</h3>
        <p className="text-sm text-muted-foreground">Applications received during the last 30 days.</p>
      </div>

      <ChartContainer config={config} className="h-[280px] w-full">
        <LineChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="var(--color-applications)"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
