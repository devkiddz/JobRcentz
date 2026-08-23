'use client';

import Link from 'next/link';

import {
  ArrowUpRight,
  Edit3,
  ExternalLink,
  FolderKanban,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { SocialIcon } from '@/components/icons/SocialIcons';

interface PortfolioProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string | null;
    skills: string[];
    projectUrl: string | null;
    githubUrl: string | null;
    coverImageUrl?: string | null;
    previewImageUrl?: string | null;
    previewImageSource?: string | null;
    visibility?: string;
    status?: string;
    featured?: boolean;
    likesCount: number;
    commentsCount: number;
    averageRating?: number;
    ratingCount?: number;
  };
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function openExternalUrl(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function PortfolioProjectCard({ project }: PortfolioProjectCardProps) {
  const preview = project.previewImageUrl ?? project.coverImageUrl;

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Preview */}

      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {preview ? (
          <img
            src={preview}
            alt={`${project.title} preview`}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="relative flex size-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="flex size-12 items-center justify-center rounded-2xl border bg-background/70 shadow-sm backdrop-blur">
                <FolderKanban className="size-5" />
              </div>

              <span className="text-xs font-medium">Project preview</span>
            </div>
          </div>
        )}

        {/* Overlay */}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {project.category && (
              <span className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                {project.category}
              </span>
            )}

            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                <Sparkles className="size-3" />
                Featured
              </span>
            )}
          </div>

          {project.status && (
            <span className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              {formatLabel(project.status)}
            </span>
          )}
        </div>

        {!preview && project.projectUrl && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              <Sparkles className="size-3" />
              Preview coming soon
            </span>
          </div>
        )}
      </div>

      {/* Content */}

      <div className="p-5">
        {/* Heading */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight">{project.title}</h2>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
          </div>

          <Link
            href={`/dashboard/portfolio/${project.id}/edit`}
            aria-label={`Edit ${project.title}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background transition hover:bg-muted">
            <Edit3 className="size-4" />
          </Link>
        </div>

        {/* Skills */}

        {project.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.skills.slice(0, 5).map(skill => (
              <span key={skill} className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium">
                {skill}
              </span>
            ))}

            {project.skills.length > 5 && (
              <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                +{project.skills.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Stats */}

        <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Heart className="size-3.5" />
            {project.likesCount}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="size-3.5" />
            {project.commentsCount}
          </span>

          {project.ratingCount !== undefined && project.ratingCount > 0 && (
            <span>
              {(project.averageRating ?? 0).toFixed(1)}
              {' · '}
              {project.ratingCount} ratings
            </span>
          )}
        </div>

        {/* Actions */}

        <div className="mt-5 flex items-center gap-2 border-t pt-4">
          {project.projectUrl ? (
            <Button
              type="button"
              size="sm"
              className="flex-1"
              onClick={() => openExternalUrl(project.projectUrl!)}>
              View Project
              <ExternalLink className="size-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              className="flex-1"
              onClick={() => window.location.assign(`/dashboard/portfolio/${project.id}/edit`)}>
              Complete Project
              <ArrowUpRight className="size-3.5" />
            </Button>
          )}

          {project.githubUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => openExternalUrl(project.githubUrl!)}
              aria-label={`View ${project.title} GitHub repository`}>
              <SocialIcon platform="github" className="size-4" />

              <span className="hidden sm:inline">Code</span>
            </Button>
          )}

          {!project.projectUrl && !project.githubUrl && (
            <Button type="button" variant="outline" size="sm" aria-label="More project options">
              <MoreHorizontal className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
