'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BriefcaseBusiness,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  Loader2,
  LogOut,
  Settings,
  UserRound
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

import { commonAccountNavigation, getRoleAction } from './navigation';

export interface UserHelperUser {
  id?: string;
  name: string;
  email: string;
  image?: string | null;
  role?: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN' | 'UNASSIGNED';

  profileImage?: string | null;
  jobTitle?: string | null;
  companyName?: string | null;
  isEmployed?: boolean | null;
}

interface UserHelperSheetProps {
  user: UserHelperUser;
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('') || 'U'
  );
}

function getRoleLabel(role?: UserHelperUser['role']) {
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

function getNavigationIcon(label: string) {
  switch (label) {
    case 'Dashboard':
      return LayoutDashboard;

    case 'Profile':
      return UserRound;

    case 'Find Jobs':
      return BriefcaseBusiness;

    case 'My Portfolio':
      return FolderKanban;

    case 'Post a Job':
      return FilePlus2;

    case 'Settings':
      return Settings;

    default:
      return BriefcaseBusiness;
  }
}

export default function UserHelperSheet({ user }: UserHelperSheetProps) {
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const displayName = user.name?.trim() || 'User';
  const initials = getInitials(displayName);
  const roleLabel = getRoleLabel(user.role);

  const profileImage = user.profileImage ?? user.image ?? undefined;

  const roleAction = getRoleAction(user.role);

  const quickAccess = [...commonAccountNavigation, ...(roleAction ? [roleAction] : [])];

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error('Sign out failed:', error);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Sheet>
      {/* Account trigger */}
      <SheetTrigger
        type="button"
        aria-label="Open account menu"
        className="flex size-10 shrink-0 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
        <Avatar className="size-9 border bg-muted">
          <AvatarImage src={profileImage} alt={`${displayName}'s profile`} />

          <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
            {initials || <UserRound className="size-4" />}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>

      <SheetContent side="right" className="w-[320px] overflow-y-auto p-0 sm:w-[380px]">
        {/* Header */}
        <SheetHeader className="border-b px-6 py-6 text-left">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 shrink-0 border">
              <AvatarImage src={profileImage} alt={`${displayName}'s profile`} />

              <AvatarFallback className="bg-primary text-base font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <SheetTitle className="truncate text-base">{displayName}</SheetTitle>

              <SheetDescription className="truncate text-xs">{user.email}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-5 p-5">
          {/* Account context */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName}</p>

                <p className="mt-1 text-xs text-muted-foreground">{roleLabel}</p>
              </div>

              {user.jobTitle && (
                <span className="max-w-32 truncate rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {user.jobTitle}
                </span>
              )}
            </div>

            {user.companyName && (
              <p className="mt-3 truncate text-xs text-muted-foreground">{user.companyName}</p>
            )}
          </div>

          {/* Quick access */}
          <div className="space-y-1">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Quick access
            </p>

            {quickAccess.map(item => {
              const Icon = getNavigationIcon(item.label);

              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted">
                  <Icon className="size-4 shrink-0" />

                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t" />

          {/* Appearance */}
          <div className="flex min-h-11 items-center justify-between px-3">
            <div>
              <p className="text-sm font-medium">Appearance</p>

              <p className="text-xs text-muted-foreground">Change the theme</p>
            </div>

            <ThemeToggle />
          </div>

          <div className="border-t" />

          {/* Sign out */}
          <Button
            type="button"
            variant="ghost"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="h-11 justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive">
            {isSigningOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}

            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
