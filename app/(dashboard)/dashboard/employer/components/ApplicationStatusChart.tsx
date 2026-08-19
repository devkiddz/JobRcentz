'use client';

import { Cell, Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

const config = {
  pending: { label: 'Pending', color: 'hsl(var(--chart-1))' },
  reviewing: { label: 'Reviewing', color: 'hsl(var(--chart-2))' },
  shortlisted: { label: 'Shortlisted', color: 'hsl(var(--chart-3))' },
  interview: { label: 'Interview', color: 'hsl(var(--chart-4))' },
  hired: { label: 'Hired', color: 'hsl(var(--chart-5))' },
  rejected: { label: 'Rejected', color: 'hsl(var(--destructive))' },
  withdrawn: { label: 'Withdrawn', color: 'hsl(var(--muted-foreground))' }
} satisfies ChartConfig;

const keyMap: Record<string, keyof typeof config> = {
  Pending: 'pending',
  Reviewing: 'reviewing',
  Shortlisted: 'shortlisted',
  Interview: 'interview',
  Hired: 'hired',
  Rejected: 'rejected',
  Withdrawn: 'withdrawn'
};

export default function ApplicationStatusChart({
  data
}: {
  data: EmployerDashboardData['analytics']['applicationStatus'];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-3">
        <h3 className="font-semibold">Application pipeline</h3>
        <p className="text-sm text-muted-foreground">Current distribution by application status.</p>
      </div>

      {total === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No applications yet.
        </div>
      ) : (
        <ChartContainer config={config} className="h-[280px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={2}
              strokeWidth={2}
            >
              {data.map(item => {
                const key = keyMap[item.status];
                return <Cell key={item.status} fill={`var(--color-${key})`} />;
              })}
            </Pie>
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
}
