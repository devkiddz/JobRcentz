import { redirect } from 'next/navigation';

import { getOnboardingState } from '@/server/actions/getOnboardingState';
import { prisma } from '@/server/db/prisma';

import PortfolioProjectForm from './PortfolioProjectForm';
import PortfolioProjectCard from '@/features/jobseeker/portfolio/components/PortfolioProjectCard';

export default async function PortfolioPage() {
  const state = await getOnboardingState();

  if (state.user.role !== 'JOB_SEEKER' || !state.jobSeeker) {
    redirect('/dashboard');
  }

  const projects = await prisma.portfolioProject.findMany({
    where: {
      profileId: state.jobSeeker.id
    },
    orderBy: [
      {
        featured: 'desc'
      },
      {
        updatedAt: 'desc'
      }
    ],
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      skills: true,
      projectUrl: true,
      githubUrl: true,
      coverImageUrl: true,
      previewImageUrl: true,
      previewImageSource: true,
      visibility: true,
      status: true,
      featured: true,
      likesCount: true,
      commentsCount: true,
      averageRating: true,
      ratingCount: true
    }
  });

  const publishedProjects = projects.filter(project => project.status === 'PUBLISHED');

  const draftProjects = projects.filter(project => project.status === 'DRAFT');

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary">Professional profile</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Portfolio</h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Showcase the work, skills, and projects you want employers to discover.
          </p>
        </div>

        <PortfolioProjectForm compact />
      </header>

      {/* Summary */}
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Total projects</p>

          <p className="mt-1 text-2xl font-bold">{projects.length}</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Published</p>

          <p className="mt-1 text-2xl font-bold">{publishedProjects.length}</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Drafts</p>

          <p className="mt-1 text-2xl font-bold">{draftProjects.length}</p>
        </div>
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Projects */}
        <div className="min-w-0">
          {projects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map(project => (
                <PortfolioProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-lg font-bold">+</span>
              </div>

              <h2 className="mt-4 font-semibold">Your portfolio is empty</h2>

              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                Add your first project using the form beside this section.
              </p>
            </div>
          )}
        </div>

        {/* Create project */}
        <aside className="min-w-0">
          <div className="sticky top-6 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold">Add a project</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Projects you publish can become part of your professional profile and be discovered by
                employers.
              </p>
            </div>

            <PortfolioProjectForm />
          </div>
        </aside>
      </section>
    </main>
  );
}
