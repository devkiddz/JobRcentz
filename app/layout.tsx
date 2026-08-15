import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { GridBackground } from '@/backgrounds/GridBackground';

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
    <html lang="en" suppressHydrationWarning className={`${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GridBackground>{children}</GridBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}
