'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  TrendingUp,
  UserCheck,
  Users
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const icons = {
  briefcase: BriefcaseBusiness,
  file: FileText,
  clock: Clock3,
  users: Users,
  trending: TrendingUp,
  check: CheckCircle2,
  userCheck: UserCheck
} satisfies Record<string, LucideIcon>;

type MetricIcon = keyof typeof icons;

interface MetricCardProps {
  label: string;
  value: number;
  context: string;
  icon: MetricIcon;
  contextIcon?: MetricIcon;
  href: string;
  visual?: ReactNode;
}

export default function MetricCard({
  label,
  value,
  context,
  icon,
  contextIcon,
  href,
  visual
}: MetricCardProps) {
  const Icon = icons[icon];
  const ContextIcon = contextIcon ? icons[contextIcon] : null;

  return (
    <Link
      href={href}
      className="group block rounded-xl border bg-card p-4 shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-5">
      <article>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{value.toLocaleString()}</p>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
            <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          {ContextIcon && <ContextIcon className="size-3.5 shrink-0" />}
          <span className="truncate">{context}</span>
        </div>

        {visual && <div className="mt-4">{visual}</div>}

        <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs">
          <span className="text-muted-foreground transition-colors group-hover:text-foreground">
            View details
          </span>

          <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
      </article>
    </Link>
  );
}
