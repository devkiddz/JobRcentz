'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

import type { DashboardUser } from '@/server/actions/dashboard/getDashboardUser';

interface DashboardShellProps {
  children: React.ReactNode;
  user: DashboardUser;
}

const sidebarVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -16
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut'
    }
  }
};

const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      delay: 0.08
    }
  }
};

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      delay: 0.15
    }
  }
};

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <motion.div variants={sidebarVariants} initial="hidden" animate="visible">
        <DashboardSidebar user={user} open={sidebarOpen} onOpenChange={setSidebarOpen} />
      </motion.div>

      <div className={sidebarOpen ? 'transition-[padding] duration-200 lg:pl-64' : 'transition-[padding] duration-200'}>
        <motion.div variants={headerVariants} initial="hidden" animate="visible">
          <DashboardHeader user={user} sidebarOpen={sidebarOpen} onSidebarToggle={() => setSidebarOpen(open => !open)} />
        </motion.div>

        <motion.main
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="min-h-[calc(100vh-4rem)]">
          {children}
        </motion.main>
      </div>
    </div>
  );
}
