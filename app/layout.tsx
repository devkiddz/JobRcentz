import type { Metadata } from 'next';
import { Noto_Sans, Geist } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { GridBackground } from '@/backgrounds/GridBackground';
import { cn } from '@/lib/utils';
import { MotionConfig } from 'framer-motion';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'JobMan',
  description: 'Connect businesses with skilled professionals.'
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('h-full', 'antialiased', notoSans.variable, 'font-sans', geist.variable)}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MotionConfig reducedMotion="user">
            <GridBackground gridSize={120}>{children}</GridBackground>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
