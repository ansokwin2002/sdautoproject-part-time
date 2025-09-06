import GenuinePartsClient from '@/components/genuine-parts-client';
import { Suspense } from 'react';

export default function GenuinePartsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenuinePartsClient />
    </Suspense>
  );
}
