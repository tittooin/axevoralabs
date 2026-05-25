import { NextResponse } from 'next/server';

export const runtime = 'edge';

let requestTracker: { timestamp: number }[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  requestTracker = requestTracker.filter(req => now - req.timestamp < 60000);
  if (requestTracker.length >= 30) {
    return false;
  }
  requestTracker.push({ timestamp: now });
  return true;
}

export async function POST(req: Request) {
  try {
    // 1. Rate-Limit Check
    if (!checkRateLimit()) {
      return NextResponse.json(
        {
          success: false,
          error: 'RateLimitExceeded',
          message: 'Fulfillment gateway is busy. Please wait 60 seconds before retrying.',
        },
        { status: 429 }
      );
    }

    // 2. Extract and validate request body
    const body = await req.json();
    const { customer, items, totalAmount } = body;

    if (!customer || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: 'ValidationError', message: 'Missing customer details or cart items.' },
        { status: 400 }
      );
    }

    // Validate 08-23 Shipping requirements
    const { name, addressLine1, city, state, pincode, phone, email } = customer;
    if (!name || !addressLine1 || !city || !state || !pincode || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'ValidationError', message: 'Incomplete shipping details for Qikink registration.' },
        { status: 400 }
      );
    }

    // Deconstruct first name & last name
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Parse Pincode into numeric type strictly required by Qikink 08-23
    const parsedZip = Number(pincode.replace(/\D/g, ''));
    if (isNaN(parsedZip)) {
      return NextResponse.json(
        { success: false, error: 'ValidationError', message: 'Postal code must be a valid numeric value.' },
        { status: 400 }
      );
    }

    // 3. Environment Credential verification
    const clientId = process.env.QIKINK_CLIENT_ID;
    const clientSecret = process.env.QIKINK_CLIENT_SECRET;
    // Default to Sandbox for safe testing or use production Live endpoint
    const qikinkApiUrl = process.env.QIKINK_API_URL || 'https://sandbox.qikink.com';

    // Map payload conforming strictly to standard Qikink 08-23 JSON specs
    const orderNumber = `AXE-${Date.now().toString().slice(-8)}`;
    const lineItems = items.map((item: any) => ({
      search_from_my_products: 1, // 1 means fetch designs dynamically via SKU from dashboard
      quantity: Number(item.quantity || 1),
      sku: item.sku,
    }));

    const qikinkPayload = {
      order_number: orderNumber,
      qikink_shipping: 1, // 1 means Qikink handles shipping and courier allocation
      gateway: 'Prepaid', // Prepaid prepaid checkout
      total_order_value: Number(totalAmount),
      line_items: lineItems,
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address1: addressLine1,
        address2: customer.addressLine2 || '',
        Phone: phone,
        email: email,
        city: city,
        zip: parsedZip, // Strict Numeric zip parameter
        province: state, // State name with correct spelling
        country_code: 'IN', // Default country code is India
      }
    };

    console.log('[AXEVORA GATEWAY] Synthesizing payload for Qikink 08-23 gateway sync...');

    // Sandbox Simulation Mode if credentials are not configured
    if (!clientId || !clientSecret) {
      console.warn('[AXEVORA GATEWAY] Qikink API keys are absent. Operating in standard SECURE SIMULATION MODE.');
      
      await new Promise((resolve) => setTimeout(resolve, 800));

      return NextResponse.json({
        success: true,
        mode: 'simulation',
        orderId: orderNumber,
        message: 'Order simulated successfully according to Qikink 08-23 schemas. System awaiting keys.',
        qikinkSync: {
          status: 'SUCCESS_SIMULATED',
          payload_debug: qikinkPayload,
        }
      });
    }

    // 4. Connect and Synchronize with Qikink Core
    try {
      console.log(`[AXEVORA] Querying Qikink Authorization Token on: ${qikinkApiUrl}/oauth/token`);
      
      // Request access token using credentials
      const authResponse = await fetch(`${qikinkApiUrl}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ClientId: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!authResponse.ok) {
        throw new Error(`Token request rejected with status code: ${authResponse.status}`);
      }

      const authData = await authResponse.json();
      const accessToken = authData.access_token || authData.Accesstoken;

      if (!accessToken) {
        throw new Error('Authorization response did not contain a valid Access Token.');
      }

      // Dispatch order creation request
      console.log(`[AXEVORA] Dispatching order payload to Qikink: ${qikinkApiUrl}/v1/orders`);
      
      const orderResponse = await fetch(`${qikinkApiUrl}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(qikinkPayload),
      });

      if (!orderResponse.ok) {
        if (orderResponse.status === 429) {
          return NextResponse.json(
            {
              success: false,
              error: 'RateLimitExceeded',
              message: 'External order dispatch queue is busy. Please try placing your order again.',
            },
            { status: 429 }
          );
        }

        const errorDetails = await orderResponse.text();
        console.error('[AXEVORA QIKINK SYNC FAILURE] Payload rejected:', errorDetails);
        throw new Error('Fulfillment provider rejected order parameters.');
      }

      const responseData = await orderResponse.json();

      return NextResponse.json({
        success: true,
        mode: 'production',
        orderId: orderNumber,
        qikinkOrderId: responseData.id || responseData.order_id,
        message: 'Fulfillment successfully dispatched to Qikink pipeline.',
      });

    } catch (apiError: any) {
      console.error('[AXEVORA GATEWAY FAULT] Direct Sync interrupted:', apiError.message);
      return NextResponse.json(
        {
          success: false,
          error: 'GatewayException',
          message: `Fulfillment synchronization interrupted: ${apiError.message}. Cart is locked.`,
        },
        { status: 502 }
      );
    }

  } catch (globalError: any) {
    console.error('[AXEVORA ROUTE FAULT] Unexpected error:', globalError);
    return NextResponse.json(
      { success: false, error: 'InternalServerError', message: 'Internal security gateway anomaly.' },
      { status: 500 }
    );
  }
}
