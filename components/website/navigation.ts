import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckSquare,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  UserRound,
  Users,
  Video
} from 'lucide-react';

import type { CurrentUser } from '@/server/actions/getCurrentUser';

export type UserRole = NonNullable<CurrentUser>['role'];

/* ========================================================================= */
/* CORE TYPES                                                                */
/* ========================================================================= */

export interface NavigationItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  description?: string;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface RoleNavigationItem extends NavigationItem {
  roles: UserRole[];
}

export interface RoleAction extends NavigationItem {
  roles: UserRole[];
}

export interface PageContext {
  title: string;
  description: string;
}

/* ========================================================================= */
/* PUBLIC WEBSITE NAVIGATION                                                */
/* ========================================================================= */

/**
 * Navigation available to visitors and authenticated users.
 *
 * Keep the public navigation intentionally small.
 */
export const publicNavigation: NavigationItem[] = [
  {
    href: '/jobs',
    label: 'Find Jobs',
    icon: Search,
    description: 'Discover available opportunities.'
  }
];

/* ========================================================================= */
/* AUTHENTICATED GLOBAL NAVIGATION                                          */
/* ========================================================================= */

/**
 * Navigation available to authenticated accounts.
 *
 * These are global destinations rather than role-specific dashboard groups.
 */
export const authenticatedNavigation: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Your Job Rcentz workspace.'
  }
];

/* ========================================================================= */
/* ROLE ACTIONS                                                              */
/* ========================================================================= */

/**
 * High-value role-specific actions.
 *
 * These can be used by buttons, cards or other contextual UI.
 */
export const roleActions: RoleAction[] = [
  {
    href: '/dashboard/portfolio',
    label: 'My Portfolio',
    icon: FileText,
    roles: ['JOB_SEEKER'],
    description: 'Manage your professional portfolio.'
  },
  {
    href: '/dashboard/jobs/create',
    label: 'Post a Job',
    icon: BriefcaseBusiness,
    roles: ['EMPLOYER'],
    description: 'Create a new job opportunity.'
  }
];

/* ========================================================================= */
/* SHARED ACCOUNT NAVIGATION                                                */
/* ========================================================================= */

/**
 * Shared account destinations.
 *
 * Profile is intentionally kept out of the dashboard header.
 */
export const commonAccountNavigation: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: UserRound
  },
  {
    href: '/jobs',
    label: 'Find Jobs',
    icon: Search
  }
];

/* ========================================================================= */
/* DASHBOARD HEADER NAVIGATION                                               */
/* ========================================================================= */

/**
 * High-frequency workspace destinations shown in the dashboard header.
 *
 * These are shortcuts only. The dashboard sidebar remains the complete
 * navigation system.
 *
 * Profile and Notifications intentionally do NOT belong here.
 *
 * UNASSIGNED accounts receive no workspace shortcuts until their role is
 * established.
 */
export const dashboardHeaderNavigation: Record<UserRole, NavigationItem[]> = {
  JOB_SEEKER: [
    {
      href: '/dashboard/jobs',
      label: 'Jobs',
      icon: BriefcaseBusiness,
      description: 'Discover and manage job opportunities.'
    },
    {
      href: '/dashboard/portfolio',
      label: 'Portfolio',
      icon: FileText,
      description: 'Manage your professional portfolio.'
    },
    {
      href: '/dashboard/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      description: 'Manage your career tasks.'
    },
    {
      href: '/dashboard/interviews',
      label: 'Interviews',
      icon: Video,
      description: 'Manage your upcoming interviews.'
    }
  ],

  EMPLOYER: [
    {
      href: '/dashboard/employer/jobs',
      label: 'Jobs',
      icon: BriefcaseBusiness,
      description: 'Manage your company job postings.'
    },
    {
      href: '/dashboard/employer/candidates',
      label: 'Candidates',
      icon: Users,
      description: 'Discover and manage candidates.'
    },
    {
      href: '/dashboard/employer/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      description: 'Manage company hiring tasks.'
    },
    {
      href: '/dashboard/employer/interviews',
      label: 'Interviews',
      icon: Video,
      description: 'Manage upcoming candidate interviews.'
    }
  ],

  ADMIN: [
    {
      href: '/dashboard/jobs',
      label: 'Jobs',
      icon: BriefcaseBusiness,
      description: 'Manage platform jobs.'
    },
    {
      href: '/dashboard/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      description: 'Manage platform tasks.'
    },
    {
      href: '/dashboard/interviews',
      label: 'Interviews',
      icon: Video,
      description: 'Manage platform interviews.'
    }
  ],

  UNASSIGNED: []
};
/* ========================================================================= */
/* ROLE WORKSPACE NAVIGATION                                                */
/* ========================================================================= */

/**
 * Job seeker dashboard navigation.
 */
export const jobSeekerNavigation: NavigationGroup[] = [
  {
    label: 'Workspace',
    items: [
      {
        href: '/dashboard',
        label: 'Overview',
        icon: LayoutDashboard,
        description: 'Your workspace at a glance.'
      },
      {
        href: '/dashboard/jobs',
        label: 'Jobs',
        icon: BriefcaseBusiness,
        description: 'Discover and manage available opportunities.'
      },
      {
        href: '/dashboard/applications',
        label: 'Applications',
        icon: FileText,
        description: 'Track your job applications.'
      },
      {
        href: '/dashboard/interviews',
        label: 'Interviews',
        icon: Video,
        description: 'Keep track of your upcoming interviews.'
      },
      {
        href: '/dashboard/messages',
        label: 'Messages',
        icon: MessageSquare,
        description: 'Stay connected with your Job Rcentz network.'
      }
    ]
  },
  {
    label: 'Career',
    items: [
      {
        href: '/dashboard/portfolio',
        label: 'My Portfolio',
        icon: BriefcaseBusiness,
        description: 'Manage your professional portfolio.'
      },
      {
        href: '/dashboard/tasks',
        label: 'Tasks',
        icon: CheckSquare,
        description: 'Manage your career tasks.'
      },
      {
        href: '/dashboard/profile',
        label: 'Profile',
        icon: UserRound,
        description: 'Manage your personal profile.'
      }
    ]
  }
];

/**
 * Employer dashboard navigation.
 */
export const employerNavigation: NavigationGroup[] = [
  {
    label: 'Workspace',
    items: [
      {
        href: '/dashboard',
        label: 'Overview',
        icon: LayoutDashboard,
        description: 'Your company workspace at a glance.'
      },
      {
        href: '/dashboard/employer/jobs',
        label: 'Jobs',
        icon: BriefcaseBusiness,
        description: 'Manage your company job postings.'
      },
      {
        href: '/dashboard/employer/applications',
        label: 'Applications',
        icon: FileText,
        description: 'Review and manage candidate applications.'
      },
      {
        href: '/dashboard/employer/candidates',
        label: 'Candidates',
        icon: Users,
        description: 'Discover and manage potential candidates.'
      },
      {
        href: '/dashboard/employer/interviews',
        label: 'Interviews',
        icon: Video,
        description: 'Manage upcoming candidate interviews.'
      },
      {
        href: '/dashboard/employer/tasks',
        label: 'Tasks',
        icon: CheckSquare,
        description: 'Manage company hiring tasks.'
      }
    ]
  },
  {
    label: 'Company',
    items: [
      {
        href: '/dashboard/employer/company',
        label: 'Company Profile',
        icon: Building2,
        description: 'Manage your company information and presence.'
      },
      {
        href: '/dashboard/employer/invitations',
        label: 'Invitations',
        icon: Bell,
        description: 'Manage candidate invitations.'
      },
      {
        href: '/dashboard/profile',
        label: 'Profile',
        icon: UserRound,
        description: 'Manage your account profile.'
      }
    ]
  }
];

/**
 * Administrative dashboard navigation.
 */
export const adminNavigation: NavigationGroup[] = [
  {
    label: 'Administration',
    items: [
      {
        href: '/dashboard',
        label: 'Overview',
        icon: LayoutDashboard,
        description: 'Administrative overview.'
      },
      {
        href: '/dashboard/jobs',
        label: 'Jobs',
        icon: BriefcaseBusiness,
        description: 'Manage platform jobs.'
      },
      {
        href: '/dashboard/tasks',
        label: 'Tasks',
        icon: CheckSquare,
        description: 'Manage platform tasks.'
      },
      {
        href: '/dashboard/interviews',
        label: 'Interviews',
        icon: Video,
        description: 'Manage platform interviews.'
      },
      {
        href: '/dashboard/profile',
        label: 'Profile',
        icon: UserRound,
        description: 'Manage your administrator profile.'
      }
    ]
  }
];

/* ========================================================================= */
/* ROLE HELPERS                                                              */
/* ========================================================================= */

/**
 * Returns the complete dashboard workspace navigation for a role.
 */
export function getRoleNavigation(
  role?: UserRole | null
): NavigationGroup[] {
  switch (role) {
    case 'EMPLOYER':
      return employerNavigation;

    case 'ADMIN':
      return adminNavigation;

    case 'JOB_SEEKER':
      return jobSeekerNavigation;

    default:
      return [];
  }
}

/**
 * Returns the workspace label displayed in the dashboard sidebar.
 */
export function getWorkspaceName(
  role?: UserRole | null,
  companyName?: string | null
): string {
  switch (role) {
    case 'EMPLOYER':
      return companyName?.trim() || 'Employer';

    case 'ADMIN':
      return 'Administration';

    case 'JOB_SEEKER':
      return 'Job Seeker';

    default:
      return 'Job Rcentz';
  }
}

/**
 * Returns the role-specific action for the account.
 */
export function getRoleAction(
  role?: UserRole | null
): RoleAction | null {
  if (!role) return null;

  return (
    roleActions.find(action => action.roles.includes(role)) ?? null
  );
}

/**
 * Returns dashboard header shortcuts for a role.
 */
export function getDashboardHeaderNavigation(
  role?: UserRole | null
): NavigationItem[] {
  if (!role) return [];

  return dashboardHeaderNavigation[role] ?? [];
}

/* ========================================================================= */
/* ROUTE HELPERS                                                             */
/* ========================================================================= */

/**
 * Central route matching logic.
 *
 * `/dashboard` is intentionally exact so that nested dashboard routes do not
 * make the Overview/Dashboard item appear active.
 */
export function isNavigationItemActive(
  pathname: string,
  href: string
): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

/* ========================================================================= */
/* GLOBAL NAVIGATION                                                         */
/* ========================================================================= */

/**
 * Returns navigation for the global website header.
 *
 * Visitors:
 * - Find Jobs
 *
 * Authenticated users:
 * - Dashboard
 * - Find Jobs
 */
export function getGlobalNavigation(
  user?: CurrentUser | null
): NavigationItem[] {
  if (!user) {
    return publicNavigation;
  }

  return [
    ...authenticatedNavigation,
    ...publicNavigation
  ];
}

/* ========================================================================= */
/* PAGE CONTEXT                                                              */
/* ========================================================================= */

/**
 * Returns the title and description displayed by DashboardHeader.
 *
 * This keeps route metadata in one place instead of duplicating the mapping
 * inside the header component.
 */
export function getPageContext(
  pathname: string
): PageContext {
  /* ----------------------------------------------------------------------- */
  /* Dashboard                                                               */
  /* ----------------------------------------------------------------------- */

  if (pathname === '/dashboard') {
    return {
      title: 'Overview',
      description: 'Your workspace at a glance.'
    };
  }

  /* ----------------------------------------------------------------------- */
  /* Employer                                                                */
  /* ----------------------------------------------------------------------- */

  if (
    pathname === '/dashboard/employer/jobs' ||
    pathname.startsWith('/dashboard/employer/jobs/')
  ) {
    return {
      title: 'Jobs',
      description: 'Manage your company job postings.'
    };
  }

  if (
    pathname === '/dashboard/employer/applications' ||
    pathname.startsWith('/dashboard/employer/applications/')
  ) {
    return {
      title: 'Applications',
      description: 'Review and manage candidate applications.'
    };
  }

  if (
    pathname === '/dashboard/employer/candidates' ||
    pathname.startsWith('/dashboard/employer/candidates/')
  ) {
    return {
      title: 'Candidates',
      description: 'Discover and manage candidates.'
    };
  }

  if (
    pathname === '/dashboard/employer/interviews' ||
    pathname.startsWith('/dashboard/employer/interviews/')
  ) {
    return {
      title: 'Interviews',
      description: 'Manage upcoming candidate interviews.'
    };
  }

  if (
    pathname === '/dashboard/employer/tasks' ||
    pathname.startsWith('/dashboard/employer/tasks/')
  ) {
    return {
      title: 'Tasks',
      description: 'Manage company hiring tasks.'
    };
  }

  if (
    pathname === '/dashboard/employer/company' ||
    pathname.startsWith('/dashboard/employer/company/')
  ) {
    return {
      title: 'Company Profile',
      description: 'Manage your company information and presence.'
    };
  }

  if (
    pathname === '/dashboard/employer/invitations' ||
    pathname.startsWith('/dashboard/employer/invitations/')
  ) {
    return {
      title: 'Invitations',
      description: 'Manage candidate invitations.'
    };
  }

  /* ----------------------------------------------------------------------- */
  /* Job Seeker / Shared Dashboard                                           */
  /* ----------------------------------------------------------------------- */

  if (
    pathname === '/dashboard/jobs' ||
    pathname.startsWith('/dashboard/jobs/')
  ) {
    return {
      title: 'Jobs',
      description: 'Discover and manage available opportunities.'
    };
  }

  if (
    pathname === '/dashboard/applications' ||
    pathname.startsWith('/dashboard/applications/')
  ) {
    return {
      title: 'Applications',
      description: 'Track your job applications.'
    };
  }

  if (
    pathname === '/dashboard/interviews' ||
    pathname.startsWith('/dashboard/interviews/')
  ) {
    return {
      title: 'Interviews',
      description: 'Keep track of your upcoming interviews.'
    };
  }

  if (
    pathname === '/dashboard/messages' ||
    pathname.startsWith('/dashboard/messages/')
  ) {
    return {
      title: 'Messages',
      description: 'Stay connected with your Job Rcentz network.'
    };
  }

  if (
    pathname === '/dashboard/portfolio' ||
    pathname.startsWith('/dashboard/portfolio/')
  ) {
    return {
      title: 'Portfolio',
      description: 'Manage your professional portfolio.'
    };
  }

  if (
    pathname === '/dashboard/tasks' ||
    pathname.startsWith('/dashboard/tasks/')
  ) {
    return {
      title: 'Tasks',
      description: 'Manage your tasks and responsibilities.'
    };
  }

  /* ----------------------------------------------------------------------- */
  /* Account / Notifications                                                 */
  /* ----------------------------------------------------------------------- */

  if (
    pathname === '/dashboard/notifications' ||
    pathname.startsWith('/dashboard/notifications/')
  ) {
    return {
      title: 'Notifications',
      description: 'Stay up to date with your Job Rcentz activity.'
    };
  }

  if (
    pathname === '/dashboard/profile' ||
    pathname.startsWith('/dashboard/profile/')
  ) {
    return {
      title: 'Profile',
      description: 'Manage your personal profile.'
    };
  }

  if (
    pathname === '/dashboard/settings' ||
    pathname.startsWith('/dashboard/settings/')
  ) {
    return {
      title: 'Settings',
      description: 'Manage your account settings.'
    };
  }

  /* ----------------------------------------------------------------------- */
  /* Fallback                                                                 */
  /* ----------------------------------------------------------------------- */

  return {
    title: 'Dashboard',
    description: 'Manage your Job Rcentz workspace.'
  };
}

/* ========================================================================= */
/* SETTINGS                                                                  */
/* ========================================================================= */

export const settingsNavigation: NavigationItem[] = [
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: UserRound
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings
  }
];