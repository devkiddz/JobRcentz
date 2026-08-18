'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Building2, Globe, ImagePlus, Loader2, Mail, Phone, Upload, Users } from 'lucide-react';

import { uploadCompanyLogo } from '@/server/actions/onboarding/companies/uploadCompanyLogo';
import { saveCompanyProfile } from '@/server/actions/onboarding/companies/saveCompanyProfile';
import type { CompanyProfileData } from '@/server/actions/onboarding/companies/getCompanyProfile';
import { COMPANY_FORM_SCHEMA } from '@/server/utils/zodSchemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import BackButton from '../BackButton';
import { LocationPicker } from './LocationPicker';

interface CompanyFormProps {
  onBack: () => void;
  initialProfile: CompanyProfileData;
}

type CompanyFormValues = z.infer<typeof COMPANY_FORM_SCHEMA>;

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'] as const;

const ICON_CLASS = 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground';

const SOCIAL_ICON_CLASS = 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground';

export default function CompanyForm({ onBack, initialProfile }: CompanyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingProfile = initialProfile.profile;

  const [logoPreview, setLogoPreview] = useState<string | null>(existingProfile?.companyLogoUrl ?? null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(COMPANY_FORM_SCHEMA),

    defaultValues: {
      companyName: existingProfile?.companyName ?? '',
      companyWebsite: existingProfile?.companyWebsite ?? '',
      companySize: (existingProfile?.companySize as CompanyFormValues['companySize']) ?? undefined,
      companyIndustry: existingProfile?.companyIndustry ?? '',
      companyDescription: existingProfile?.companyDescription ?? '',
      companyLocation: existingProfile?.companyLocation ?? '',
      companyAddress: existingProfile?.companyAddress ?? '',
      companyContactEmail: existingProfile?.companyContactEmail ?? '',
      companyContactPhone: existingProfile?.companyContactPhone ?? '',
      companyLinkedIn: existingProfile?.companyLinkedIn ?? '',
      companyX: existingProfile?.companyX ?? '',
      companyFacebook: existingProfile?.companyFacebook ?? '',
      companyLogo: undefined
    }
  });

  const logoFile = form.watch('companyLogo');

  /*
   * If the server sends a different company profile after the component
   * has mounted, hydrate the form with the latest profile.
   */
  useEffect(() => {
    const profile = initialProfile.profile;

    if (!profile) {
      form.reset({
        companyName: '',
        companyWebsite: '',
        companySize: undefined,
        companyIndustry: '',
        companyDescription: '',
        companyLocation: '',
        companyAddress: '',
        companyContactEmail: '',
        companyContactPhone: '',
        companyLinkedIn: '',
        companyX: '',
        companyFacebook: '',
        companyLogo: undefined
      });

      setLogoPreview(null);

      return;
    }

    form.reset({
      companyName: profile.companyName ?? '',
      companyWebsite: profile.companyWebsite ?? '',
      companySize: (profile.companySize as CompanyFormValues['companySize']) ?? undefined,
      companyIndustry: profile.companyIndustry ?? '',
      companyDescription: profile.companyDescription ?? '',
      companyLocation: profile.companyLocation ?? '',
      companyAddress: profile.companyAddress ?? '',
      companyContactEmail: profile.companyContactEmail ?? '',
      companyContactPhone: profile.companyContactPhone ?? '',
      companyLinkedIn: profile.companyLinkedIn ?? '',
      companyX: profile.companyX ?? '',
      companyFacebook: profile.companyFacebook ?? '',
      companyLogo: undefined
    });

    setLogoPreview(profile.companyLogoUrl ?? null);
  }, [initialProfile, form]);

  /*
   * Only revoke locally-created object URLs.
   * Do NOT revoke Cloudinary/server URLs.
   */
  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  async function onSubmit(values: CompanyFormValues) {
    try {
      let logo: {
        url: string;
        publicId: string;
      } | null = null;

      if (values.companyLogo instanceof File) {
        logo = await uploadCompanyLogo(values.companyLogo);
      }

      const result = await saveCompanyProfile({
        companyName: values.companyName,

        companyWebsite: values.companyWebsite,

        companySize: values.companySize,

        companyIndustry: values.companyIndustry,

        companyDescription: values.companyDescription,

        companyLocation: values.companyLocation,

        companyAddress: values.companyAddress,

        companyContactEmail: values.companyContactEmail,

        companyContactPhone: values.companyContactPhone,

        companyLinkedIn: values.companyLinkedIn,

        companyX: values.companyX,

        companyFacebook: values.companyFacebook,

        logo
      });

      if (!result.success) {
        throw new Error('Unable to save company profile.');
      }

      /*
       * Account type has now been established.
       * Leave onboarding immediately.
       */
      router.push('/dashboard');

      router.refresh();
    } catch (error) {
      console.error('Company registration failed:', error);
    }
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    /*
     * Revoke previous local preview if it was a blob URL.
     */
    if (logoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    form.setValue('companyLogo', file, {
      shouldValidate: true,
      shouldDirty: true
    });

    setLogoPreview(previewUrl);
  }

  function removeLogo() {
    if (logoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }

    form.setValue('companyLogo', undefined, {
      shouldValidate: true,
      shouldDirty: true
    });

    setLogoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <BackButton onBack={onBack} className="sm:h-11 sm:w-11" />

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Building2 className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {existingProfile ? 'Update your company profile' : 'Build your company profile'}
          </h2>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Tell professionals who you are, what you do, and what makes your organization worth working with.
        </p>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Information */}
        <section className="rounded-2xl border border-border/50 bg-background/30 p-5 sm:p-6">
          <SectionHeader
            title="Company information"
            description="The essentials professionals will see about your organization."
          />

          <div className="space-y-6">
            {/* Logo */}
            <div>
              <label className="text-sm font-medium">Company logo</label>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Company logo preview"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-12 cursor-pointer gap-2">
                      <Upload className="h-4 w-4" />

                      {logoFile ? 'Change logo' : logoPreview ? 'Change logo' : 'Upload logo'}
                    </Button>

                    {logoFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={removeLogo}
                        className="h-12 cursor-pointer text-muted-foreground hover:text-destructive">
                        Remove
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">JPEG, PNG or WebP · Maximum 5MB</p>

                  {form.formState.errors.companyLogo && (
                    <p className="text-xs text-destructive">{form.formState.errors.companyLogo.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Name / Industry */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Company name" error={form.formState.errors.companyName?.message}>
                <div className="relative">
                  <Building2 className={ICON_CLASS} />

                  <Input
                    {...form.register('companyName')}
                    placeholder="Acme Technologies"
                    className="h-12 pl-10"
                  />
                </div>
              </FormField>

              <FormField label="Industry" error={form.formState.errors.companyIndustry?.message}>
                <Input
                  {...form.register('companyIndustry')}
                  placeholder="Software & Technology"
                  className="h-12"
                />
              </FormField>
            </div>

            {/* Company Size / Website */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Company size" optional error={form.formState.errors.companySize?.message}>
                <Select
                  value={form.watch('companySize') ?? ''}
                  onValueChange={value =>
                    form.setValue('companySize', value as CompanyFormValues['companySize'], {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }>
                  <SelectTrigger className="h-12 w-full">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select company size" />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    {COMPANY_SIZES.map(size => (
                      <SelectItem key={size} value={size}>
                        {size} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Company website"
                optional
                error={form.formState.errors.companyWebsite?.message}>
                <div className="relative">
                  <Globe className={ICON_CLASS} />

                  <Input
                    {...form.register('companyWebsite')}
                    type="url"
                    placeholder="https://example.com"
                    className="h-12 pl-10"
                  />
                </div>
              </FormField>
            </div>

            {/* Location / Address */}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Location" error={form.formState.errors.companyLocation?.message}>
                <LocationPicker
                  value={form.watch('companyLocation')}
                  onValueChange={value =>
                    form.setValue('companyLocation', value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }
                  placeholder="Search city, state or country..."
                />
              </FormField>

              <FormField
                label="Office address"
                optional
                error={form.formState.errors.companyAddress?.message}>
                <Input
                  {...form.register('companyAddress')}
                  placeholder="14 Admiralty Way, Lekki Phase 1"
                  className="h-12"
                />
              </FormField>
            </div>

            {/* Description */}
            <FormField label="Company description" error={form.formState.errors.companyDescription?.message}>
              <Textarea
                {...form.register('companyDescription')}
                placeholder="Tell professionals about your company, what you do, and the kind of work you offer..."
                className="min-h-40 resize-none"
              />

              <p className="text-xs text-muted-foreground">Minimum 20 characters.</p>
            </FormField>
          </div>
        </section>

        {/* Contact Information */}
        <section className="rounded-2xl border border-border/50 bg-background/30 p-5 sm:p-6">
          <SectionHeader
            title="Contact information"
            description="How HirePulse can reach your organization."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Contact email" error={form.formState.errors.companyContactEmail?.message}>
              <div className="relative">
                <Mail className={ICON_CLASS} />

                <Input
                  {...form.register('companyContactEmail')}
                  type="email"
                  placeholder="hello@example.com"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>

            <FormField
              label="Contact phone"
              optional
              error={form.formState.errors.companyContactPhone?.message}>
              <div className="relative">
                <Phone className={ICON_CLASS} />

                <Input
                  {...form.register('companyContactPhone')}
                  type="tel"
                  placeholder="+2348012345678"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>
          </div>
        </section>

        {/* Social Presence */}
        <section className="rounded-2xl border border-border/50 bg-background/30 p-5 sm:p-6">
          <SectionHeader
            title="Social presence"
            description="Help professionals discover and learn more about your organization."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="LinkedIn" optional error={form.formState.errors.companyLinkedIn?.message}>
              <div className="relative">
                <LinkedInIcon className={SOCIAL_ICON_CLASS} />

                <Input
                  {...form.register('companyLinkedIn')}
                  type="url"
                  placeholder="https://linkedin.com/company/acme"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>

            <FormField label="X" optional error={form.formState.errors.companyX?.message}>
              <div className="relative">
                <XIcon className={SOCIAL_ICON_CLASS} />

                <Input
                  {...form.register('companyX')}
                  type="url"
                  placeholder="https://x.com/acme"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>

            <FormField label="Facebook" optional error={form.formState.errors.companyFacebook?.message}>
              <div className="relative">
                <FacebookIcon className={SOCIAL_ICON_CLASS} />

                <Input
                  {...form.register('companyFacebook')}
                  type="url"
                  placeholder="https://facebook.com/acme"
                  className="h-12 pl-10"
                />
              </div>
            </FormField>
          </div>
        </section>

        {/* Footer */}
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
              ) : existingProfile ? (
                'Update company profile'
              ) : (
                'Create company profile'
              )}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            You can update your company profile later.
          </p>
        </footer>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helper Components                                                          */
/* -------------------------------------------------------------------------- */

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.68H9.35V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.47v6.28ZM5.34 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V8.98H3.56v11.47Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.08c0-.87.24-1.46 1.51-1.46h1.61V3.94c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.43-3.94 4.06V10H7.5v3h2.82v8h3.18Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.82L2.8 2h6.41l4.43 6.21L18.9 2Zm-1.1 17.6h1.73L8.27 4.26H6.42L17.8 19.6Z" />
    </svg>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

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
