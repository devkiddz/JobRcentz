'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Loader2,
  MapPin,
  Save,
  Send,
  Sparkles,
  X
} from 'lucide-react';

import { updateJob } from '@/server/actions/jobs/updateJob';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitJobForReview } from '@/server/actions/admin/jobs/submitJobForReview';

type JobData = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  workMode: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  skills: string[];
  expiresAt: string;
  status: string;
};

type SectionProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
};

function FormSection({ icon: Icon, title, description, children }: SectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b bg-muted/20 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
            <Icon className="size-4 text-primary" />
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  required,
  children
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      </div>

      {children}

      {hint && <p className="text-xs leading-5 text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function EditJobForm({ job }: { job: JobData }) {
  const router = useRouter();

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = React.useState(false);

  const [skills, setSkills] = React.useState<string[]>(job.skills);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const result = await updateJob(job.id, formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess('Job updated successfully.');

      router.refresh();
    } catch {
      setError('Something went wrong while updating the job.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitForReview() {
    setError('');
    setSuccess('');
    setIsSubmittingForReview(true);

    try {
      const result = await submitJobForReview(job.id);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess('Job submitted for review.');

      router.refresh();
    } catch {
      setError('Something went wrong while submitting the job for review.');
    } finally {
      setIsSubmittingForReview(false);
    }
  }

  function removeSkill(skill: string) {
    setSkills(current => current.filter(item => item !== skill));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic information */}
      <FormSection
        icon={FileText}
        title="Job information"
        description="Define the role, responsibilities and expectations for this position.">
        <div className="space-y-6">
          <Field
            label="Job title"
            htmlFor="title"
            required
            hint="Use a clear title candidates will immediately understand.">
            <Input
              id="title"
              name="title"
              defaultValue={job.title}
              required
              maxLength={150}
              placeholder="e.g. Senior Frontend Developer"
              className="h-11"
            />
          </Field>

          <Field
            label="Job description"
            htmlFor="description"
            required
            hint="Explain what the successful candidate will do and what the role contributes to the company.">
            <Textarea
              id="description"
              name="description"
              defaultValue={job.description}
              required
              rows={9}
              placeholder="Describe the role, responsibilities, team and what success looks like..."
              className="resize-y"
            />
          </Field>

          <Field
            label="Requirements"
            htmlFor="requirements"
            hint="List qualifications, experience, education or other requirements for the position.">
            <Textarea
              id="requirements"
              name="requirements"
              defaultValue={job.requirements ?? ''}
              rows={7}
              placeholder="e.g. 3+ years of React experience, strong TypeScript knowledge..."
              className="resize-y"
            />
          </Field>
        </div>
      </FormSection>

      {/* Work arrangement */}
      <FormSection
        icon={BriefcaseBusiness}
        title="Work arrangement"
        description="Tell candidates how and where this role will be performed.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Work mode" htmlFor="workMode" required>
            <select
              id="workMode"
              name="workMode"
              defaultValue={job.workMode}
              required
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </Field>

          <Field label="Employment type" htmlFor="employmentType" required>
            <select
              id="employmentType"
              name="employmentType"
              defaultValue={job.employmentType}
              required
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
              <option value="TEMPORARY">Temporary</option>
            </select>
          </Field>
        </div>

        <div className="mt-6">
          <Field
            label="Location"
            htmlFor="location"
            hint={
              job.workMode === 'REMOTE'
                ? 'You can leave this empty for fully remote positions.'
                : 'Specify the city, region or location where the candidate will work.'
            }>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="location"
                name="location"
                defaultValue={job.location ?? ''}
                placeholder="e.g. Warri, Delta State"
                className="h-11 pl-9"
              />
            </div>
          </Field>
        </div>
      </FormSection>

      {/* Compensation */}
      <FormSection
        icon={CircleDollarSign}
        title="Compensation"
        description="Provide the salary range candidates should expect for this position.">
        <div className="grid gap-5 md:grid-cols-[1fr_1fr_140px]">
          <Field label="Minimum salary" htmlFor="salaryMin" hint="Optional">
            <Input
              id="salaryMin"
              name="salaryMin"
              type="number"
              min="0"
              step="1"
              defaultValue={job.salaryMin}
              placeholder="0"
              className="h-11"
            />
          </Field>

          <Field label="Maximum salary" htmlFor="salaryMax" hint="Optional">
            <Input
              id="salaryMax"
              name="salaryMax"
              type="number"
              min="0"
              step="1"
              defaultValue={job.salaryMax}
              placeholder="0"
              className="h-11"
            />
          </Field>

          <Field label="Currency" htmlFor="salaryCurrency" required>
            <select
              id="salaryCurrency"
              name="salaryCurrency"
              defaultValue={job.salaryCurrency || 'NGN'}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
        </div>

        <div className="mt-5 rounded-xl border border-dashed bg-muted/20 px-4 py-3">
          <p className="text-xs leading-5 text-muted-foreground">
            A salary range helps candidates quickly determine whether the opportunity matches their
            expectations.
          </p>
        </div>
      </FormSection>

      {/* Skills */}
      <FormSection
        icon={Sparkles}
        title="Skills"
        description="Add the technologies, abilities and competencies relevant to the role.">
        <div className="space-y-4">
          <Field label="Required skills" htmlFor="skills" hint="Separate skills with commas.">
            <Input
              id="skills"
              name="skills"
              defaultValue={job.skills.join(', ')}
              placeholder="React, TypeScript, Next.js, PostgreSQL"
              className="h-11"
              onChange={event => {
                const value = event.target.value;

                setSkills(
                  value
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(Boolean)
                );
              }}
            />
          </Field>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 rounded-xl border bg-muted/20 p-3">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium">
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label={`Remove ${skill}`}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      {/* Publishing */}
      <FormSection
        icon={CalendarDays}
        title="Publishing"
        description="Control how long this opportunity remains available.">
        <Field
          label="Expiry date"
          htmlFor="expiresAt"
          required={job.status === 'PUBLISHED'}
          hint={
            job.status === 'PUBLISHED'
              ? 'Published jobs must have a future expiry date.'
              : 'You can set an expiry date before publishing the job.'
          }>
          <Input
            id="expiresAt"
            name="expiresAt"
            type="date"
            defaultValue={job.expiresAt}
            required={job.status === 'PUBLISHED'}
            className="h-11 max-w-sm"
          />
        </Field>
      </FormSection>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          {success}
        </div>
      )}

      {/* Actions */}
      <div className="sticky bottom-4 z-10 rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden text-xs text-muted-foreground sm:block">
            Changes will be applied to this job listing.
          </p>

          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/employer/jobs/${job.id}`)}
              disabled={isLoading || isSubmittingForReview}>
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading || isSubmittingForReview} className="gap-2">
              <Save className="size-4" />
              {isLoading ? 'Saving changes...' : 'Save Changes'}
            </Button>

            {job.status === 'DRAFT' && (
              <Button
                type="button"
                onClick={handleSubmitForReview}
                disabled={isLoading || isSubmittingForReview}
                className="gap-2">
                {isSubmittingForReview ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Submit for Review
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
