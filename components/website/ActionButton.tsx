'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  UserRound
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { ThemeToggle } from '../ui/ThemeToggle';

export default function ActionButton() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        }
      }
    });
  }

  if (isPending) {
    return null;
  }

  /*
   * Guest state
   */
  if (!session) {
    return (
      <Link
        href="/login"
        className={buttonVariants({
          variant: 'default',
          className: 'cursor-pointer bg-primary px-4 py-2 text-sm font-medium text-white'
        })}>
        Login
      </Link>
    );
  }

  const userName = session.user.name || 'JobMan Member';

  const userInitials = userName
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sheet>
      {/* Navbar account trigger */}
      <SheetTrigger className="group flex cursor-pointer items-center gap-2 rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={session.user.image || undefined} alt={userName} />

          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        <div className="text-left sm:block">
          <p className="max-w-[130px] truncate text-sm font-semibold leading-tight">
            Hi, {userName.split(' ')[0]}
          </p>

          <p className="text-xs text-muted-foreground">Member</p>
        </div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-dvh max-h-dvh w-full flex-col gap-0 overflow-hidden border-l border-border/60 bg-background p-0 sm:max-w-md">
        {/* Header */}
        <SheetHeader className="shrink-0 border-b border-border/60 px-6 pb-5 pt-6 text-left">
          <div className="min-w-0 pr-8">
            <SheetTitle className="text-lg font-bold">My JobMan</SheetTitle>

            <SheetDescription className="mt-1">Manage your account, jobs and preferences.</SheetDescription>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-6 px-6 py-6">
            {/* User identity */}
            <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4">
              <Avatar className="h-14 w-14 shrink-0 border border-border">
                <AvatarImage src={session.user.image || undefined} alt={userName} />

                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{userName}</p>

                <p className="truncate text-sm text-muted-foreground">{session.user.email}</p>

                <span className="mt-1 inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Member
                </span>
              </div>
            </div>

            {/* Main navigation */}
            <div className="space-y-1">
              <AccountLink
                href="/dashboard"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="Dashboard"
              />

              <AccountLink href="/profile" icon={<UserRound className="h-5 w-5" />} label="Profile" />

              <AccountLink href="/jobs" icon={<BriefcaseBusiness className="h-5 w-5" />} label="My Jobs" />

              <AccountLink
                href="/applications"
                icon={<FileText className="h-5 w-5" />}
                label="Applications"
              />

              <AccountLink href="/notifications" icon={<Bell className="h-5 w-5" />} label="Notifications" />

              <AccountLink href="/payments" icon={<CreditCard className="h-5 w-5" />} label="Payments" />

              <AccountLink
                href="/settings"
                icon={<Settings className="h-5 w-5" />}
                label="Account settings"
              />

              <AccountLink href="/support" icon={<CircleHelp className="h-5 w-5" />} label="Support" />
            </div>

            {/* Preferences */}
            <div className="border-t border-border/60 pt-5">
              <div className="flex items-center justify-between rounded-xl px-3 py-3">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 shrink-0 text-muted-foreground" />

                  <span className="text-sm font-medium">Theme</span>
                </div>

                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed sign out section */}
        <div className="shrink-0 border-t border-border/60 bg-background p-6">
          <Button
            type="button"
            variant="destructive"
            onClick={handleSignOut}
            className="h-11 w-full cursor-pointer font-semibold">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type AccountLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

function AccountLink({ href, label, icon }: AccountLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-primary">
      <span className="shrink-0 text-muted-foreground">{icon}</span>

      <span className="truncate">{label}</span>
    </Link>
  );
}
