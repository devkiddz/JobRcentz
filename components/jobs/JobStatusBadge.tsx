import { BriefcaseBusiness, CheckCircle2, Clock3, FileText } from 'lucide-react';

type JobStatusBadgeProps = {
  status: string;
  approvalStatus: string;
};

export function JobStatusBadge({ status, approvalStatus }: JobStatusBadgeProps) {
  if (status === 'DRAFT') {
    return <Badge icon={FileText} label="Draft" className="bg-muted text-muted-foreground" />;
  }

  if (status === 'CLOSED') {
    return <Badge icon={BriefcaseBusiness} label="Closed" className="bg-muted text-muted-foreground" />;
  }

  if (approvalStatus === 'APPROVED') {
    return (
      <Badge
        icon={CheckCircle2}
        label="Approved"
        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />
    );
  }

  if (approvalStatus === 'REJECTED') {
    return <Badge icon={FileText} label="Rejected" className="bg-destructive/10 text-destructive" />;
  }

  return (
    <Badge
      icon={Clock3}
      label="Pending Review"
      className="bg-amber-500/10 text-amber-600 dark:text-amber-400"
    />
  );
}

function Badge({
  icon: Icon,
  label,
  className
}: {
  icon: typeof FileText;
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}>
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
