import type { CurrentUser } from '@/server/actions/getCurrentUser';

export type UserRole = NonNullable<CurrentUser>['role'];

export interface NavigationItem {
  href: string;
  label: string;
}

/**
 * Public routes that exist for every visitor. Account-specific destinations
 * belong in the account menu, so the header never advertises dead links.
 */
export const publicNavigation: NavigationItem[] = [
  {
    href: '/jobs',
    label: 'Find Jobs'
  }
];

export interface RoleAction extends NavigationItem {
  roles: UserRole[];
}

/** Actions available to specific account roles. */
export const roleActions: RoleAction[] = [
  {
    href: '/dashboard/portfolio',
    label: 'My Portfolio',
    roles: ['JOB_SEEKER']
  },
  {
    href: '/dashboard/jobs/create',
    label: 'Post a Job',
    roles: ['EMPLOYER']
  }
];

/** Shared, implemented destinations for the account menu. */
export const commonAccountNavigation: NavigationItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/jobs', label: 'Find Jobs' }
];

export function getRoleAction(role?: UserRole | null) {
  if (!role) return null;

  return roleActions.find(action => action.roles.includes(role)) ?? null;
}
