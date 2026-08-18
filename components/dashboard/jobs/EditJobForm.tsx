'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

import { updateJob } from '@/server/actions/jobs/updateJob';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

export default function EditJobForm({ job }: { job: JobData }) {
  const router = useRouter();

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Job Title
            </label>

            <Input
              id="title"
              name="title"
              defaultValue={job.title}
              required
              maxLength={150}
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Job Description
            </label>

            <Textarea
              id="description"
              name="description"
              defaultValue={job.description}
              required
              rows={8}
              placeholder="Describe the role..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="requirements" className="text-sm font-medium">
              Requirements
            </label>

            <Textarea
              id="requirements"
              name="requirements"
              defaultValue={job.requirements ?? ''}
              rows={6}
              placeholder="List the requirements..."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="workMode" className="text-sm font-medium">
                Work Mode
              </label>

              <select
                id="workMode"
                name="workMode"
                defaultValue={job.workMode}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                required>
                <option value="ONSITE">Onsite</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="employmentType" className="text-sm font-medium">
                Employment Type
              </label>

              <select
                id="employmentType"
                name="employmentType"
                defaultValue={job.employmentType}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                required>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>

            <Input
              id="location"
              name="location"
              defaultValue={job.location ?? ''}
              placeholder="e.g. Lagos, Nigeria"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="font-semibold">Compensation</h2>

        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="salaryMin" className="text-sm font-medium">
              Minimum Salary
            </label>

            <Input
              id="salaryMin"
              name="salaryMin"
              type="number"
              min="0"
              defaultValue={job.salaryMin}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="salaryMax" className="text-sm font-medium">
              Maximum Salary
            </label>

            <Input
              id="salaryMax"
              name="salaryMax"
              type="number"
              min="0"
              defaultValue={job.salaryMax}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="salaryCurrency" className="text-sm font-medium">
              Currency
            </label>

            <Input
              id="salaryCurrency"
              name="salaryCurrency"
              defaultValue={job.salaryCurrency}
              maxLength={10}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="skills" className="text-sm font-medium">
              Skills
            </label>

            <Input
              id="skills"
              name="skills"
              defaultValue={job.skills.join(', ')}
              placeholder="React, TypeScript, Next.js"
            />

            <p className="text-xs text-muted-foreground">Separate skills with commas.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="expiresAt" className="text-sm font-medium">
              Expiry Date
            </label>

            <Input
              id="expiresAt"
              name="expiresAt"
              type="date"
              defaultValue={job.expiresAt}
              required={job.status === 'PUBLISHED'}
            />

            {job.status === 'PUBLISHED' && (
              <p className="text-xs text-muted-foreground">Published jobs must have a future expiry date.</p>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/jobs')}
          disabled={isLoading}>
          Cancel
        </Button>

        <Button type="submit" disabled={isLoading}>
          <Save className="size-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
