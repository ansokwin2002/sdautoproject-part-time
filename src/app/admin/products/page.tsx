'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/products/list');
  }, [router]);

  return (
    <div>
      <p>Redirecting to Product List...</p>
    </div>
  );
}
