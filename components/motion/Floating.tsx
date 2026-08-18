'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Floating({
  children,
  delay = 0,
  duration = 5,
  distance = 10,
  className
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -distance, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}>
      {children}
    </motion.div>
  );
}
