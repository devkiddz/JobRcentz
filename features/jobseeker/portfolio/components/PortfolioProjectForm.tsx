'use client';

import { useActionState } from 'react';
import { ArrowUpRight, Globe, Plus, Sparkles } from 'lucide-react';

import { createPortfolioProject } from '@/server/actions/dashboard/portfolio/createPortfolioProject';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SocialIcon } from '@/components/icons/SocialIcons';

interface PortfolioProjectFormProps {
  compact?: boolean;
}

export default function PortfolioProjectForm({ compact = false }: PortfolioProjectFormProps) {
  const [state, action, pending] = useActionState(createPortfolioProject, null);

  if (compact) {
    return (
      <Button type="button" onClick={() => document.getElementById('portfolio-title')?.focus()}>
        <Plus className="size-4" />
        Add project
      </Button>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <div>
        <p className="text-sm font-semibold">Project details</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Give employers enough context to understand what you built and the value of your work.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="portfolio-title" className="text-sm font-medium">
          Project title
        </label>

        <Input id="portfolio-title" name="title" required placeholder="e.g. Job Rcentz" />
      </div>

      <div className="space-y-2">
        <label htmlFor="portfolio-description" className="text-sm font-medium">
          Description
        </label>

        <Textarea
          id="portfolio-description"
          name="description"
          required
          rows={5}
          placeholder="What did you build, what problem did it solve, and what was your contribution?"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="portfolio-category" className="text-sm font-medium">
            Category
          </label>

          <Input id="portfolio-category" name="category" placeholder="Web Application" />
        </div>

        <div className="space-y-2">
          <label htmlFor="portfolio-skills" className="text-sm font-medium">
            Skills
          </label>

          <Input id="portfolio-skills" name="skills" placeholder="Next.js, TypeScript, Prisma" />

          <p className="text-[11px] text-muted-foreground">Separate skills with commas.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>

          <div>
            <p className="text-sm font-medium">Project preview</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Add your live project URL and we’ll use it later to generate a visual preview for your portfolio
              card.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="portfolio-project-url" className="flex items-center gap-2 text-sm font-medium">
            <Globe className="size-4 text-muted-foreground" />
            Live project
          </label>

          <Input
            id="portfolio-project-url"
            name="projectUrl"
            type="url"
            placeholder="https://your-project.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="portfolio-github-url" className="flex items-center gap-2 text-sm font-medium">
            <SocialIcon platform="github" className="size-4" />
            GitHub repository
          </label>

          <Input
            id="portfolio-github-url"
            name="githubUrl"
            type="url"
            placeholder="https://github.com/username/project"
          />
        </div>
      </div>

      {state?.error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">Project created successfully.</p>
        </div>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Creating project…' : 'Create project'}

        {!pending && <ArrowUpRight className="size-4" />}
      </Button>
    </form>
  );
}
