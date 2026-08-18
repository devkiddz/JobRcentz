import type { ReactNode } from 'react';

import NavBar from '@/components/website/NavBar';
import { getOptionalCurrentUser } from '@/server/actions/getOptionalCurrentUser';

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const user = await getOptionalCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={user ?? undefined} />

      <main className="flex-1">{children}</main>
    </div>
  );
}
