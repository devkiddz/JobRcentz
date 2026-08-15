import NavBar from '@/components/website/NavBar';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">{children}</main>
    </div>
  );
}
