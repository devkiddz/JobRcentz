import React from 'react';
import { Cog } from 'lucide-react';
import Link from 'next/link';

export default function LogoContainer() {
  return (
    <Link href="/" className="text-xl font-bold flex items-center gap-1">
      <span className="text-primary">
        <Cog size={22} className="animate-spin mt-2" />
      </span>
      <div>
        Job
        <span className="text-primary font-bold relative after:content-['.'] after:text-white after:animate-pulse after:text-3xl after:inline-block">
          Rcentz
        </span>
      </div>
    </Link>
  );
}
