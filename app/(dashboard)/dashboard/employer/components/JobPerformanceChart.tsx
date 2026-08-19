'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export default function JobPerformanceChart({
  data
}: {
  data: EmployerDashboardData['analytics']['jobPerformance'];
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold">Job performance</h3>
        <p className="text-sm text-muted-foreground">Jobs ranked by applications received.</p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          Publish a job to start seeing performance data.
        </div>
      ) : (
        <ChartContainer config={config} className="h-[280px] w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} hide />
            <YAxis
              type="category"
              dataKey="title"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="applications"
              fill="var(--color-applications)"
              radius={[0, 5, 5, 0]}
              barSize={22}
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}
