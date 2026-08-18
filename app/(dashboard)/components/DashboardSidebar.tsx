'use client';

import Link from 'next/link';
import { BriefcaseBusiness, LayoutDashboard, UserRound } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import LogoContainer from '@/components/website/LogoContainer';

const navigation = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: UserRound
  },
  {
    label: 'Jobs',
    href: '/dashboard/jobs',
    icon: BriefcaseBusiness
  }
];

export default function DashboardSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <LogoContainer href="/" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map(item => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={buttonVariants({
                variant: 'ghost',
                className: 'w-full justify-start gap-3'
              })}>
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="px-2 text-xs text-muted-foreground">JobMan</p>
      </div>
    </aside>
  );
}
