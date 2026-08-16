import { buttonVariants } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h3>
        Hello world{' '}
        <Link
          href="/onboarding"
          className={buttonVariants({
            variant: 'outline',
            className: 'gap-2'
          })}>
          Onboarding
          <MoveRight className="h-4 w-4" />
        </Link>
      </h3>
    </div>
  );
}
