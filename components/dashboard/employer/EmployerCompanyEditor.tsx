'use client';

import Image from 'next/image';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';

import { updateEmployerCompanyProfile } from '@/server/actions/dashboard/employer/updateEmployerCompanyProfile';

import {
  uploadCompanyMedia,
  type CompanyMediaType
} from '@/server/actions/dashboard/employer/uploadCompanyMedia';

import { deleteCompanyMedia } from '@/server/actions/dashboard/employer/deleteCompanyMedia';

type Company = {
  id: string;

  companyName: string;
  companyWebsite: string | null;
  companySize: string | null;
  companyIndustry: string;
  companyDescription: string;
  companyLocation: string;
  companyAddress: string | null;

  companyContactEmail: string;
  companyContactPhone: string | null;

  companyLinkedIn: string | null;
  companyX: string | null;
  companyFacebook: string | null;

  companyLogoUrl: string | null;
  companyLogoPublicId: string | null;

  bannerUrl: string | null;
  bannerPublicId: string | null;

  onboardingStatus: 'PENDING' | 'APPROVED' | 'REJECTED';

  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';

  isDiscoverable: boolean;
  profileViews: number;
};

type Props = {
  company: Company;
};

type MediaValue = {
  url: string;
  publicId: string;
} | null;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function EmployerCompanyEditor({ company }: Props) {
  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [logo, setLogo] = useState<MediaValue>(
    company.companyLogoUrl && company.companyLogoPublicId
      ? {
          url: company.companyLogoUrl,
          publicId: company.companyLogoPublicId
        }
      : null
  );

  const [banner, setBanner] = useState<MediaValue>(
    company.bannerUrl && company.bannerPublicId
      ? {
          url: company.bannerUrl,
          publicId: company.bannerPublicId
        }
      : null
  );

  const [logoUploading, setLogoUploading] = useState(false);

  const [bannerUploading, setBannerUploading] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);

  async function handleMediaUpload(file: File, type: CompanyMediaType) {
    setError(null);
    setMessage(null);

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Image must be a JPEG, PNG, or WebP file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be less than 5MB.');
      return;
    }

    try {
      if (type === 'logo') {
        setLogoUploading(true);
      } else {
        setBannerUploading(true);
      }

      const result = await uploadCompanyMedia(file, type);

      const media: MediaValue = {
        url: result.url,
        publicId: result.publicId
      };

      /*
       * Update local editor state immediately.
       *
       * This means the newly uploaded image is
       * visible immediately without requiring
       * the user to save first.
       */
      if (type === 'logo') {
        setLogo(media);
      } else {
        setBanner(media);
      }

      setMessage(
        type === 'logo' ? 'Company logo uploaded successfully.' : 'Company banner uploaded successfully.'
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image.');
    } finally {
      if (type === 'logo') {
        setLogoUploading(false);
      } else {
        setBannerUploading(false);
      }
    }
  }

  function handleRemoveMedia(type: CompanyMediaType) {
    setError(null);
    setMessage(null);

    if (type === 'logo') {
      setLogo(null);
      setMessage('Company logo removed. Save changes to apply it.');
    } else {
      setBanner(null);
      setMessage('Company banner removed. Save changes to apply it.');
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(null);
    setError(null);

    if (logoUploading || bannerUploading) {
      setError('Please wait for your images to finish uploading.');
      return;
    }

    const formData = new FormData(event.currentTarget);

    const input = {
      companyName: String(formData.get('companyName') ?? ''),
      companyWebsite: String(formData.get('companyWebsite') ?? ''),
      companySize: String(formData.get('companySize') ?? ''),
      companyIndustry: String(formData.get('companyIndustry') ?? ''),
      companyDescription: String(formData.get('companyDescription') ?? ''),
      companyLocation: String(formData.get('companyLocation') ?? ''),
      companyAddress: String(formData.get('companyAddress') ?? ''),
      companyContactEmail: String(formData.get('companyContactEmail') ?? ''),
      companyContactPhone: String(formData.get('companyContactPhone') ?? ''),
      companyLinkedIn: String(formData.get('companyLinkedIn') ?? ''),
      companyX: String(formData.get('companyX') ?? ''),
      companyFacebook: String(formData.get('companyFacebook') ?? ''),
      logo,
      banner
    };

    startTransition(async () => {
      try {
        await updateEmployerCompanyProfile(input);

        /*
         * Capture the assets that were previously
         * stored in the database.
         */
        const previousLogo = company.companyLogoPublicId;

        const previousBanner = company.bannerPublicId;

        /*
         * Compare the saved editor state against
         * the original database state.
         */
        const logoChanged = previousLogo !== (logo?.publicId ?? null);

        const bannerChanged = previousBanner !== (banner?.publicId ?? null);

        /*
         * IMPORTANT:
         *
         * Delete old Cloudinary assets ONLY AFTER
         * the database update has succeeded.
         */
        if (logoChanged && previousLogo) {
          await deleteCompanyMedia(previousLogo);
        }

        if (bannerChanged && previousBanner) {
          await deleteCompanyMedia(previousBanner);
        }

        setMessage('Company profile updated successfully.');
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Something went wrong while updating your company profile.'
        );
      }
    });
  }

  const mediaUploading = logoUploading || bannerUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Company identity */}

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Company information</h2>

          <p className="text-sm text-muted-foreground">
            Keep your company's public information accurate and up to date.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Company name" name="companyName" defaultValue={company.companyName} required />

          <Field label="Industry" name="companyIndustry" defaultValue={company.companyIndustry} required />

          <Field label="Company size" name="companySize" defaultValue={company.companySize ?? ''} />

          <Field label="Location" name="companyLocation" defaultValue={company.companyLocation} required />

          <Field label="Company address" name="companyAddress" defaultValue={company.companyAddress ?? ''} />

          <Field
            label="Website"
            name="companyWebsite"
            type="url"
            defaultValue={company.companyWebsite ?? ''}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="companyDescription" className="text-sm font-medium">
            Company description
          </label>

          <textarea
            id="companyDescription"
            name="companyDescription"
            defaultValue={company.companyDescription}
            required
            rows={6}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </section>

      {/* Contact */}

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Contact information</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Contact email"
            name="companyContactEmail"
            type="email"
            defaultValue={company.companyContactEmail}
            required
          />

          <Field
            label="Contact phone"
            name="companyContactPhone"
            defaultValue={company.companyContactPhone ?? ''}
          />

          <Field
            label="LinkedIn"
            name="companyLinkedIn"
            type="url"
            defaultValue={company.companyLinkedIn ?? ''}
            placeholder="https://linkedin.com/company/..."
          />

          <Field
            label="X"
            name="companyX"
            type="url"
            defaultValue={company.companyX ?? ''}
            placeholder="https://x.com/..."
          />

          <Field
            label="Facebook"
            name="companyFacebook"
            type="url"
            defaultValue={company.companyFacebook ?? ''}
            placeholder="https://facebook.com/..."
          />
        </div>
      </section>

      {/* Brand media */}

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Brand media</h2>

          <p className="text-sm text-muted-foreground">
            Use a clear logo and a wide banner to represent your company.
          </p>
        </div>

        <div className="space-y-8">
          <MediaUploader
            label="Company logo"
            description="Square image. JPEG, PNG, or WebP. Maximum 5MB."
            media={logo}
            type="logo"
            inputRef={logoInputRef}
            isUploading={logoUploading}
            onSelect={file => handleMediaUpload(file, 'logo')}
            onRemove={() => handleRemoveMedia('logo')}
          />

          <MediaUploader
            label="Company banner"
            description="Wide 4:1 image. JPEG, PNG, or WebP. Maximum 5MB."
            media={banner}
            type="banner"
            inputRef={bannerInputRef}
            isUploading={bannerUploading}
            onSelect={file => handleMediaUpload(file, 'banner')}
            onRemove={() => handleRemoveMedia('banner')}
          />
        </div>
      </section>

      {/* Visibility */}

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Visibility</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="visibility" className="text-sm font-medium">
              Profile visibility
            </label>

            <select
              id="visibility"
              name="visibility"
              defaultValue={company.visibility}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="PUBLIC">Public</option>
              <option value="UNLISTED">Unlisted</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>

          <label className="flex items-center gap-3 rounded-md border p-4">
            <input type="hidden" name="isDiscoverable" value="false" />

            <input
              type="checkbox"
              name="isDiscoverable"
              value="true"
              defaultChecked={company.isDiscoverable}
              className="size-4"
            />

            <span>
              <span className="block text-sm font-medium">Discoverable</span>

              <span className="block text-xs text-muted-foreground">
                Allow candidates to discover this company.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Actions */}

      <div className="flex items-center justify-between border-t pt-6">
        <p className="text-xs text-muted-foreground">Changes are saved to your company profile.</p>

        <Button type="submit" disabled={isPending || mediaUploading}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : mediaUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </form>
  );
}

function MediaUploader({
  label,
  description,
  media,
  type,
  inputRef,
  isUploading,
  onSelect,
  onRemove
}: {
  label: string;
  description: string;
  media: MediaValue;
  type: CompanyMediaType;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const isBanner = type === 'banner';

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">{label}</h3>

        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div
        className={[
          'relative overflow-hidden rounded-xl border bg-muted',
          isBanner ? 'aspect-[4/1]' : 'mx-auto aspect-square w-full max-w-xs'
        ].join(' ')}>
        {media ? (
          <Image
            src={media.url}
            alt={label}
            fill
            sizes={isBanner ? '(max-width: 768px) 100vw, 800px' : '(max-width: 768px) 80vw, 320px'}
            className={isBanner ? 'object-cover' : 'object-contain p-6'}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="size-8" />

            <p className="text-sm">No {label.toLowerCase()} yet</p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
            <Loader2 className="size-6 animate-spin" />

            <span className="text-sm font-medium">Uploading...</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={event => {
            const file = event.target.files?.[0];

            if (file) {
              onSelect(file);
            }

            event.target.value = '';
          }}
        />

        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}>
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              {media ? 'Replace' : 'Upload'}
            </>
          )}
        </Button>

        {media && (
          <Button type="button" variant="outline" disabled={isUploading} onClick={onRemove}>
            <Trash2 className="size-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required = false,
  placeholder
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
