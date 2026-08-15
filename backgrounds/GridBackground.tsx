'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
  animated?: boolean;
}

export function GridBackground({ children, className, gridSize = 40, animated = true }: GridBackgroundProps) {
  return (
    <div
      style={
        {
          '--grid-size': `${gridSize}px`
        } as React.CSSProperties
      }
      className={cn('relative isolate min-h-full flex-1 overflow-clip bg-background', className)}>
      {/* Animated Grid */}
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 -z-20', animated && 'grid-background-animated')}
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              color-mix(
                in oklch,
                var(--grid-color) 14%,
                transparent
              ) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              color-mix(
                in oklch,
                var(--grid-color) 14%,
                transparent
              ) 1px,
              transparent 1px
            )
          `,
          backgroundSize: 'var(--grid-size) var(--grid-size)',
          backgroundPosition: '0 0'
        }}
      />

      {/* Atmospheric Glow */}
      <div aria-hidden="true" className="grid-ambient-glow pointer-events-none absolute inset-0 -z-10" />

      {/* Application Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
