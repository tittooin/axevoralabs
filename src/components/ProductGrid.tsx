'use client';

import React from 'react';
import { Product } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';

interface ProductGridProps {
  productsList: Product[];
  isLoading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ productsList, isLoading }) => {
  const { setSelectedProduct } = useCart();

  if (isLoading) {
    return (
      <section id="catalog-view" className="py-20 px-6 max-w-7xl mx-auto text-center min-h-[40vh] flex flex-col justify-center items-center font-mono">
        <div className="w-10 h-10 border-2 border-crimson border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase">SYNCING APPAREL CATALOG FROM QIKINK WAREHOUSE...</p>
      </section>
    );
  }

  return (
    <section id="catalog-view" className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
      {/* Editorial Catalog Heading */}
      <div className="mb-20 text-center select-none">
        <span className="text-[10px] sm:text-xs font-mono text-crimson tracking-[0.35em] uppercase font-bold mb-3 block">
          CURATED STYLES // READY TO SHIP
        </span>
        <h3 className="text-3xl md:text-4xl font-sans font-bold text-foreground tracking-[0.1em] uppercase">
          LAUNCH CATALOG
        </h3>
        <p className="text-zinc-500 text-xs sm:text-sm font-sans tracking-wide mt-3 max-w-md mx-auto leading-relaxed">
          Select an apparel piece below to view exact measurements, material specs, and secure your order before batch exhaustion.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {productsList.map((product) => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)}
            className="group flex flex-col cursor-pointer border border-border-tactical bg-white shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col justify-between tactical-corners hover:border-zinc-400 transition-all duration-300 relative"
          >
            {/* Scarcity notification indicator - Clean and professional */}
            <div className="absolute top-4 right-4 z-10 font-mono text-[9px] text-white font-bold tracking-widest bg-crimson px-3 py-1 uppercase">
              {product.scarcityText.split('//').pop()?.trim()}
            </div>

            {/* PRODUCT CARD IMAGE WRAPPER */}
            <div className="relative aspect-[4/5] w-full bg-[#FAF9F6] border-b border-border-tactical flex items-center justify-center p-8 overflow-hidden">
              {/* Luxury radial overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.01] opacity-75"></div>
              
              <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-102">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* View button overlay */}
              <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-6 py-3.5 bg-foreground text-background font-mono text-xs font-bold tracking-[0.2em] uppercase clip-diagonal transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-md">
                  VIEW DETAILS
                </span>
              </div>
            </div>

            {/* PRODUCT DETAILS FOOTER */}
            <div className="p-6 flex flex-col justify-between flex-grow bg-white">
              <div className="space-y-2 mb-4">
                <span className="text-[9px] font-mono text-crimson tracking-[0.25em] font-bold uppercase">
                  {product.categoryLabel}
                </span>
                <h4 className="text-sm font-sans font-bold text-foreground tracking-wide uppercase group-hover:text-crimson transition-colors duration-300 line-clamp-1">
                  {product.name}
                </h4>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border-tactical text-xs font-mono">
                <span className="text-zinc-400">FULFILLMENT: SECURE POD</span>
                <span className="text-sm font-bold text-foreground tracking-widest font-mono">
                  ${product.price}.00
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
