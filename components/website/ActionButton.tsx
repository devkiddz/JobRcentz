'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Loader2, LogOut, Menu, Settings, User } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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

  const [isSigningOut, setIsSigningOut] = React.useState(false);

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

  /*
   * Session loading
   */
  if (isPending) {
    return (
      <Button type="button" variant="ghost" size="icon" disabled aria-label="Loading account">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  /*
   * Guest
   */
  if (!session) {
    return (
      <div className="flex items-center gap-2">
        {/* <ThemeToggle /> */}

        <Link
          href="/login"
          className={buttonVariants({
            variant: 'default',
            className: 'min-h-10 bg-primary px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90'
          })}>
          Get Started for free
        </Link>
      </div>
    );
  }

  const user = session.user;

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <>
      {/* =========================================================
          DESKTOP ACCOUNT MENU
      ========================================================= */}
      <div className="hidden items-center gap-3 md:flex">
        {/* <ThemeToggle /> */}

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <div className="flex items-center gap-2 bg-muted/30">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user.image || undefined} alt={user.name || 'User avatar'} />

                <AvatarFallback className="bg-primary text-white">{initials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-row items-center gap-1.5 truncate text-left">
                <p className="truncate text-sm font-semibold">{user.name || 'User'}</p>

                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-64">
            {/* Account information MUST be inside Group */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 py-1">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={user.image || undefined} alt={user.name || 'User avatar'} />

                    <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name || 'User'}</p>

                    <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push('/jobs')}>
              <Briefcase className="mr-2 h-4 w-4" />
              My Jobs
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive">
              {isSigningOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}

              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* =========================================================
          MOBILE ACCOUNT SHEET
      ========================================================= */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} alt={user.name || 'User avatar'} />

              <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <span className="sr-only">Open account menu</span>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] sm:w-[360px]">
            <div className="mt-6 flex flex-col gap-2">
              {/* Account card */}
              <div className="mb-4 flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={user.image || undefined} alt={user.name || 'User avatar'} />

                  <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name || 'User'}</p>

                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <Link
                href="/profile"
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'h-11 justify-start px-3'
                })}>
                <User className="mr-3 h-4 w-4" />
                Profile
              </Link>

              <Link
                href="/jobs"
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'h-11 justify-start px-3'
                })}>
                <Briefcase className="mr-3 h-4 w-4" />
                My Jobs
              </Link>

              <Link
                href="/settings"
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'h-11 justify-start px-3'
                })}>
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>

              <div className="my-2 border-t" />

              {/* Theme */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium">Appearance</span>

                <ThemeToggle />
              </div>

              <div className="my-2 border-t" />

              {/* Sign out */}
              <Button
                type="button"
                variant="destructive"
                disabled={isSigningOut}
                onClick={handleSignOut}
                className="h-11 w-full justify-start px-3">
                {isSigningOut ? (
                  <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-3 h-4 w-4" />
                )}

                {isSigningOut ? 'Signing out...' : 'Sign out'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
