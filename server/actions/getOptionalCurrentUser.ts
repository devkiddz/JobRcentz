'use server';

import { getCurrentUser } from '@/server/actions/getCurrentUser';

export async function getOptionalCurrentUser() {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}