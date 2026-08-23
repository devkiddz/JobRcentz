'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

import { getJobSeekerGallery } from '@/server/actions/dashboard/jobseeker/getJobSeekerGallery';

import type { JobSeekerGalleryData } from '@/server/actions/dashboard/jobseeker/getJobSeekerGallery';

export default function GalleryTab() {
  const [images, setImages] = useState<JobSeekerGalleryData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadGallery() {
      try {
        const data = await getJobSeekerGallery();

        if (mounted) {
          setImages(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(item => (
          <div key={item} className="aspect-square animate-pulse rounded-2xl border bg-muted/30" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Professional media</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight">Gallery</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Showcase certificates, professional moments, work environments and other supporting media.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-14 text-center">
          <ImageIcon className="mx-auto size-8 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">Your gallery is empty</h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Professional images and supporting media will appear here when you add them.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map(image => (
            <figure key={image.id} className="group overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt={image.alt || image.caption || 'Professional gallery image'}
                  className="size-full object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              </div>

              {image.caption && (
                <figcaption className="p-3 text-xs leading-5 text-muted-foreground">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
