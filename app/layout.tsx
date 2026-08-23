import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Noto_Sans, Geist } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { GridBackground } from '@/backgrounds/GridBackground';
import { cn } from '@/lib/utils';
import { MotionConfig } from 'framer-motion';
import GlobalNavigation from '@/components/website/GlobalNavigation';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Job Rcentz',
  description: 'Connect businesses with skilled professionals.'
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('h-full', 'antialiased', notoSans.variable, 'font-sans', geist.variable)}>
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MotionConfig reducedMotion="user">
            <GridBackground gridSize={120}>
              <GlobalNavigation />

              <main className="flex-1 pb-16 md:pb-0">{children}</main>
            </GridBackground>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
