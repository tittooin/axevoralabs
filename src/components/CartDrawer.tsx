'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setCartOpen, 
    removeItem, 
    updateQuantity, 
    totalAmount,
    setCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutTrigger = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Dark overlay background */}
      <div 
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      {/* Drawer panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white border-l border-border-tactical flex flex-col justify-between relative shadow-2xl">
          
          {/* Subtle grid lines background overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#12121201_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

          {/* HEADER */}
          <div className="p-6 border-b border-border-tactical flex justify-between items-center relative z-10 bg-[#FAF9F6]">
            <div>
              <h2 className="text-sm font-sans font-bold text-foreground tracking-[0.2em] uppercase">
                YOUR HARNESS
              </h2>
              <span className="text-[9px] text-zinc-400 tracking-wider">SELECTED LOADOUT</span>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="w-10 h-10 flex items-center justify-center border border-border-tactical hover:border-crimson hover:text-crimson bg-white text-zinc-500 font-mono text-sm transition-colors duration-300 shadow-sm"
            >
              ✕
            </button>
          </div>

          {/* CART ITEMS CONTAINER */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 relative z-10 bg-white">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-tactical bg-[#FAF9F6]">
                <span className="text-[10px] text-zinc-400 tracking-[0.3em] uppercase mb-3 block">
                  // HARNESS EMPTY
                </span>
                <p className="text-zinc-500 font-sans text-xs tracking-wide leading-relaxed">
                  No active tactical loadouts secured for Drop 01. Select apparel to dispatch.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.size}`} 
                  className="flex gap-4 p-4 border border-border-tactical bg-[#FAF9F6]/50 relative group hover:border-zinc-400 transition-colors duration-300"
                >
                  {/* Image container */}
                  <div className="w-20 h-20 bg-white border border-border-tactical flex items-center justify-center p-2 relative flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  </div>

                  {/* Item Description info */}
                  <div className="flex-grow flex flex-col justify-between text-xs min-w-0">
                    <div>
                      <h4 className="text-foreground font-sans font-bold tracking-wide uppercase truncate">
                        {item.product.name.split('/')[1]?.trim() || item.product.name}
                      </h4>
                      <p className="text-[9px] text-zinc-400 tracking-widest mt-1 uppercase">
                        SIZE: {item.size} // SKU: {item.sku.split('-')[1]}
                      </p>
                    </div>

                    {/* Quantity Adjustment Selector */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border-tactical bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-zinc-500 hover:text-foreground transition-colors text-[10px]"
                        >
                          -
                        </button>
                        <span className="px-3 text-[10px] text-foreground font-bold select-none font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-zinc-500 hover:text-foreground transition-colors text-[10px]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-foreground tracking-widest font-mono">
                        ${item.product.price * item.quantity}.00
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product.id, item.size)}
                    className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-crimson transition-colors text-[10px] p-1"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* FOOTER SUMMARY */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border-tactical bg-[#FAF9F6] relative z-10 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">SECURED APPAREL COUNT:</span>
                  <span className="text-foreground font-sans font-medium">{cart.reduce((t, i) => t + i.quantity, 0)} Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">FULFILLMENT DISPATCH:</span>
                  <span className="text-crimson font-bold uppercase tracking-wider">QIKINK AUTO SYNC</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border-tactical text-sm">
                  <span className="text-foreground font-bold tracking-wider">SUBTOTAL AMOUNT:</span>
                  <span className="text-crimson font-bold tracking-widest text-base">${totalAmount}.00</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutTrigger}
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>PROCEED TO SECURE CHECKOUT</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
