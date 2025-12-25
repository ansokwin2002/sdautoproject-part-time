import ProductDetailClient, { ProductDetailSkeleton } from "@/components/product-detail-client";
import { Suspense } from "react";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient productId={params.id} />
    </Suspense>
  );
}
