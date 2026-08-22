'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import type { NavigationItem } from './navigation';

interface MobileNavSheetProps {
  navigation: NavigationItem[];
}

export default function MobileNavSheet({ navigation }: MobileNavSheetProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        type="button"
        aria-label="Open navigation menu"
        className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden">
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[min(20rem,calc(100vw-2rem))] p-0">
        <SheetHeader className="border-b px-5 py-5 text-left">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-4">
          {navigation.map(item => {
            const isActive =
              pathname === item.href || (item.href !== '/jobs' && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
