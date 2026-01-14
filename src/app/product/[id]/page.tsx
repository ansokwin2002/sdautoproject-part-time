import ProductDetailClient, { ProductDetailSkeleton } from "@/components/product-detail-client";
import { Suspense } from "react";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient productId={id} />
    </Suspense>
  );
}