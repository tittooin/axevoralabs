import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('[AXEVORA WEBHOOK] Received product push event from Qikink:', JSON.stringify(payload, null, 2));

    // Support flexible mapping for Qikink payload inputs
    const productId = String(payload.id || payload.product_id || payload.sku || `QIK-${Date.now()}`);
    const name = String(payload.name || payload.title || 'AXEVORA Technical Piece').toUpperCase();
    const description = payload.description || 'Premium technical print-on-demand drop apparel. Dispatched via secure sync networks.';
    const price = Number(payload.price || payload.mrp || 85);
    const sku = String(payload.sku || payload.variant_sku || `AXE-TS-${Date.now().toString().slice(-4)}`);
    
    // Extract sizes & colors from variants list
    let sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    let colors = ['Tactical Black'];
    
    if (Array.isArray(payload.variants) && payload.variants.length > 0) {
      sizes = Array.from(new Set(payload.variants.map((v: any) => v.size || 'L'))).filter(Boolean) as string[];
      colors = Array.from(new Set(payload.variants.map((v: any) => v.color || 'Black'))).filter(Boolean) as string[];
    }
    
    if (Array.isArray(payload.sizes) && payload.sizes.length > 0) {
      sizes = payload.sizes;
    }
    if (Array.isArray(payload.colors) && payload.colors.length > 0) {
      colors = payload.colors;
    }

    // Capture dynamic images/mockups
    const imageUrl = payload.image || payload.image_url || payload.mockup_url || (payload.images && payload.images[0]) || '/images/tshirt.png';

    // Map category
    let category: 'tshirt' | 'hoodie' | 'raincoat' = 'tshirt';
    let categoryLabel = 'STREETWEAR T-SHIRTS';
    const titleUpper = name.toUpperCase();
    if (titleUpper.includes('HOODIE') || titleUpper.includes('SWEAT')) {
      category = 'hoodie';
      categoryLabel = 'TECH HOODIES';
    } else if (titleUpper.includes('RAIN') || titleUpper.includes('JACKET') || titleUpper.includes('WATERPROOF')) {
      category = 'raincoat';
      categoryLabel = 'WATERPROOF GEAR / RAINCOATS';
    }

    // Build standard product schema
    const newProduct = {
      id: productId,
      name,
      category,
      categoryLabel,
      price,
      sku,
      image: imageUrl,
      description,
      details: payload.details || payload.features || [
        'Premium combed organic fiber composition',
        'Reinforced seam stitching for extreme comfort',
        'Decoupled Qikink API live dispatch sync'
      ],
      scarcityText: `DROP 01 // BATCH 01 // ONLY 5 LEFT`,
      sizes: sizes.length ? sizes : ['S', 'M', 'L', 'XL'],
      colors: colors.length ? colors : ['Tactical Black'],
      specifications: {
        fabric: payload.material || payload.fabric || 'Organic Technical Weave',
        weight: payload.gsm || payload.weight || '320 GSM Heavyweight Weight',
        waterproofing: payload.waterproofing || undefined,
        hardware: payload.hardware || undefined,
        origin: payload.origin || 'Qikink Direct Dispatch Hub'
      }
    };

    // Access Cloudflare KV
    const db = process.env.AXEVORA_DB as any;
    let productsList = [];

    if (db) {
      try {
        const kvData = await db.get('products');
        if (kvData) {
          productsList = JSON.parse(kvData);
        }
      } catch (kvErr) {
        console.error('[AXEVORA] Error reading products from KV:', kvErr);
      }
    }

    // Update product if already exists, else push new item
    const existingIndex = productsList.findIndex((p: any) => p.id === productId || p.sku === sku);
    if (existingIndex > -1) {
      productsList[existingIndex] = newProduct;
      console.log(`[AXEVORA WEBHOOK] Updated existing product ID: ${productId}`);
    } else {
      productsList.push(newProduct);
      console.log(`[AXEVORA WEBHOOK] Appended new product ID: ${productId}`);
    }

    // Persist in Cloudflare KV
    if (db) {
      try {
        await db.put('products', JSON.stringify(productsList));
        console.log('[AXEVORA WEBHOOK] Successfully persisted products to Cloudflare KV.');
      } catch (kvWriteErr) {
        console.error('[AXEVORA WEBHOOK] Error writing products to KV:', kvWriteErr);
        throw new Error('Cloudflare KV write failed.');
      }
    } else {
      console.warn('[AXEVORA WEBHOOK] Cloudflare KV not configured. Running in stateless mode.');
    }

    return NextResponse.json({
      success: true,
      message: 'Product synced successfully in AXEVORA database.',
      product: newProduct
    });

  } catch (error: any) {
    console.error('[AXEVORA WEBHOOK CRITICAL ERROR] Product push handler failed:', error);
    return NextResponse.json(
      { success: false, error: 'WebhookProcessingError', message: error.message },
      { status: 500 }
    );
  }
}
