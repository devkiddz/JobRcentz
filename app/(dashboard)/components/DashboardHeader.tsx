'use client';

import { motion, type Variants } from 'framer-motion';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';

import UserHelperSheet, { type UserHelperUser } from '@/components/website/UserHelperSheet';

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
  const displayName = user.name?.trim() || 'User';
  const roleLabel = getRoleLabel(user.role);

  /*
   * Resolve the actual profile identity from the dashboard object.
   */
  const profileImage = user.jobSeeker?.profilePhotoUrl ?? user.company?.companyLogoUrl ?? user.image;

  const jobTitle =
    user.jobSeeker?.currentRole ?? user.jobSeeker?.headline ?? user.company?.companyIndustry ?? null;

  const companyName = user.company?.companyName ?? null;

  const profileSubtitle = jobTitle ?? roleLabel;

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
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <motion.div
        variants={headerContentVariants}
        initial="hidden"
        animate="visible"
        className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Page context */}
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none">Dashboard</p>

          <p className="mt-1 truncate text-xs text-muted-foreground">Manage your JobMan account</p>
        </div>

        {/* Account */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="max-w-48 truncate text-sm font-medium">{displayName}</p>

            <p className="max-w-48 truncate text-xs text-muted-foreground">{profileSubtitle}</p>
          </div>

          <UserHelperSheet user={userHelperData} />
        </div>
      </motion.div>
    </header>
  );
}
