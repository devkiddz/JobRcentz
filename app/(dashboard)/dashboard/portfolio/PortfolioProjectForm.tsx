'use client';

import { useActionState } from 'react';
import { Plus } from 'lucide-react';

import { createPortfolioProject } from '@/server/actions/dashboard/portfolio/createPortfolioProject';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function PortfolioProjectForm({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState(createPortfolioProject, null);
  if (compact) return <Button type="button" onClick={() => document.getElementById('portfolio-title')?.focus()}><Plus className="size-4" /> Add project</Button>;
  return <form action={action} className="space-y-3"><Input id="portfolio-title" name="title" required placeholder="Project title" /><Textarea name="description" required placeholder="What did you build and what was your contribution?" /><Input name="category" placeholder="Category (optional)" /><Input name="skills" placeholder="Skills, separated by commas" /><Input name="projectUrl" type="url" placeholder="Live project URL (optional)" /><Input name="githubUrl" type="url" placeholder="GitHub URL (optional)" />{state?.error && <p className="text-sm text-destructive">{state.error}</p>}<Button type="submit" disabled={pending} className="w-full">{pending ? 'Publishing…' : 'Publish project'}</Button></form>;
}
