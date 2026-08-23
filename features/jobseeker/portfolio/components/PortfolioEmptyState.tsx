import { ArrowRight, FolderKanban, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PortfolioEmptyStateProps {
  onAddProject?: () => void;
}

export default function PortfolioEmptyState({ onAddProject }: PortfolioEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FolderKanban className="size-6" />
      </div>

      <h2 className="mt-5 text-lg font-semibold">Build your professional portfolio</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Showcase real projects, technical skills, and work you are proud of. A strong portfolio gives
        employers something concrete to evaluate beyond your CV.
      </p>

      <div className="mx-auto mt-6 grid max-w-lg gap-3 text-left sm:grid-cols-3">
        <div className="rounded-xl border bg-muted/30 p-3">
          <FolderKanban className="size-4 text-primary" />
          <p className="mt-2 text-xs font-medium">Showcase work</p>
        </div>

        <div className="rounded-xl border bg-muted/30 p-3">
          <Sparkles className="size-4 text-primary" />
          <p className="mt-2 text-xs font-medium">Visual previews</p>
        </div>

        <div className="rounded-xl border bg-muted/30 p-3">
          <ArrowRight className="size-4 text-primary" />
          <p className="mt-2 text-xs font-medium">Get discovered</p>
        </div>
      </div>

      {onAddProject && (
        <Button type="button" className="mt-7" onClick={onAddProject}>
          Add your first project
          <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
