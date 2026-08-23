'use client';

import type { ReactNode } from 'react';
import { BriefcaseBusiness, FileText, MapPin, UserRound } from 'lucide-react';

import { SocialIcon } from '@/components/icons/SocialIcons';

import type { JobSeekerDashboardData } from '@/server/actions/dashboard/jobseeker/getJobSeekerDashboard';

interface AboutTabProps {
  dashboard: JobSeekerDashboardData;
}

export default function AboutTab({ dashboard }: AboutTabProps) {
  const { profile, user } = dashboard;

  const hasProfessionalLinks =
    Boolean(profile.linkedin) || Boolean(profile.github) || Boolean(profile.x) || Boolean(profile.cvUrl);

  return (
    <section className="space-y-7">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div>
        <p className="text-sm font-medium text-primary">Professional profile</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight">About {user.name}</h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Your professional story, experience, skills and public profile information.
        </p>
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        {/* =======================================================
            LEFT COLUMN
        ======================================================= */}

        <div className="space-y-5">
          {/* Professional Summary */}

          <section className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <UserRound className="size-4 text-primary" />

              <h3 className="font-semibold">Professional summary</h3>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {profile.bio || 'No professional biography has been added yet.'}
            </p>
          </section>

          {/* Experience */}

          <section className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="size-4 text-primary" />

              <h3 className="font-semibold">Experience</h3>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Current role"
                value={profile.currentRole || profile.headline || 'Not specified'}
              />

              <InfoItem
                label="Experience"
                value={
                  profile.yearsOfExperience !== null && profile.yearsOfExperience !== undefined
                    ? `${profile.yearsOfExperience} ${profile.yearsOfExperience === 1 ? 'year' : 'years'}`
                    : 'Not specified'
                }
              />

              <InfoItem
                label="Location"
                value={profile.location || 'Not specified'}
                icon={<MapPin className="size-3.5" />}
              />

              <InfoItem
                label="Profile status"
                value={profile.isDiscoverable ? 'Discoverable' : 'Hidden from discovery'}
              />
            </div>
          </section>
        </div>

        {/* =======================================================
            RIGHT COLUMN
        ======================================================= */}

        <div className="space-y-5">
          {/* Skills */}

          <section className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">Skills</h3>

              {profile.skills.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {profile.skills.length} {profile.skills.length === 1 ? 'skill' : 'skills'}
                </span>
              )}
            </div>

            {profile.skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No skills added yet.</p>
            )}
          </section>

          {/* Professional Links */}

          <section className="rounded-2xl border bg-card p-5">
            <div>
              <h3 className="font-semibold">Professional links</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Your public professional profiles and resume.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {profile.linkedin && (
                <ExternalProfileLink
                  icon={<SocialIcon platform="linkedin" className="size-4" />}
                  label="LinkedIn"
                  href={profile.linkedin}
                />
              )}

              {profile.github && (
                <ExternalProfileLink
                  icon={<SocialIcon platform="github" className="size-4" />}
                  label="GitHub"
                  href={profile.github}
                />
              )}

              {profile.x && (
                <ExternalProfileLink
                  icon={<SocialIcon platform="x" className="size-4" />}
                  label="X"
                  href={profile.x}
                />
              )}

              {profile.cvUrl && (
                <ExternalProfileLink
                  icon={<FileText className="size-4" />}
                  label={profile.cvName || 'CV / Resume'}
                  href={profile.cvUrl}
                />
              )}

              {!hasProfessionalLinks && (
                <p className="text-sm text-muted-foreground">No professional links have been added yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   INFO ITEM
============================================================= */

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {value}
      </p>
    </div>
  );
}

/* =============================================================
   EXTERNAL PROFILE LINK
============================================================= */

function ExternalProfileLink({ icon, label, href }: { icon: ReactNode; label: string; href: string }) {
  return (
    <button
      type="button"
      onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
      className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:bg-muted">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">{icon}</span>

      <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
    </button>
  );
}
