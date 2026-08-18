import { BriefcaseBusiness, FileText, Users, Clock3 } from 'lucide-react';

import type { EmployerDashboardData } from '@/server/actions/dashboard/employer/getEmployerDashboard';

interface EmployerStatsProps {
  stats: EmployerDashboardData['stats'];
}

export default function EmployerStats({ stats }: EmployerStatsProps) {
  const items = [
    {
      label: 'Total Jobs',
      value: stats.jobs.total,
      icon: BriefcaseBusiness
    },
    {
      label: 'Published',
      value: stats.jobs.published,
      icon: FileText
    },
    {
      label: 'Drafts',
      value: stats.jobs.drafts,
      icon: Clock3
    },
    {
      label: 'Applications',
      value: stats.applications.total,
      icon: Users
    }
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(item => {
        const Icon = item.icon;

        return (
          <div key={item.label} className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>

                <p className="mt-2 text-3xl font-bold tracking-tight">{item.value}</p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
