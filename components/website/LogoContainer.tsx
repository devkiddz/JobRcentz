'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface LogoContainerProps {
  className?: string;
  href?: string;
  spin?: number;
}

export default function LogoContainer({ className, href = '/', spin = 0 }: LogoContainerProps) {
  const pathname = usePathname();

  const [rotation, setRotation] = useState(0);

  const previousPathname = useRef(pathname);
  const hasMounted = useRef(false);

  /*
   * Spin once when the component mounts.
   * This covers:
   * - Full page refresh
   * - Browser reload
   * - Direct navigation to a page
   */
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      setRotation(prev => prev + 360);
    }
  }, []);

  /*
   * Spin whenever the pathname changes.
   */
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      setRotation(prev => prev + 360);
      previousPathname.current = pathname;
    }
  }, [pathname]);

  /*
   * Spin when explicitly requested by a parent.
   * Used by onboarding step transitions.
   */
  useEffect(() => {
    if (spin > 0) {
      setRotation(prev => prev + 360);
    }
  }, [spin]);

  return (
    <Link href={href} aria-label="Job Rcentz home" className={cn('flex items-center', className)}>
      <motion.div
        animate={{ rotateY: rotation }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000
        }}
        className="relative h-9 shrink-0 pt-1">
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
      </motion.div>

      <span className="whitespace-nowrap text-xl font-bold tracking-tight">
        Job{' '}
        <span className="relative font-bold text-primary after:inline-block after:animate-pulse after:text-3xl after:text-white after:content-['.']">
          Rcentz
        </span>
      </span>
    </Link>
  );
}
