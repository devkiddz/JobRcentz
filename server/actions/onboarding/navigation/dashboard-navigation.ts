import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UserRound,
  UsersRound
} from 'lucide-react';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';

export type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  inactive?: boolean;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const employerNavigation: NavigationGroup[] = [
  {
    label: 'Workspace',
    items: [
      {
        label: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard
      },
      {
        label: 'Jobs',
        href: '/dashboard/employer/jobs',
        icon: BriefcaseBusiness
      },
      {
        label: 'Applications',
        href: '/dashboard/employer/applications',
        icon: ClipboardList
      },
      {
        label: 'Candidates',
        href: '/dashboard/employer/candidates',
        icon: UsersRound,
        inactive: true
      },
      {
        label: 'Interviews',
        href: '/dashboard/employer/interviews',
        icon: CalendarDays,
        inactive: true
      }
    ]
  },
  {
    label: 'Communication',
    items: [
      {
        label: 'Messages',
        href: '/dashboard/messages',
        icon: MessageSquare,
        inactive: true
      },
      {
        label: 'Invitations',
        href: '/dashboard/employer/invitations',
        icon: FileText,
        inactive: true
      },
      {
        label: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        inactive: true
      }
    ]
  },
  {
    label: 'Company',
    items: [
      {
        label: 'Company Profile',
        href: '/dashboard/employer/company',
        icon: Building2
      }
    ]
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: UserRound
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Settings
      }
    ]
  }
];

const jobSeekerNavigation: NavigationGroup[] = [
  {
    label: 'Workspace',
    items: [
      {
        label: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard
      },
      {
        label: 'Jobs',
        href: '/dashboard/jobs',
        icon: BriefcaseBusiness
      },
      {
        label: 'Applications',
        href: '/dashboard/applications',
        icon: ClipboardList
      },
      {
        label: 'Interviews',
        href: '/dashboard/interviews',
        icon: CalendarDays,
        inactive: true
      }
    ]
  },
  {
    label: 'Communication',
    items: [
      {
        label: 'Messages',
        href: '/dashboard/messages',
        icon: MessageSquare,
        inactive: true
      },
      {
        label: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        inactive: true
      }
    ]
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: UserRound
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Settings
      }
    ]
  }
];

export function getDashboardNavigation(
  role: DashboardUser['role']
): NavigationGroup[] {
  switch (role) {
    case 'EMPLOYER':
      return employerNavigation;

    case 'JOB_SEEKER':
      return jobSeekerNavigation;

    case 'ADMIN':
      return employerNavigation;

    default:
      return [];
  }
}