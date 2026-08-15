import React from 'react';
import { Cog } from 'lucide-react';
import Link from 'next/link';

export default function LogoContainer() {
  return (
    <Link href="/" className="text-xl font-bold flex flext-col items-center gap-1">
      <div>
        <span className="text-primary">
          <Cog size={22} className="animate-spin" />
        </span>
      </div>
      <div>
        Job<span className="text-primary font-bold">Rcentz</span>
      </div>
    </Link>
  );
}
