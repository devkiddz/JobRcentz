import { redirect } from 'next/navigation';
import { FolderKanban } from 'lucide-react';

import { getOnboardingState } from '@/server/actions/getOnboardingState';
import { prisma } from '@/server/db/prisma';
import PortfolioProjectForm from './PortfolioProjectForm';

export default async function PortfolioPage() {
  const state = await getOnboardingState();
  if (state.user.role !== 'JOB_SEEKER' || !state.jobSeeker) redirect('/dashboard');

  const projects = await prisma.portfolioProject.findMany({
    where: { profileId: state.jobSeeker.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, description: true, category: true, skills: true, projectUrl: true, githubUrl: true, likesCount: true, commentsCount: true }
  });

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Professional profile</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Portfolio</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Publish projects employers can discover and discuss.</p>
        </div>
        <PortfolioProjectForm compact />
      </header>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.length ? projects.map(project => (
            <article key={project.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <p className="text-xs font-medium text-primary">{project.category ?? 'Project'}</p>
              <h2 className="mt-1 text-lg font-semibold">{project.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{project.skills.map(skill => <span key={skill} className="rounded-md bg-muted px-2 py-1 text-xs">{skill}</span>)}</div>
              <p className="mt-4 text-xs text-muted-foreground">{project.likesCount} likes · {project.commentsCount} comments</p>
            </article>
          )) : <div className="col-span-full rounded-2xl border border-dashed bg-card p-10 text-center"><FolderKanban className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-3 font-semibold">Add your first project</h2><p className="mt-1 text-sm text-muted-foreground">Show employers work you are proud of.</p></div>}
        </div>
        <aside className="rounded-2xl border bg-card p-5"><h2 className="font-semibold">Publish a project</h2><p className="mt-1 text-sm text-muted-foreground">Projects are public by default and can receive likes and comments.</p><div className="mt-5"><PortfolioProjectForm /></div></aside>
      </section>
    </main>
  );
}
