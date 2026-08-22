'use client';

import { usePathname } from 'next/navigation';

import NotificationBell from './NotificationBell';
import { DashboardSidebarToggle } from './DashboardSidebar';
import { motion, type Variants } from 'framer-motion';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';

import UserHelperSheet, { type UserHelperUser } from '@/components/website/UserHelperSheet';


interface DashboardHeaderProps {
  user: DashboardUser;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const headerContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -6
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

type PageContext = {
  title: string;
  description: string;
};

function getPageContext(pathname: string): PageContext {
  if (pathname === '/dashboard') {
    return {
      title: 'Overview',
      description: 'Your workspace at a glance.'
    };
  }

  if (pathname === '/dashboard/employer/jobs' || pathname.startsWith('/dashboard/employer/jobs/')) {
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
      description: 'Discover and manage potential candidates.'
    };
  }

  if (
    pathname === '/dashboard/employer/interviews' ||
    pathname.startsWith('/dashboard/employer/interviews/')
  ) {
    return {
      title: 'Interviews',
      description: 'Manage your upcoming candidate interviews.'
    };
  }

  if (pathname === '/dashboard/employer/company' || pathname.startsWith('/dashboard/employer/company/')) {
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

  if (pathname === '/dashboard/jobs' || pathname.startsWith('/dashboard/jobs/')) {
    return {
      title: 'Jobs',
      description: 'Discover and manage available opportunities.'
    };
  }

  if (pathname === '/dashboard/applications' || pathname.startsWith('/dashboard/applications/')) {
    return {
      title: 'Applications',
      description: 'Track your job applications.'
    };
  }

  if (pathname === '/dashboard/interviews' || pathname.startsWith('/dashboard/interviews/')) {
    return {
      title: 'Interviews',
      description: 'Keep track of your upcoming interviews.'
    };
  }

  if (pathname === '/dashboard/messages' || pathname.startsWith('/dashboard/messages/')) {
    return {
      title: 'Messages',
      description: 'Stay connected with your JobMan network.'
    };
  }

  if (pathname === '/dashboard/notifications' || pathname.startsWith('/dashboard/notifications/')) {
    return {
      title: 'Notifications',
      description: 'Stay up to date with your JobMan activity.'
    };
  }

  if (pathname === '/dashboard/profile' || pathname.startsWith('/dashboard/profile/')) {
    return {
      title: 'Profile',
      description: 'Manage your personal profile.'
    };
  }

  return {
    title: 'Dashboard',
    description: 'Manage your JobMan workspace.'
  };
}

function getRoleLabel(role: DashboardUser['role']) {
  switch (role) {
    case 'JOB_SEEKER':
      return 'Job Seeker';

    case 'EMPLOYER':
      return 'Employer';

    case 'ADMIN':
      return 'Administrator';

    default:
      return 'Account';
  }
}

export default function DashboardHeader({ user, sidebarOpen, onSidebarToggle }: DashboardHeaderProps) {
  const pathname = usePathname();

  const displayName = user.name?.trim() || 'User';
  const roleLabel = getRoleLabel(user.role);

  const profileImage = user.jobSeeker?.profilePhotoUrl ?? user.company?.companyLogoUrl ?? user.image;

  const jobTitle = user.jobSeeker?.currentRole ?? user.jobSeeker?.headline ?? null;

  const companyName = user.company?.companyName ?? null;

  const profileSubtitle = companyName ?? jobTitle ?? roleLabel;

  const page = getPageContext(pathname);

  const userHelperData: UserHelperUser = {
    id: user.id,
    name: displayName,
    email: user.email,
    image: user.image,
    profileImage,
    role: user.role,
    jobTitle,
    companyName
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <motion.div
        variants={headerContentVariants}
        initial="hidden"
        animate="visible"
        className="flex min-h-14 items-center justify-between gap-3 px-4 sm:min-h-16 sm:px-6 lg:px-8">
        {/* Page context */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <DashboardSidebarToggle open={sidebarOpen} onClick={onSidebarToggle} />
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{page.title}</h1>
          </div>

          <p className="mt-0.5 hidden max-w-2xl truncate text-xs text-muted-foreground sm:block">
            {page.description}
          </p>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Notifications */}
          <NotificationBell />

          {/* Divider */}
          <div aria-hidden="true" className="mx-1 hidden h-7 w-px bg-border sm:block" />

          {/* Account identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            <UserHelperSheet user={userHelperData} />

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-48 truncate text-sm font-medium leading-5">{displayName}</p>

              <p className="max-w-48 truncate text-[11px] leading-4 text-muted-foreground">
                {profileSubtitle}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
