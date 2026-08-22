'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface LogoContainerProps {
  className?: string;
  href?: string;
  spin?: number;
}

export default function LogoContainer({ className, href = '/' }: LogoContainerProps) {
  return (
    <Link
      href={href}
      aria-label="Job Rcentz home"
      className={cn('flex items-center justify-start', className)}>
      <div className="relative h-9 shrink-0 pt-1">
        <Image
          src="/Job-Rcentz-Dark.png"
          alt="Job Rcentz"
          width={150}
          height={40}
          priority
          className="h-9 w-auto object-contain dark:hidden"
        />

        <Image
          src="/Job-Rcentz.png"
          alt="Job Rcentz"
          width={150}
          height={40}
          priority
          className="hidden h-9 w-auto object-contain dark:block"
        />
      </div>

      <span className="whitespace-nowrap text-xl font-bold tracking-tight">
        Job{' '}
        <span className="relative font-bold text-primary after:inline-block after:animate-pulse after:text-3xl after:text-white after:content-['.']">
          Rcentz
        </span>
      </span>
    </Link>
  );
}
