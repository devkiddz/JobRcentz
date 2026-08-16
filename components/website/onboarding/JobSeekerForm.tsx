'use client';

import React, { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BriefcaseBusiness, FileText, Globe, ImagePlus, Loader2, Upload, UserRound } from 'lucide-react';
import { saveJobSeekerProfile } from '@/server/actions/onboarding/saveJobSeekerProfile';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import BackButton from '../BackButton';
import { LocationPicker } from './LocationPicker';

import { JOB_SEEKER_FORM_SCHEMA, type JobSeekerFormValues } from '@/server/utils/zodSchemas';

import type { JobSeekerProfileData } from '@/server/actions/onboarding/getJobSeekerProfile';

interface JobSeekerFormProps {
  onBack: () => void;
  initialProfile: JobSeekerProfileData;
}

const ICON_CLASS = 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground';

const SOCIAL_ICON_CLASS = 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground';

export default function JobSeekerForm({ onBack, initialProfile }: JobSeekerFormProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const existingProfile = initialProfile.profile;
  const initialPhotoUrl = existingProfile?.profilePhotoUrl ?? null;

  const initialCvName = existingProfile?.cvName ?? null;

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [cvRemoved, setCvRemoved] = useState(false);

  const form = useForm<JobSeekerFormValues>({
    resolver: zodResolver(JOB_SEEKER_FORM_SCHEMA),

    defaultValues: {
      fullName: initialProfile.user.name ?? '',

      headline: existingProfile?.headline ?? '',

      location: existingProfile?.location ?? '',

      bio: existingProfile?.bio ?? '',

      currentRole: existingProfile?.currentRole ?? '',

      yearsOfExperience:
        existingProfile?.yearsOfExperience != null ? String(existingProfile.yearsOfExperience) : '',

      skills: existingProfile?.skills?.join(', ') ?? '',

      portfolio: existingProfile?.portfolio ?? '',

      linkedin: existingProfile?.linkedin ?? '',

      github: existingProfile?.github ?? '',

      x: existingProfile?.x ?? '',

      profilePhoto: undefined,

      cv: undefined
    }
  });

  const cv = form.watch('cv');

  const displayedPhoto = photoPreview ?? (!photoRemoved ? initialPhotoUrl : null);

  const displayedCvName = cv?.name ?? (!cvRemoved ? initialCvName : null);

  /* ========================================================================= */
  /* Photo preview cleanup                                                     */
  /* ========================================================================= */

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  /* ========================================================================= */
  /* Submit                                                                    */
  /* ========================================================================= */

  async function onSubmit(values: JobSeekerFormValues) {
    try {
      const formData = new FormData();

      formData.append('fullName', values.fullName);
      formData.append('headline', values.headline);
      formData.append('location', values.location);
      formData.append('bio', values.bio);

      formData.append('currentRole', values.currentRole ?? '');
      formData.append('yearsOfExperience', values.yearsOfExperience ?? '');

      formData.append('skills', values.skills ?? '');

      formData.append('portfolio', values.portfolio ?? '');
      formData.append('linkedin', values.linkedin ?? '');
      formData.append('github', values.github ?? '');
      formData.append('x', values.x ?? '');

      formData.append('removeProfilePhoto', String(photoRemoved));

      formData.append('removeCv', String(cvRemoved));

      if (values.profilePhoto instanceof File) {
        formData.append('profilePhoto', values.profilePhoto);
      }

      if (values.cv instanceof File) {
        formData.append('cv', values.cv);
      }

      const result = await saveJobSeekerProfile(formData);

      console.log(result);
    } catch (error) {
      console.error('Job seeker profile submission failed:', error);
    }
  }

  /* ========================================================================= */
  /* Photo                                                                     */
  /* ========================================================================= */

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    form.setValue('profilePhoto', file, {
      shouldValidate: true,
      shouldDirty: true
    });

    setPhotoPreview(previewUrl);
    setPhotoRemoved(false);
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    form.setValue('profilePhoto', undefined, {
      shouldValidate: true,
      shouldDirty: true
    });

    setPhotoPreview(null);
    setPhotoRemoved(true);

    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  }

  /* ========================================================================= */
  /* CV                                                                        */
  /* ========================================================================= */

  function handleCvChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    form.setValue('cv', file, {
      shouldValidate: true,
      shouldDirty: true
    });

    setCvRemoved(false);
  }

  function removeCv() {
    form.setValue('cv', undefined, {
      shouldValidate: true,
      shouldDirty: true
    });

    setCvRemoved(true);

    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
  }

  /* ========================================================================= */
  /* Render                                                                    */
  /* ========================================================================= */

  return (
    <div className="w-full max-w-3xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <BackButton onBack={onBack} className="sm:h-11 sm:w-11" />

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <UserRound className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Build your professional profile</h2>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Tell employers who you are, what you do, and what kind of opportunities you are looking for.
        </p>
      </header>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ================================================================= */}
        {/* Professional Information                                          */}
        {/* ================================================================= */}

        <section className="rounded-2xl border border-border/50 bg-background/30 p-5 sm:p-6">
          <SectionHeader
            title="Professional information"
            description="The essentials employers will see about you."
          />

          <div className="space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="text-sm font-medium">Profile photo</label>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
                  {displayedPhoto ? (
                    <img
                      src={displayedPhoto}
                      alt="Profile photo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => photoInputRef.current?.click()}
                      className="h-12 cursor-pointer gap-2">
                      <Upload className="h-4 w-4" />

                      {displayedPhoto ? 'Change photo' : 'Upload photo'}
                    </Button>

                    {displayedPhoto && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={removePhoto}
                        className="h-12 cursor-pointer text-muted-foreground hover:text-destructive">
                        Remove
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">JPEG, PNG or WebP · Maximum 5MB</p>

                  {form.formState.errors.profilePhoto && (
                    <p className="text-xs text-destructive">{form.formState.errors.profilePhoto.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Name / Headline */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Full name" error={form.formState.errors.fullName?.message}>
                <div className="relative">
                  <UserRound className={ICON_CLASS} />

                  <Input {...form.register('fullName')} placeholder="Alex Morgan" className="h-12 pl-10" />
                </div>
              </FormField>

              <FormField label="Professional headline" error={form.formState.errors.headline?.message}>
                <div className="relative">
                  <BriefcaseBusiness className={ICON_CLASS} />

                  <Input
                    {...form.register('headline')}
                    placeholder="Senior Frontend Engineer"
                    className="h-12 pl-10"
                  />
                </div>
              </FormField>
            </div>

            {/* Current Role / Experience */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Current role" optional error={form.formState.errors.currentRole?.message}>
                <div className="relative">
                  <BriefcaseBusiness className={ICON_CLASS} />

                  <Input
                    {...form.register('currentRole')}
                    placeholder="Full Stack Developer at TechCo"
                    className="h-12 pl-10"
                  />
                </div>
              </FormField>

              <FormField
                label="Years of experience"
                optional
                error={form.formState.errors.yearsOfExperience?.message}>
                <Input
                  {...form.register('yearsOfExperience')}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="5"
                  className="h-12"
                />
              </FormField>
            </div>

            {/* Location */}
            <FormField label="Location" error={form.formState.errors.location?.message}>
              <LocationPicker
                value={form.watch('location')}
                onValueChange={value =>
                  form.setValue('location', value, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
                placeholder="Search city, state or country..."
              />
            </FormField>

            {/* Skills */}
            <FormField label="Skills" optional error={form.formState.errors.skills?.message}>
              <Input
                {...form.register('skills')}
                placeholder="React, TypeScript, Next.js, Node.js (comma-separated)"
                className="h-12"
              />
            </FormField>

            {/* Bio */}
            <FormField label="Bio" optional error={form.formState.errors.bio?.message}>
              <Textarea
                {...form.register('bio')}
                placeholder="Brief summary of your professional background, strengths, and interests..."
                className="min-h-32 resize-none"
              />
            </FormField>

            {/* Resume / CV */}
            <div>
              <label className="text-sm font-medium">Resume / CV</label>

              <div className="mt-3 space-y-3">
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleCvChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cvInputRef.current?.click()}
                    className="h-12 cursor-pointer gap-2">
                    <Upload className="h-4 w-4" />

                    {displayedCvName ? 'Replace CV' : 'Upload CV'}
                  </Button>

                  {displayedCvName && (
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs">
                      <FileText className="h-4 w-4 text-primary" />

                      <span className="max-w-[200px] truncate font-medium">{displayedCvName}</span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeCv}
                        className="h-auto p-1 text-muted-foreground hover:text-destructive">
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">PDF, DOC or DOCX · Maximum 10MB</p>

                {form.formState.errors.cv && (
                  <p className="text-xs text-destructive">{form.formState.errors.cv.message}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* Links & Online Presence                                            */}
        {/* ================================================================= */}

        <section className="rounded-2xl border border-border/50 bg-background/30 p-5 sm:p-6">
          <SectionHeader title="Links & presence" description="Share your online profiles and portfolio." />

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Portfolio */}
            <FormField label="Portfolio URL" optional error={form.formState.errors.portfolio?.message}>
              <div className="relative">
                <Globe className={ICON_CLASS} />

                <Input
                  {...form.register('portfolio')}
                  type="url"
                  placeholder="https://yourportfolio.com"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>

            {/* LinkedIn */}
            <FormField label="LinkedIn" optional error={form.formState.errors.linkedin?.message}>
              <div className="relative">
                <LinkedInIcon className={SOCIAL_ICON_CLASS} />

                <Input
                  {...form.register('linkedin')}
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>

            {/* GitHub */}
            <FormField label="GitHub" optional error={form.formState.errors.github?.message}>
              <div className="relative">
                <GitHubIcon className={SOCIAL_ICON_CLASS} />

                <Input
                  {...form.register('github')}
                  type="url"
                  placeholder="https://github.com/username"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>

            {/* X */}
            <FormField label="X (Twitter)" optional error={form.formState.errors.x?.message}>
              <div className="relative">
                <XIcon className={SOCIAL_ICON_CLASS} />

                <Input
                  {...form.register('x')}
                  type="url"
                  placeholder="https://x.com/username"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>
          </div>
        </section>

        {/* ================================================================= */}
        {/* Footer                                                             */}
        {/* ================================================================= */}

        <footer className="border-t border-border/50 pt-6">
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <BackButton onBack={onBack} className="sm:h-11 sm:w-11" />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="h-12 w-full cursor-pointer">
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save profile'
              )}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            You can update your profile details at any time from your account settings.
          </p>
        </footer>
      </form>
    </div>
  );
}

/* ========================================================================= */
/* Social Icons                                                               */
/* ========================================================================= */

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.68H9.35V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.47v6.28ZM5.34 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V8.98H3.56v11.47Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.82L6.08 22H3l7.24-8.28L2.8 2h6.41l4.43 6.21L18.9 2Zm-1.1 17.6h1.73L8.27 4.26H6.42L17.8 19.6Z" />
    </svg>
  );
}

/* ========================================================================= */
/* Section Header                                                             */
/* ========================================================================= */

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

/* ========================================================================= */
/* Form Field                                                                 */
/* ========================================================================= */

function FormField({
  label,
  optional,
  error,
  children
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}

        {optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}
      </label>

      {children}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
