
import { products } from "@/lib/products";
import ProductDetailClient from "@/components/product-detail-client";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient productId={params.id} />;
}
