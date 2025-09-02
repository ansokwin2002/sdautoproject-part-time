'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function PageLoadingIndicator() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // Simulate a short loading time

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run effect when pathname changes

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[9999] transition-all duration-300 ease-in-out',
        loading ? 'w-full opacity-100' : 'w-0 opacity-0'
      )}
    />
  );
}