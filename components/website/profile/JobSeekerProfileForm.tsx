'use client';

import {
  CheckCircle2,
  FileText,
  Globe,
  ImagePlus,
  Loader2,
  MapPin,
  Save,
  Trash2,
  UserRound,
  X
} from 'lucide-react';

import { saveJobSeekerProfile } from '@/server/actions/onboarding/jobseeker/saveJobSeekerProfile';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

interface ProfileUser {
  id: string;
  name: string;
  email: string;
}

interface ProfileData {
  id: string;
  onboardingStatus: 'PENDING' | 'APPROVED' | 'REJECTED';

  headline: string;
  location: string;
  bio: string;

  currentRole: string | null;
  yearsOfExperience: number | null;

  skills: string[];

  portfolio: string | null;
  linkedin: string | null;
  github: string | null;
  x: string | null;

  profilePhotoUrl: string | null;
  profilePhotoPublicId: string | null;

  cvUrl: string | null;
  cvName: string | null;

  createdAt: Date;
  updatedAt: Date;
}

interface JobSeekerProfileFormProps {
  user: ProfileUser;
  profile: ProfileData;
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('') || 'U'
  );
}

function getStatusLabel(status: ProfileData['onboardingStatus']) {
  switch (status) {
    case 'APPROVED':
      return 'Approved';

    case 'REJECTED':
      return 'Needs revision';

    case 'PENDING':
      return 'Under review';

    default:
      return status;
  }
}

function getStatusVariant(status: ProfileData['onboardingStatus']) {
  switch (status) {
    case 'APPROVED':
      return 'default' as const;

    case 'REJECTED':
      return 'destructive' as const;

    default:
      return 'secondary' as const;
  }
}

export default function JobSeekerProfileForm({ user, profile }: JobSeekerProfileFormProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [profilePhotoPreview, setProfilePhotoPreview] = React.useState<string | null>(
    profile.profilePhotoUrl
  );

  const [removeProfilePhoto, setRemoveProfilePhoto] = React.useState(false);

  const [removeCv, setRemoveCv] = React.useState(false);

  const [skills, setSkills] = React.useState<string[]>(profile.skills ?? []);

  const [skillInput, setSkillInput] = React.useState('');

  const initials = getInitials(user.name);

  function addSkill() {
    const value = skillInput.trim();

    if (!value) return;

    const exists = skills.some(skill => skill.toLowerCase() === value.toLowerCase());

    if (exists) {
      setSkillInput('');
      return;
    }

    setSkills(current => [...current, value]);
    setSkillInput('');
  }

  function removeSkill(skill: string) {
    setSkills(current => current.filter(item => item !== skill));
  }

  function handleSkillKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addSkill();
    }
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setRemoveProfilePhoto(false);

    const preview = URL.createObjectURL(file);
    setProfilePhotoPreview(preview);
  }

  function clearPhoto() {
    setProfilePhotoPreview(null);
    setRemoveProfilePhoto(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setSaveMessage(null);
    setErrorMessage(null);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      formData.set('skills', skills.join(','));

      formData.set('removeProfilePhoto', String(removeProfilePhoto));

      formData.set('removeCv', String(removeCv));

      const result = await saveJobSeekerProfile(formData);

      if (!result.success) {
        throw new Error('Unable to save profile.');
      }

      setSaveMessage(result.message);

      /*
       * A successful save means the newly uploaded photo is now
       * authoritative. Reset the removal state.
       */
      setRemoveProfilePhoto(false);
      setRemoveCv(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong while saving your profile.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* =========================================================
          PROFILE HEADER
      ========================================================= */}

      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />

        <div className="-mt-10 flex flex-col gap-5 px-5 pb-6 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative">
                <Avatar className="size-20 border-4 border-card shadow-sm">
                  <AvatarImage src={profilePhotoPreview ?? undefined} alt={`${user.name}'s profile`} />

                  <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                    {initials || <UserRound className="size-7" />}
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="profilePhoto"
                  className="absolute bottom-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted"
                  title="Change profile photo">
                  <ImagePlus className="size-3.5" />

                  <input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="truncate text-xl font-semibold">{user.name}</h2>

                <p className="truncate text-sm text-muted-foreground">
                  {profile.currentRole ?? profile.headline ?? 'Job Seeker'}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={getStatusVariant(profile.onboardingStatus)}>
                    {getStatusLabel(profile.onboardingStatus)}
                  </Badge>

                  {profile.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {profilePhotoPreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearPhoto}
                className="self-start text-destructive hover:bg-destructive/10 hover:text-destructive sm:self-end">
                <Trash2 className="mr-2 size-4" />
                Remove photo
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          PERSONAL / PROFESSIONAL INFORMATION
      ========================================================= */}

      <section className="rounded-2xl border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="font-semibold">Professional Information</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            This information forms the core of your public JobMan professional identity.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>

            <Input
              id="fullName"
              name="fullName"
              defaultValue={user.name}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>

            <Input
              id="location"
              name="location"
              defaultValue={profile.location}
              placeholder="Warri, Delta State"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Professional headline</Label>

            <Input
              id="headline"
              name="headline"
              defaultValue={profile.headline}
              placeholder="Frontend Developer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentRole">Current role</Label>

            <Input
              id="currentRole"
              name="currentRole"
              defaultValue={profile.currentRole ?? ''}
              placeholder="Software Engineer"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="yearsOfExperience">Years of experience</Label>

            <Input
              id="yearsOfExperience"
              name="yearsOfExperience"
              type="number"
              min="0"
              max="100"
              defaultValue={profile.yearsOfExperience ?? ''}
              placeholder="3"
              className="md:max-w-xs"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Professional bio</Label>

            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio}
              placeholder="Tell employers about your professional experience, strengths and goals..."
              className="min-h-32 resize-y"
              required
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          SKILLS
      ========================================================= */}

      <section className="rounded-2xl border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="font-semibold">Skills</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add technologies, professional skills and areas of expertise.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={event => setSkillInput(event.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="e.g. React, TypeScript, PostgreSQL"
            />

            <Button type="button" variant="secondary" onClick={addSkill}>
              Add
            </Button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-3 py-1.5 text-sm">
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    aria-label={`Remove ${skill}`}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          )}
        </div>
      </section>

      {/* =========================================================
          PORTFOLIO & SOCIALS
      ========================================================= */}

      <section className="rounded-2xl border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="font-semibold">Portfolio & Social Profiles</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Give employers somewhere to see your work and professional presence.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio URL</Label>

            <Input
              id="portfolio"
              name="portfolio"
              type="url"
              defaultValue={profile.portfolio ?? ''}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Globe className="size-4" />
              LinkedIn
            </Label>

            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              defaultValue={profile.linkedin ?? ''}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Globe className="size-4" />
              GitHub
            </Label>

            <Input
              id="github"
              name="github"
              type="url"
              defaultValue={profile.github ?? ''}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="x">X / Twitter</Label>

            <Input
              id="x"
              name="x"
              type="url"
              defaultValue={profile.x ?? ''}
              placeholder="https://x.com/username"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          CV
      ========================================================= */}

      <section className="rounded-2xl border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="font-semibold">Resume / CV</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Keep a current CV available for job applications.
          </p>
        </div>

        {profile.cvUrl && !removeCv ? (
          <div className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <FileText className="size-5 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{profile.cvName ?? 'Current CV'}</p>

                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline">
                  View current CV
                </a>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setRemoveCv(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="mr-2 size-4" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              {removeCv ? 'Current CV will be removed' : 'No CV uploaded'}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">Upload a PDF or supported document below.</p>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <Label htmlFor="cv">{profile.cvUrl ? 'Replace CV' : 'Upload CV'}</Label>

          <Input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" />
        </div>
      </section>

      {/* =========================================================
          SAVE
      ========================================================= */}

      <section className="sticky bottom-4 z-10 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {saveMessage && (
              <p className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle2 className="size-4 shrink-0" />
                {saveMessage}
              </p>
            )}

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

            {!saveMessage && !errorMessage && (
              <p className="text-xs text-muted-foreground">
                Changes are saved to your JobMan professional profile.
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSaving} className="min-w-32">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </section>
    </form>
  );
}
