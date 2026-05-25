'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';

export const ProductDetail: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('L');

  if (!selectedProduct) return null;

  const handleClose = () => {
    setSelectedProduct(null);
    setSelectedSize('L');
  };

  const handleAddToCart = () => {
    const color = selectedProduct.colors[0] || 'Black';
    addItem(selectedProduct, selectedSize, color);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      {/* Background HUD grid (Subtle off-white look overlay) */}
      <div className="absolute inset-0 bg-[radial-gradient(#12121202_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="relative w-full max-w-5xl bg-white border border-border-tactical p-6 md:p-10 flex flex-col md:flex-row gap-10 tactical-corners clip-diagonal overflow-hidden my-8 shadow-2xl">
        
        {/* CLOSE TRIGGER */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center border border-border-tactical hover:border-crimson hover:text-crimson bg-white text-zinc-500 font-mono text-sm transition-colors duration-300 shadow-sm"
        >
          ✕
        </button>

        {/* LEFT COLUMN: LARGE PRODUCT PHOTO EDITORIAL */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <div className="relative aspect-square w-full bg-[#FAF9F6] border border-border-tactical flex items-center justify-center p-6 bg-[radial-gradient(#12121201_16px,transparent_1px)] [background-size:16px_16px]">
            {/* Minimal framing lines */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-300"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-300"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-zinc-300"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-zinc-300"></div>
            
            <div className="relative w-full h-full max-w-[90%] max-h-[90%]">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREMIUM USER DETAILS & SHOPPING GUIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-mono text-crimson tracking-[0.3em] uppercase font-bold mb-2 block">
                {selectedProduct.categoryLabel} // DROP 01
              </span>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-foreground tracking-wide uppercase leading-tight">
                {selectedProduct.name}
              </h2>
            </div>

            {/* Price display */}
            <div className="text-2xl font-bold text-foreground tracking-wider font-mono">
              ${selectedProduct.price}.00
            </div>

            {/* Simple Scarcity Alert - Conversions focus */}
            <div className="border border-crimson/30 bg-crimson/5 px-4 py-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse"></span>
              <span className="text-xs font-mono text-crimson font-bold tracking-widest uppercase">
                {selectedProduct.scarcityText}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 font-sans tracking-wide leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Size selection */}
            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>SELECT APPAREL SIZE</span>
                <span className="text-zinc-600 underline cursor-pointer hover:text-foreground transition-colors">FIT GUIDE</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-bold font-mono transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-[#FAF9F6] text-zinc-600 border-border-tactical hover:border-zinc-400'
                    } border rounded-none`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications list (Trust metrics) */}
            <div className="border-t border-border-tactical pt-5 font-mono text-xs text-zinc-500 space-y-3">
              <div className="text-[10px] text-zinc-400 tracking-widest uppercase font-bold mb-1">
                // TECHNICAL FEATURES & FABRIC
              </div>
              <ul className="list-disc pl-4 space-y-1.5 font-sans tracking-wide text-zinc-600">
                {selectedProduct.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
              <div className="pt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border-tactical/60 text-[11px] bg-[#FAF9F6] p-3 border">
                <p><span className="text-zinc-500">MATERIAL:</span> <span className="text-foreground font-sans font-medium">{selectedProduct.specifications.fabric}</span></p>
                <p><span className="text-zinc-500">GSM DENSITY:</span> <span className="text-foreground font-sans font-medium">{selectedProduct.specifications.weight}</span></p>
                <p><span className="text-zinc-500">SHIPPING:</span> <span className="text-foreground font-sans font-medium">2-Day Secure Express</span></p>
                <p><span className="text-zinc-500">ORIGIN:</span> <span className="text-foreground font-sans font-medium">{selectedProduct.specifications.origin}</span></p>
              </div>
            </div>

          </div>

          {/* BOTTOM BUTTON */}
          <div className="mt-8 pt-6 border-t border-border-tactical flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-4.5 bg-foreground hover:bg-crimson text-background hover:text-white font-sans font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 clip-diagonal text-center flex justify-center items-center gap-2 shadow-md"
            >
              <svg 
                viewBox="0 0 24 24" 
                width="14" 
                height="14" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>ADD TO TACTICAL HARNESS // SECURE</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
