import { NextResponse } from 'next/server';
import { products as curatedProducts } from '@/data/products';

export const runtime = 'edge';

export async function GET() {
  try {
    console.log('[AXEVORA SECURE GATEWAY] Fetching product catalog...');

    let liveProducts = [];

    // Check if Cloudflare KV is available
    const db = process.env.AXEVORA_DB as any;
    if (db) {
      try {
        const kvData = await db.get('products');
        if (kvData) {
          liveProducts = JSON.parse(kvData);
        }
      } catch (kvErr) {
        console.error('[AXEVORA] Error reading from Cloudflare KV:', kvErr);
      }
    }

    // If live products exist, serve them.
    if (Array.isArray(liveProducts) && liveProducts.length > 0) {
      console.log(`[AXEVORA] Serving ${liveProducts.length} live products pushed from Qikink.`);
      return NextResponse.json({
        success: true,
        source: 'qikink_kv_db',
        products: liveProducts,
      });
    }

    // Fallback to our curated collection if no products have been pushed yet
    console.log('[AXEVORA] Serving curated luxury launch collection as fallback.');
    
    const launchProducts = [
      {
        id: "axe-ts-01",
        name: 'AXEVORA / TS-01 "MONSOON PROTOCOL" OVERSIZED TEE',
        category: 'tshirt',
        categoryLabel: 'STREETWEAR T-SHIRTS',
        price: 85,
        sku: 'AXE-TS-01-MONSOON',
        image: '/images/tshirt.png',
        description: 'An oversized luxury technical streetwear t-shirt crafted for fluid motion in urban terrain. Made from premium ultra-weight combed cotton fibers treated with a hydrophobic splash-resistant nano-coating. Features a high-density, sharp minimalist wordmark chest branding in crisp contrast white.',
        details: [
          'Dropped shoulder silhouette with relaxed geometric drape',
          'Minimalist high-density chest puff print brand detailing',
          'Silicon splash-proof coating resistant to light showers',
          'Reinforced ribbed crewneck collar with tactile herringbone tape'
        ],
        scarcityText: 'DROP 01 // BATCH 01 // ONLY 5 LEFT',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Tactical Black'],
        specifications: {
          fabric: '100% Combed Organic Cotton with Hydrophobic Nano-Treatment',
          weight: '280 GSM Heavyweight Jersey knit',
          origin: 'Tokyo, Japan'
        }
      },
      {
        id: "axe-hd-01",
        name: 'AXEVORA / HD-01 "CYBER-SHIELD" TECHNICAL UTILITY HOODIE',
        category: 'hoodie',
        categoryLabel: 'TECH HOODIES',
        price: 190,
        sku: 'AXE-HD-01-CYBER',
        image: '/images/hoodie.png',
        description: 'An armor-like technical utility hoodie engineered for maximum environmental shield. Features custom weather-resistant composite nylon panels layered across the shoulder yoke and hood, complemented by bold center-chest AXEVORA graphic work and dynamic crimson accents.',
        details: [
          'Heavyweight custom organic brushback cotton-blend body',
          'Water-repellent ripstop overlay panels on wear points',
          'Double-lined scuba technical storm hood with elastic adjustment cord',
          'Sleek kangaroo pouch with hidden zip pocketing and metal hardware'
        ],
        scarcityText: 'DROP 01 // BATCH 01 // ONLY 3 LEFT',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Tactical Black / Crimson Red'],
        specifications: {
          fabric: '85% Cotton / 15% Poly Fleece with 100% Cordura Nylon Overlays',
          weight: '480 GSM Double-Fleece Thermal Weight',
          hardware: 'Genuine YKK Aquaguard Zips & Fidlock V-Buckle magnetic system',
          origin: 'Seoul, South Korea'
        }
      },
      {
        id: "axe-rc-01",
        name: 'AXEVORA / RC-01 "NEMESIS-SHELL" WATERPROOF RAINCOAT',
        category: 'raincoat',
        categoryLabel: 'WATERPROOF GEAR / RAINCOATS',
        price: 310,
        sku: 'AXE-RC-01-NEMESIS',
        image: '/images/raincoat.png',
        description: 'The ultimate shield for monsoon conditions. A premium high-visibility, technical waterproof long raincoat engineered with a triple-layer tactical membrane (20,000mm rating). Design elements feature high-visibility crisp white reflective chest branding, complete with an oversized crimson geometric wordmark.',
        details: [
          '3-Layer tactical shell laminate with fully sealed micro-seams',
          'Left-chest highly-reflective technical AXEVORA brand print',
          'Back dorsal profile oversized premium Crimson/White footprint',
          'Fully adjustable anatomical storm hood'
        ],
        scarcityText: 'DROP 01 // BATCH 01 // ONLY 2 LEFT',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Reflective Black / Deep Crimson'],
        specifications: {
          fabric: 'AXE-TECH 3L Triple-Layer Technical Waterproof Membrane',
          weight: '340 GSM Lightweight Shell Layer',
          waterproofing: '20,000mm hydrostatic head / 15,000g/m² breathability',
          origin: 'Munich, Germany'
        }
      }
    ];

    return NextResponse.json({
      success: true,
      source: 'curated_fallback',
      products: launchProducts,
    });

  } catch (error) {
    console.error('[AXEVORA ROUTE ERROR] Catalog endpoint failed:', error);
    return NextResponse.json(
      { success: false, error: 'InternalServerError', message: 'Failed to access catalog database.' },
      { status: 500 }
    );
  }
}
