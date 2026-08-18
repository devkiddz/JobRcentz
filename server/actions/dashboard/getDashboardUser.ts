'use server';

import { getCurrentUser } from '@/server/actions/getCurrentUser';

export const getDashboardUser = getCurrentUser;

export type DashboardUser = Awaited<
  ReturnType<typeof getDashboardUser>
>;