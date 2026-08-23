interface AnalyticsPeriodSummaryProps {
  today: number;
  week: number;
  month: number;
}

export default function AnalyticsPeriodSummary({ today, week, month }: AnalyticsPeriodSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <AnalyticsPeriodCard label="Today" value={today} />

      <AnalyticsPeriodCard label="This Week" value={week} />

      <AnalyticsPeriodCard label="This Month" value={month} />
    </div>
  );
}

interface AnalyticsPeriodCardProps {
  label: string;
  value: number;
}

function AnalyticsPeriodCard({ label, value }: AnalyticsPeriodCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-2 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">Profile views</p>
    </div>
  );
}
