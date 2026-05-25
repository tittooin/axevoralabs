'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    isCheckoutOpen, 
    setCheckoutOpen, 
    totalAmount,
    clearCart 
  } = useCart();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMode, setPaymentMode] = useState<'card' | 'upi' | 'crypto'>('card');

  // Request status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccessData, setCheckoutSuccessData] = useState<any | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCheckoutError(null);

    // Secure payload
    const payload = {
      customer: {
        name,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
      },
      items: cart.map(item => ({
        sku: item.sku,
        name: item.product.name,
        price: item.product.price,
        category: item.product.category,
        size: item.size,
        quantity: item.quantity
      })),
      totalAmount
    };

    try {
      const response = await fetch('/api/qikink/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Fulfillment sync failure.');
      }

      // Success
      setCheckoutSuccessData(data);
      clearCart();
    } catch (err: any) {
      setCheckoutError(err.message || 'Fulfiller node sync offline. Your loadout is secured locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setCheckoutSuccessData(null);
    setCheckoutOpen(false);
    // Reset form fields
    setName('');
    setEmail('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPincode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      {/* Background HUD grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#12121202_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

      {/* Main card */}
      <div className="relative w-full max-w-5xl bg-white border border-border-tactical p-6 md:p-10 flex flex-col gap-6 tactical-corners clip-diagonal overflow-hidden my-8 z-10 shadow-2xl">
        
        {/* SUCCESS TICKETING SCREEN */}
        {checkoutSuccessData ? (
          <div className="flex flex-col items-center justify-center text-center p-6 md:p-10 space-y-8 relative font-mono text-zinc-600">
            
            <div className="w-16 h-16 rounded-full border-2 border-crimson flex items-center justify-center glow-crimson bg-crimson/10">
              <span className="text-crimson font-bold text-xl">✓</span>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-foreground tracking-[0.2em] uppercase">
                ORDER SECURED // DISPATCHED
              </h2>
              <p className="text-[10px] text-zinc-400 tracking-wider mt-2">
                AXEVORA WAREHOUSE PROTOCOL DISPATCH // SUCCESSFUL
              </p>
            </div>

            {/* CYBERPUNK BOARDING PASS/TICKET */}
            <div className="w-full max-w-md border border-border-tactical bg-[#FAF9F6] p-6 relative font-mono text-left">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-crimson"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-crimson"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-crimson"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-crimson"></div>
              
              <div className="pb-3 border-b border-border-tactical flex justify-between text-[9px] text-zinc-400">
                <span>ORDER_ID // {checkoutSuccessData.orderId}</span>
                <span className="text-crimson">STAGE_LIVE</span>
              </div>

              <div className="mt-4 space-y-2 text-[11px] text-zinc-500 font-mono">
                <p className="flex justify-between">
                  <span className="text-zinc-400">DISPATCH NUMBER:</span>
                  <span className="text-foreground font-bold">{checkoutSuccessData.orderId}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-400">FULFILLMENT GATEWAY:</span>
                  <span className="text-foreground">QIKINK® AUTOMATED SYSTEM</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-400">SYSTEM MODE:</span>
                  <span className="text-crimson uppercase font-bold">{checkoutSuccessData.mode}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-400">LOGISTICS SCHED:</span>
                  <span className="text-foreground">DISPATCH IN 48 HOURS (EXPRESS)</span>
                </p>
                <div className="pt-3 border-t border-border-tactical mt-3 text-[10px] text-zinc-400 font-sans tracking-wide leading-relaxed">
                  <p>Order receipt and courier tracking link will be sent to <strong>{email}</strong> shortly. Thank you for locking in your AXEVORA launch drop piece.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSuccessClose}
              className="px-8 py-3.5 bg-foreground text-background font-mono text-xs font-bold tracking-[0.25em] uppercase hover:bg-crimson hover:text-white transition-all duration-300 clip-diagonal shadow-md"
            >
              RETURN TO APPAREL TERMINAL
            </button>
          </div>
        ) : (
          /* STANDARD FORM SUBMISSION SYSTEM */
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">
            {/* Close */}
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center border border-border-tactical hover:border-crimson hover:text-crimson bg-white text-zinc-500 font-mono text-sm transition-colors duration-300 shadow-sm"
            >
              ✕
            </button>

            {/* LEFT INPUT SECTION */}
            <div className="w-full md:w-3/5 space-y-6">
              <div>
                <h2 className="text-lg font-sans font-bold text-foreground tracking-widest uppercase">
                  SHIPPING DISPATCH PORTAL
                </h2>
                <p className="text-[10px] font-mono text-zinc-400 tracking-[0.2em] mt-1">SECURE PREPAID SHIPMENT INFORMATION</p>
              </div>

              {checkoutError && (
                <div className="p-3 bg-crimson/5 border border-crimson text-crimson font-mono text-xs tracking-wider">
                  // GATEWAY ALERT: {checkoutError}
                </div>
              )}

              <div className="space-y-4">
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500">
                    <label className="text-[9px] text-zinc-400 tracking-wider">01 // CUSTOMER NAME</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Full Name"
                      className="bg-[#FAF9F6] border border-border-tactical p-3.5 text-xs text-foreground placeholder-zinc-400 focus:outline-none focus:border-foreground transition-all rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500">
                    <label className="text-[9px] text-zinc-400 tracking-wider">02 // EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className="bg-[#FAF9F6] border border-border-tactical p-3.5 text-xs text-foreground placeholder-zinc-400 focus:outline-none focus:border-foreground transition-all rounded-none"
                    />
                  </div>
                </div>

                {/* Phone & Address1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500">
                    <label className="text-[9px] text-zinc-400 tracking-wider">03 // WHATSAPP CONTACT PHONE</label>
                    <input 
                      type="tel" 
                      required
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-Digit Mobile"
                      className="bg-[#FAF9F6] border border-border-tactical p-3.5 text-xs text-foreground placeholder-zinc-400 focus:outline-none focus:border-foreground transition-all rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500">
                    <label className="text-[9px] text-zinc-400 tracking-wider">04 // ADDRESS LINE 1</label>
                    <input 
                      type="text" 
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Flat No, Floor, Building Name"
                      className="bg-[#FAF9F6] border border-border-tactical p-3.5 text-xs text-foreground placeholder-zinc-400 focus:outline-none focus:border-foreground transition-all rounded-none"
                    />
                  </div>
                </div>

                {/* Address2 */}
                <div className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500">
                  <label className="text-[9px] text-zinc-400 tracking-wider">05 // ADDRESS LINE 2 (OPTIONAL)</label>
                  <input 
                    type="text" 
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Locality, Land Mark, Sector"
                    className="bg-[#FAF9F6] border border-border-tactical p-3.5 text-xs text-foreground placeholder-zinc-400 focus:outline-none focus:border-foreground transition-all rounded-none"
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500">
                    <label className="text-[9px] text-zinc-400 tracking-wider">06 // CITY</label>
                    <input 
                      type="text" 
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City Name"
                      className="bg-[#FAF9F6] border border-border-tactical p-3.5 text-xs text-foreground placeholder-zinc-400 focus:outline-none focus:border-foreground transition-all rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500">
                    <label className="text-[9px] text-zinc-400 tracking-wider">07 // STATE</label>
                    <input 
                      type="text" 
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State Name"
                      className="bg-[#FAF9F6] border border-border-tactical p-3.5 text-xs text-foreground placeholder-zinc-400 focus:outline-none focus:border-foreground transition-all rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 font-mono text-xs text-zinc-500">
                    <label className="text-[9px] text-zinc-400 tracking-wider">08 // PINCODE CODE</label>
                    <input 
                      type="text" 
                      required
                      pattern="[0-9]{6}"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Pincode (6 digits)"
                      className="bg-[#FAF9F6] border border-border-tactical p-3.5 text-xs text-foreground placeholder-zinc-400 focus:outline-none focus:border-foreground transition-all rounded-none"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT CONFIG */}
              <div className="space-y-3 font-mono text-xs text-zinc-500">
                <label className="text-[9px] text-zinc-400 tracking-wider">09 // SECURE PREPAID PAYMENT</label>
                <div className="grid grid-cols-3 gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('card')}
                    className={`py-3.5 text-[10px] font-bold border transition-all duration-300 ${
                      paymentMode === 'card' 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'bg-[#FAF9F6] text-zinc-500 border-border-tactical hover:border-zinc-400'
                    }`}
                  >
                    CREDIT/DEBIT CARD
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('upi')}
                    className={`py-3.5 text-[10px] font-bold border transition-all duration-300 ${
                      paymentMode === 'upi' 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'bg-[#FAF9F6] text-zinc-500 border-border-tactical hover:border-zinc-400'
                    }`}
                  >
                    UPI SECURE
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('crypto')}
                    className={`py-3.5 text-[10px] font-bold border transition-all duration-300 ${
                      paymentMode === 'crypto' 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'bg-[#FAF9F6] text-zinc-500 border-border-tactical hover:border-zinc-400'
                    }`}
                  >
                    MOCK CRYPTO
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN SUMMARY */}
            <div className="w-full md:w-2/5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border-tactical pt-6 md:pt-0 md:pl-8 font-mono text-xs text-zinc-500">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-sans font-bold text-foreground tracking-widest uppercase">
                    SECURED SUMMARY
                  </h3>
                  <span className="text-[9px] text-zinc-400 tracking-wider">VERIFY PRODUCTS IN CART</span>
                </div>

                {/* Items scroll */}
                <div className="max-h-60 overflow-y-auto space-y-3.5 pr-2 bg-white">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-center text-xs p-3 border border-border-tactical bg-[#FAF9F6]/50">
                      <div className="min-w-0">
                        <p className="text-foreground font-bold uppercase truncate">{item.product.name.split('/')[1]?.trim() || item.product.name}</p>
                        <p className="text-[9px] text-zinc-400 mt-0.5 font-mono">SIZE: {item.size} // QTY: {item.quantity}</p>
                      </div>
                      <span className="text-foreground font-bold ml-2 shrink-0">${item.product.price * item.quantity}.00</span>
                    </div>
                  ))}
                </div>

                {/* Math calculations */}
                <div className="space-y-2.5 border-t border-border-tactical pt-4 text-xs text-zinc-500">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">STREETWEAR SUB-TOTAL:</span>
                    <span className="text-foreground font-sans font-medium">${totalAmount}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">DISPATCH LOGISTICS:</span>
                    <span className="text-crimson font-bold uppercase tracking-wider">FREE DELIVERY</span>
                  </div>
                  <div className="flex justify-between border-t border-border-tactical pt-3.5 text-sm">
                    <span className="text-foreground font-bold">TOTAL CHARGE AMOUNT:</span>
                    <span className="text-crimson font-bold tracking-widest">${totalAmount}.00</span>
                  </div>
                </div>
              </div>

              {/* ACTION TRIGGER BUTTON */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 bg-crimson text-white font-sans font-bold text-xs tracking-[0.25em] uppercase hover:bg-foreground transition-all duration-300 clip-diagonal disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>SECURING TRANSACTION...</span>
                    </>
                  ) : (
                    <span>DISPATCH SECURE PREPAID ORDER</span>
                  )}
                </button>
                <div className="text-center mt-3.5 text-[9px] text-zinc-400 font-sans tracking-wide leading-relaxed">
                  🔒 Encrypted Transaction Gateway. Direct synchronized fulfillment via Qikink dispatch warehouses.
                </div>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default CheckoutModal;
