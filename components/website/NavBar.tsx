'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import ActionButton from './ActionButton';
import LogoContainer from './LogoContainer';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

const navigation = [
  {
    href: '/jobs',
    label: 'Find Jobs'
  },
  {
    href: '/jobs/create',
    label: 'Post a Job'
  },
  {
    href: '/professionals',
    label: 'Professionals'
  },
  {
    href: '/projects',
    label: 'Projects'
  }
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-3xl">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <LogoContainer href="/" />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <ActionButton />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] p-5 sm:w-[360px]">
              <SheetHeader>
                <SheetTitle>Job Rcentz</SheetTitle>

                <SheetDescription className="border-b border-primary/20 pb-5">
                  Find jobs, discover professionals, and manage your work.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-2">
                {/* Navigation */}
                {navigation.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    {item.label}
                  </Link>
                ))}

                {/* Divider */}
                <div className="my-3 border-t border-border" />

                {/* Appearance */}
                <div className="flex min-h-11 items-center justify-between rounded-md px-3">
                  <span className="text-sm font-medium">Appearance</span>

                  <ThemeToggle />
                </div>

                {/* Account */}
                <div className="mt-3 border-t border-border pt-3">
                  <ActionButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
