import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  XCircle
} from 'lucide-react';

import { getCompanyForReview } from '@/server/actions/admin/companies/getCompanyForReview';
import { CompanyApprovalActions } from '@/components/dashboard/admin/CompanyApprovalActions';

export default async function CompanyReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await getCompanyForReview(id);

  if (!company) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/admin/companies"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Companies
      </Link>

      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {company.companyLogoUrl ? (
                <img
                  src={company.companyLogoUrl}
                  alt={company.companyName}
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-7 text-muted-foreground" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-primary">Company Review</p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{company.companyName}</h1>

              <p className="mt-1 text-sm text-muted-foreground">{company.companyIndustry}</p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            {company.onboardingStatus}
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Company Information</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Info label="Company Name" value={company.companyName} />

              <Info label="Industry" value={company.companyIndustry} />

              <Info label="Company Size" value={company.companySize ?? 'Not provided'} />

              <Info label="Location" value={company.companyLocation} />

              <Info label="Address" value={company.companyAddress ?? 'Not provided'} />

              <Info label="Website" value={company.companyWebsite ?? 'Not provided'} />
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Company Description</h2>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {company.companyDescription}
            </p>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Employer Account</h2>

            <div className="mt-5 space-y-4">
              <Info label="Contact Person" value={company.user.name} />

              <Info label="Account Email" value={company.user.email} />

              <Info label="Company Email" value={company.companyContactEmail} />

              <Info label="Phone" value={company.companyContactPhone ?? 'Not provided'} />
            </div>
          </section>

          {company.jobs.length > 0 && (
            <section className="rounded-xl border bg-card p-6">
              <h2 className="font-semibold">Existing Jobs</h2>

              <div className="mt-4 divide-y">
                {company.jobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>

                      <p className="text-xs text-muted-foreground">{job.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="h-fit space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Review Decision</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Approving this company allows its employer account to publish jobs on JobMan.
            </p>

            <CompanyApprovalActions companyId={company.id} status={company.onboardingStatus} />
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">External Profiles</h2>

            <div className="mt-4 space-y-3">
              {company.companyWebsite && (
                <ExternalLinkItem href={company.companyWebsite} icon={Globe} label="Website" />
              )}

              {company.companyLinkedIn && (
                <ExternalLinkItem href={company.companyLinkedIn} icon={ExternalLink} label="LinkedIn" />
              )}

              {company.companyX && <ExternalLinkItem href={company.companyX} icon={ExternalLink} label="X" />}

              {company.companyFacebook && (
                <ExternalLinkItem href={company.companyFacebook} icon={ExternalLink} label="Facebook" />
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function ExternalLinkItem({ href, icon: Icon, label }: { href: string; icon: typeof Globe; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm text-primary hover:underline">
      <Icon className="size-4" />
      {label}
    </a>
  );
}
