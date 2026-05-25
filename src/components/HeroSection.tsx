'use client';

import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[75vh] flex flex-col justify-center items-center text-center px-6 py-20 border-b border-border-tactical overflow-hidden creamy-flow-bg select-none">
      {/* Premium Minimalist Background HUD Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#12121202_1px,transparent_1px)] [background-size:32px_32px] opacity-70 z-0"></div>
      
      {/* Subtle Crimson Ambient Center Glow (Soft Warm Luxury feel) */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-crimson opacity-[0.015] blur-[120px] pointer-events-none z-0"></div>

      {/* Luxury Editorial Presentation Content */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center">
        
        {/* Elegant Minimalist Drop Tag */}
        <div className="mb-6 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson"></span>
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-crimson font-bold uppercase">
            EXCLUSIVE APPAREL DROP // BATCH 01
          </span>
        </div>

        {/* Massive Luxury Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-sans font-extrabold tracking-[0.15em] text-foreground leading-none uppercase mb-6 select-none">
          AXE<span className="text-crimson">VORA</span>
        </h1>

        {/* Drop Theme Name */}
        <h2 className="text-xs sm:text-sm font-mono text-zinc-500 tracking-[0.4em] uppercase mb-8">
          DROP 01 — THE MONSOON PROTOCOL
        </h2>

        {/* Highly Converting Conversion Copywriting */}
        <p className="text-sm sm:text-base text-zinc-600 font-sans tracking-wide max-w-xl leading-relaxed mb-12">
          Engineered for urban terrain and rain barrier protection. A strictly limited run of water-repellent heavyweight streetwear, crafted in small batches and dispatched instantly via secure Qikink fulfillment networks.
        </p>

        {/* CTA Buying trigger */}
        <div className="flex flex-col sm:flex-row gap-4 select-none">
          <a
            href="#catalog-view"
            className="px-10 py-4 bg-foreground text-background font-mono text-xs font-bold tracking-[0.25em] uppercase hover:bg-crimson hover:text-white transition-all duration-300 clip-diagonal text-center shadow-sm"
          >
            DISCOVER THE DROP
          </a>
          <div className="px-6 py-4 border border-border-tactical bg-white/50 backdrop-blur-sm text-zinc-500 font-mono text-xs tracking-wider flex items-center justify-center gap-2.5">
            <span>LIMITED RUN OF 100 PIECES GLOBALLY</span>
          </div>
        </div>

      </div>

      {/* Seamless Minimalist Ticker Line */}
      <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm py-2.5 border-t border-border-tactical overflow-hidden select-none">
        <div className="flex whitespace-nowrap text-[9px] font-mono text-zinc-400 tracking-[0.25em] uppercase">
          <div className="flex animate-[scroll_40s_linear_infinite] gap-16 shrink-0">
            <span>PREMIUM PRINT ON DEMAND ENGINE ACTIVE</span>
            <span>//</span>
            <span>SECURE PREPAID PAYMENT MATRIX</span>
            <span>//</span>
            <span>GLOBAL DISPATCH IN 48 HOURS</span>
            <span>//</span>
            <span>QIKINK INTEGRATED WAREHOUSE FULFILLMENT</span>
            <span>//</span>
          </div>
          <div className="flex animate-[scroll_40s_linear_infinite] gap-16 shrink-0" aria-hidden="true">
            <span>PREMIUM PRINT ON DEMAND ENGINE ACTIVE</span>
            <span>//</span>
            <span>SECURE PREPAID PAYMENT MATRIX</span>
            <span>//</span>
            <span>GLOBAL DISPATCH IN 48 HOURS</span>
            <span>//</span>
            <span>QIKINK INTEGRATED WAREHOUSE FULFILLMENT</span>
            <span>//</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
