import React, { useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, currentProductId }) => {
  const currentProduct = products.find(p => p.id === currentProductId);

  const displayedProducts = useMemo(() => {
    if (currentProduct?.relatedProductIds && currentProduct.relatedProductIds.length > 0) {
      const explicit = currentProduct.relatedProductIds
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => Boolean(p && p.id !== currentProductId));
      if (explicit.length > 0) return explicit;
    }
    // Fallback: Same category or other products excluding current
    const sameCategory = products.filter(
      p => p.id !== currentProductId && p.category === currentProduct?.category
    );
    if (sameCategory.length >= 2) {
      return sameCategory.slice(0, 4);
    }
    return products.filter(p => p.id !== currentProductId).slice(0, 4);
  }, [products, currentProduct, currentProductId]);

  if (displayedProducts.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 bg-[#E30613] rounded-full" />
        <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">
          Related Products
        </h3>
      </div>

      {/* 2-column mobile layout and 4-column desktop grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {displayedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
