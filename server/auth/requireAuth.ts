import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from './auth';

export async function requireAuth(redirectTo = '/login') {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect(redirectTo);
  }

  return session.user;
}