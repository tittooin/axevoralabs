'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/data/products';
import BrandLogo from '@/components/BrandLogo';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import ProductDetail from '@/components/ProductDetail';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';

export default function Home() {
  const { totalCount, setCartOpen } = useCart();
  
  // Dynamic Catalog State fetching from Qikink route
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const response = await fetch('/api/qikink/products');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.products)) {
          setProductsList(data.products);
        }
      } catch (error) {
        console.error('Failed to sync catalog from secure gateway API:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCatalog();
  }, []);

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden selection:bg-crimson selection:text-white creamy-flow-bg">
      {/* Dynamic structural HUD grid overlay (Subtle warm look) */}
      <div className="absolute inset-0 tactical-grid opacity-[0.4] pointer-events-none z-0"></div>

      {/* TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 w-full bg-[#FAF8F5]/80 backdrop-blur-md border-b border-border-tactical px-6 py-4 flex justify-between items-center select-none">
        
        {/* Brand Logo with Custom Wordmark */}
        <a href="#" className="flex items-center">
          <BrandLogo variant="full" height={32} />
        </a>

        {/* Dynamic drop active status badge */}
        <div className="hidden lg:flex items-center gap-2.5 border border-crimson/20 bg-crimson/5 px-3.5 py-1.5 font-mono text-[9px] text-crimson tracking-[0.25em] uppercase font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse"></span>
          <span>LAUNCH DROP LIVE</span>
        </div>

        {/* Right Navigation: Secure Cart harness trigger */}
        <div className="flex items-center gap-4 select-none">
          <button
            onClick={() => setCartOpen(true)}
            className="group px-4.5 py-2.5 border border-border-tactical hover:border-foreground bg-white text-foreground transition-all duration-300 flex items-center gap-3 font-mono text-xs cursor-pointer shadow-sm"
          >
            {/* SVG Cart Icon */}
            <svg 
              viewBox="0 0 24 24" 
              width="15" 
              height="15" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="group-hover:stroke-crimson transition-colors"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="tracking-[0.15em] hidden sm:inline uppercase">CART HARNESS</span>
            <span className="bg-crimson text-white px-2 py-0.5 text-[9px] font-bold tracking-normal">
              {totalCount}
            </span>
          </button>
        </div>
      </nav>

      {/* CORE STOREFRONT CONTENT */}
      <main className="flex-grow flex flex-col relative z-10">
        {/* Editorial Clean Hero */}
        <HeroSection />

        {/* Dynamic Catalog Grid */}
        <ProductGrid productsList={productsList} isLoading={isLoading} />
      </main>

      {/* TACTICAL LUXURY LIGHT FOOTER */}
      <footer className="w-full bg-[#F3EEE5]/60 border-t border-border-tactical py-14 px-6 relative z-10 text-zinc-500 font-mono text-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2.5">
            <BrandLogo variant="wordmark" color="charcoal" />
            <p className="text-[10px] text-zinc-400 tracking-wider mt-1.5">
              © {new Date().getFullYear()} AXEVORA STORES. POWERED BY QIKINK FULFILLMENT.
            </p>
          </div>

          {/* Quick HUD links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[9px] tracking-[0.2em] text-zinc-400">
            <a href="#" className="hover:text-foreground transition-colors duration-200 uppercase">// FULFILLMENT_DETAILS</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200 uppercase">// TERMS_PROTOCOL</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200 uppercase">// SYSTEM_CONTACT</a>
          </div>

          <div className="flex items-center gap-2 border border-border-tactical px-3 py-1 text-[9px] text-zinc-400 tracking-widest uppercase bg-white/40">
            <span>SECURE CHECKOUT SHIELD</span>
          </div>
        </div>
      </footer>

      {/* DRAWER & MODAL TRIGGERS */}
      <ProductDetail />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}
