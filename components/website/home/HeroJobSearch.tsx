'use client';

import { FormEvent, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroJobSearchProps {
  className?: string;
}

export default function HeroJobSearch({ className = '' }: HeroJobSearchProps) {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    const trimmedQuery = query.trim();
    const trimmedLocation = location.trim();

    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    }

    if (trimmedLocation) {
      params.set('location', trimmedLocation);
    }

    const search = params.toString();

    router.push(search ? `/jobs?${search}` : '/jobs');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-6 w-full max-w-3xl rounded-[1.5rem] border bg-background p-3 shadow-2xl shadow-black/10 sm:mt-8 ${className}`}>
      <div className="grid gap-3 lg:grid-cols-[1fr_0.85fr_auto] lg:items-end">
        {/* =====================================================
            JOB SEARCH
        ===================================================== */}
        <div className="min-w-0">
          <label
            htmlFor="hero-job-search"
            className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold text-foreground">
            <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10">
              <Search className="size-3.5 text-primary" />
            </span>
            What are you looking for?
          </label>

          <div className="flex h-12 items-center rounded-xl border bg-muted/40 px-3 transition-colors focus-within:border-primary/40 focus-within:bg-background">
            <Search className="mr-2.5 size-4 shrink-0 text-muted-foreground" />

            <input
              id="hero-job-search"
              name="q"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Job title, skill or role"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* =====================================================
            LOCATION
        ===================================================== */}
        <div className="min-w-0">
          <label
            htmlFor="hero-job-location"
            className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold text-foreground">
            <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="size-3.5 text-primary" />
            </span>
            Where?
          </label>

          <div className="flex h-12 items-center rounded-xl border bg-muted/40 px-3 transition-colors focus-within:border-primary/40 focus-within:bg-background">
            <MapPin className="mr-2.5 size-4 shrink-0 text-muted-foreground" />

            <input
              id="hero-job-location"
              name="location"
              value={location}
              onChange={event => setLocation(event.target.value)}
              placeholder="City, state or remote"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* =====================================================
            SEARCH BUTTON
        ===================================================== */}
        <button
          type="submit"
          className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 active:translate-y-0">
          Find jobs
          <Search className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
