import GenuinePartsClient from '@/components/genuine-parts-client';
import { Suspense } from 'react';
import GenuinePartsLoadingSkeleton from '@/components/genuine-parts-loading-skeleton';

export default function GenuinePartsPage() {
  return (
    <Suspense fallback={<GenuinePartsLoadingSkeleton />}>
      <GenuinePartsClient />
    </Suspense>
  );
}
