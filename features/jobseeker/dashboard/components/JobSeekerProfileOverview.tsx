import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  Lightbulb,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface JobSeekerProfileOverviewProps {
  tasks?: number;
  unreadMessages?: number;
  pendingApplications?: number;
  profileCompletion?: number;
}

interface ActionItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  count?: number;
  active?: boolean;
}

function ActionItem({ icon: Icon, title, description, href, count, active = false }: ActionItemProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border bg-background/70 p-3.5 transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm">
      {/* Icon */}

      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" />

        {active && (
          <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />

            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
        )}
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{title}</p>

          {count !== undefined && count > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {count}
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
      </div>

      {/* Arrow */}

      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

export default function JobSeekerProfileOverview({
  tasks = 0,
  unreadMessages = 0,
  pendingApplications = 0,
  profileCompletion = 100
}: JobSeekerProfileOverviewProps) {
  return (
    <section className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm xl:block">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="border-b px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="size-4 text-primary" />
              </div>

              <h2 className="font-semibold tracking-tight">Your Workspace</h2>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              A quick look at things that may need your attention.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          ACTIONS
      ============================================================ */}

      <div className="space-y-2.5 p-4">
        <ActionItem
          icon={ClipboardCheck}
          title="Active Tasks"
          description={
            tasks > 0 ? 'You have tasks waiting for your attention.' : 'You have no outstanding tasks.'
          }
          href="/dashboard/tasks"
          count={tasks}
          active={tasks > 0}
        />

        <ActionItem
          icon={MessageSquare}
          title="Messages"
          description={unreadMessages > 0 ? 'You have unread conversations.' : 'No new messages right now.'}
          href="/dashboard/messages"
          count={unreadMessages}
          active={unreadMessages > 0}
        />

        <ActionItem
          icon={CircleCheck}
          title="Applications"
          description={
            pendingApplications > 0
              ? 'Applications are currently being processed.'
              : 'No applications awaiting your attention.'
          }
          href="/dashboard/applications"
          count={pendingApplications}
          active={pendingApplications > 0}
        />
      </div>

      {/* ============================================================
          PROFILE HEALTH
      ============================================================ */}

      <div className="mx-4 mb-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
            <CheckCircle2 className="size-4 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Profile strength</p>

              <span className="text-xs font-semibold">{profileCompletion}%</span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min(Math.max(profileCompletion, 0), 100)}%`
                }}
              />
            </div>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {profileCompletion >= 90
                ? 'Your profile is looking strong. Keep it updated.'
                : 'Complete more of your profile to improve your visibility to employers.'}
            </p>
          </div>
        </div>

        {profileCompletion < 100 && (
          <Link
            href="/dashboard/profile"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Improve profile
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      {/* ============================================================
          TIP
      ============================================================ */}

      <div className="border-t px-5 py-4">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
            <Lightbulb className="size-4" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Career Tip</p>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Keep your portfolio projects and skills updated as you gain new experience. Employers often
              review these before reaching out.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
