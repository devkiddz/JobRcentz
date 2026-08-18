'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Save } from 'lucide-react';

import { createJob } from '@/server/actions/dashboard/employer/createJob';

const workModes = [
  {
    value: 'ONSITE',
    label: 'On-site'
  },
  {
    value: 'REMOTE',
    label: 'Remote'
  },
  {
    value: 'HYBRID',
    label: 'Hybrid'
  }
];

const employmentTypes = [
  {
    value: 'FULL_TIME',
    label: 'Full Time'
  },
  {
    value: 'PART_TIME',
    label: 'Part Time'
  },
  {
    value: 'CONTRACT',
    label: 'Contract'
  },
  {
    value: 'INTERNSHIP',
    label: 'Internship'
  },
  {
    value: 'FREELANCE',
    label: 'Freelance'
  },
  {
    value: 'TEMPORARY',
    label: 'Temporary'
  }
];

export function CreateJobForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData, status: 'DRAFT' | 'PUBLISHED') {
    setError(null);

    formData.set('status', status);

    startTransition(async () => {
      const result = await createJob(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/jobs/${result.jobId}`);
    });
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        submit(formData, 'PUBLISHED');
      }}
      className="space-y-6">
      {/* Basic information */}
      <section className="rounded-xl border bg-card p-6">
        <div>
          <h2 className="font-semibold">Job Details</h2>

          <p className="mt-1 text-sm text-muted-foreground">Describe the opportunity you're hiring for.</p>
        </div>

        <div className="mt-6 space-y-5">
          <Field label="Job Title" name="title" placeholder="e.g. Frontend Developer" required />

          <TextAreaField
            label="Description"
            name="description"
            placeholder="Describe the role, responsibilities, and what the successful candidate will work on..."
            rows={9}
            required
          />

          <TextAreaField
            label="Requirements"
            name="requirements"
            placeholder="List the experience, qualifications, and expectations for this role..."
            rows={7}
          />

          <Field
            label="Skills"
            name="skills"
            placeholder="React, TypeScript, Next.js, Tailwind CSS"
            hint="Separate skills with commas."
          />
        </div>
      </section>

      {/* Employment */}
      <section className="rounded-xl border bg-card p-6">
        <div>
          <h2 className="font-semibold">Employment Information</h2>

          <p className="mt-1 text-sm text-muted-foreground">Tell candidates how and where they will work.</p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <SelectField label="Employment Type" name="employmentType" options={employmentTypes} required />

          <SelectField label="Work Mode" name="workMode" options={workModes} required />

          <Field label="Location" name="location" placeholder="Warri, Delta State" />

          <Field label="Expiry Date" name="expiresAt" type="date" required />
        </div>
      </section>

      {/* Compensation */}
      <section className="rounded-xl border bg-card p-6">
        <div>
          <h2 className="font-semibold">Compensation</h2>

          <p className="mt-1 text-sm text-muted-foreground">Salary information is optional.</p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <Field label="Minimum Salary" name="salaryMin" type="number" min="0" placeholder="150000" />

          <Field label="Maximum Salary" name="salaryMax" type="number" min="0" placeholder="300000" />

          <Field label="Currency" name="salaryCurrency" defaultValue="NGN" placeholder="NGN" />
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Actions */}
      {/* Actions */}
      <section className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={event => {
            const form = event.currentTarget.closest('form');

            if (!form) return;

            submit(new FormData(form), 'DRAFT');
          }}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50 sm:w-auto">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Draft
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 sm:w-auto">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating Job...
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Publish Job
            </>
          )}
        </button>
      </section>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  hint,
  required,
  min,
  defaultValue
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  min?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        defaultValue={defaultValue}
        className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  placeholder,
  rows,
  required
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required
}: {
  label: string;
  name: string;
  options: {
    value: string;
    label: string;
  }[];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>

        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
