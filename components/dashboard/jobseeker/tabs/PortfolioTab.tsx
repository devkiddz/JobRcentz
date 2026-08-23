'use client';

import { useState } from 'react';
import { FolderKanban, Plus, Sparkles } from 'lucide-react';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

import { Button } from '@/components/ui/button';
import PortfolioProjectForm from '@/app/(dashboard)/dashboard/portfolio/PortfolioProjectForm';
import PortfolioProjectCard from '@/features/jobseeker/portfolio/components/PortfolioProjectCard';

// import PortfolioProjectForm from '@/components/dashboard/portfolio/PortfolioProjectForm';
// import PortfolioProjectCard from '@/components/dashboard/portfolio/PortfolioProjectCard';

interface PortfolioTabProps {
  dashboard: JobSeekerDashboardData;
}

export default function PortfolioTab({ dashboard }: PortfolioTabProps) {
  const [showForm, setShowForm] = useState(false);

  const projects = dashboard.portfolioProjects;

  return (
    <div className="space-y-7">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderKanban className="size-4" />
            </div>

            <p className="text-sm font-semibold">Portfolio</p>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">Your work, presented professionally.</h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Showcase the projects, products and technical work that demonstrate what you can do.
          </p>
        </div>

        <Button type="button" onClick={() => setShowForm(current => !current)} className="shrink-0">
          <Plus className="size-4" />

          {showForm ? 'Close form' : 'Add project'}
        </Button>
      </div>

      {/* Portfolio creation form */}

      {showForm && (
        <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>

            <div>
              <h3 className="font-semibold">Add a portfolio project</h3>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Tell employers what you built and why the work matters.
              </p>
            </div>
          </div>

          <PortfolioProjectForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* Empty state */}

      {projects.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed bg-muted/10 px-6 py-14 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-background shadow-sm">
            <FolderKanban className="size-6 text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-lg font-semibold">Your portfolio is waiting for its first project.</h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Add a project to show employers the products, applications and technical work you have created.
          </p>

          <Button type="button" className="mt-5" onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Add your first project
          </Button>
        </div>
      )}

      {/* Projects */}

      {projects.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Projects</p>

              <p className="text-xs text-muted-foreground">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map(project => (
              <PortfolioProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
