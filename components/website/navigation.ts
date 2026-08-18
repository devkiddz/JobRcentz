import type { CurrentUser } from '@/server/actions/getCurrentUser';

export type UserRole = NonNullable<CurrentUser>['role'];

export interface NavigationItem {
  href: string;
  label: string;
}

export interface RoleAction extends NavigationItem {
  roles: UserRole[];
}

/**
 * Public navigation shared by desktop and mobile.
 *
 * Role-specific actions such as "Post a Job" and
 * "My Portfolio" intentionally do not belong here.
 */
export const publicNavigation: NavigationItem[] = [
  {
    href: '/jobs',
    label: 'Find Jobs'
  },
  {
    href: '/professionals',
    label: 'Professionals'
  },
  {
    href: '/projects',
    label: 'Projects'
  }
];

/**
 * Actions available to specific account roles.
 */
export const roleActions: RoleAction[] = [
  {
    href: '/portfolio',
    label: 'My Portfolio',
    roles: ['JOB_SEEKER']
  },
  {
    href: '/dashboard/jobs/create',
    label: 'Post a Job',
    roles: ['EMPLOYER']
  }
];

/**
 * Shared account navigation.
 */
export const commonAccountNavigation: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard'
  },
  {
    href: '/dashboard/profile',
    label: 'Profile'
  },
  {
    href: '/jobs',
    label: 'Find Jobs'
  },
  {
    href: '/settings',
    label: 'Settings'
  }
];

export function getRoleAction(role?: UserRole | null) {
  if (!role) return null;

  return roleActions.find(action => action.roles.includes(role)) ?? null;
}