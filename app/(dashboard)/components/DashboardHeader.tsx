'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';

import UserHelperSheet, { type UserHelperUser } from '@/components/website/UserHelperSheet';

import { Button, buttonVariants } from '@/components/ui/button';

interface DashboardHeaderProps {
  user: DashboardUser;
}

const headerContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
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
      description: 'Your hiring workspace at a glance.'
    };
  }

  if (pathname.startsWith('/dashboard/jobs')) {
    return {
      title: 'Jobs',
      description: 'Manage your company job postings.'
    };
  }

  if (pathname.startsWith('/dashboard/applications')) {
    return {
      title: 'Applications',
      description: 'Review and manage candidate applications.'
    };
  }

  if (pathname.startsWith('/dashboard/candidates')) {
    return {
      title: 'Candidates',
      description: 'Discover and manage potential candidates.'
    };
  }

  if (pathname.startsWith('/dashboard/interviews')) {
    return {
      title: 'Interviews',
      description: 'Manage your upcoming candidate interviews.'
    };
  }

  if (pathname.startsWith('/dashboard/messages')) {
    return {
      title: 'Messages',
      description: 'Stay connected with candidates and employers.'
    };
  }

  if (pathname.startsWith('/dashboard/invitations')) {
    return {
      title: 'Invitations',
      description: 'Manage your candidate invitations.'
    };
  }

  if (pathname.startsWith('/dashboard/notifications')) {
    return {
      title: 'Notifications',
      description: 'Stay up to date with your JobMan activity.'
    };
  }

  if (pathname.startsWith('/dashboard/employer/company')) {
    return {
      title: 'Company Profile',
      description: 'Manage your company information and presence.'
    };
  }

  if (pathname.startsWith('/dashboard/profile')) {
    return {
      title: 'Profile',
      description: 'Manage your personal account profile.'
    };
  }

  if (pathname.startsWith('/dashboard/settings')) {
    return {
      title: 'Settings',
      description: 'Manage your account preferences.'
    };
  }

  return {
    title: 'Dashboard',
    description: 'Manage your JobMan account.'
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

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  const displayName = user.name?.trim() || 'User';

  const roleLabel = getRoleLabel(user.role);

  /*
   * Resolve the user's actual identity.
   */
  const profileImage = user.jobSeeker?.profilePhotoUrl ?? user.company?.companyLogoUrl ?? user.image;

  const jobTitle =
    user.jobSeeker?.currentRole ?? user.jobSeeker?.headline ?? user.company?.companyIndustry ?? null;

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

  const showEmployerQuickAction = user.role === 'EMPLOYER';

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <motion.div
        variants={headerContentVariants}
        initial="hidden"
        animate="visible"
        className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* ====================================================== */}
        {/* Page context */}
        {/* ====================================================== */}

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold leading-none">{page.title}</h1>

          <p className="mt-1 hidden truncate text-xs text-muted-foreground sm:block">{page.description}</p>
        </div>

        {/* ====================================================== */}
        {/* Right side */}
        {/* ====================================================== */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Search */}

          <Button type="button" variant="ghost" size="icon" className="size-9" aria-label="Search">
            <Search className="size-4" />
          </Button>

          {/* ================================================== */}
          {/* Employer quick action */}
          {/* ================================================== */}

          {showEmployerQuickAction && (
            <Link
              href="/dashboard/jobs/create"
              className={buttonVariants({
                size: 'sm',
                className: 'hidden gap-2 sm:flex'
              })}>
              <Plus className="size-4" />
              Post Job
            </Link>
          )}

          {/* ================================================== */}
          {/* Account identity */}
          {/* ================================================== */}

          <div className="flex items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="max-w-48 truncate text-sm font-medium">{displayName}</p>

              <p className="max-w-48 truncate text-xs text-muted-foreground">{profileSubtitle}</p>
            </div>

            <UserHelperSheet user={userHelperData} />
          </div>
        </div>
      </motion.div>
    </header>
  );
}
