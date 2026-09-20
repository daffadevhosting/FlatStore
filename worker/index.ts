/**
 * Cloudflare Workers - FlatStore API
 * 
 * Endpoints:
 * - GET  /api/products          → List all products
 * - GET  /api/products/:id      → Get single product
 * - POST /api/shipping/calculate → Calculate shipping cost
 * - POST /api/payment/create    → Create Midtrans transaction
 * - POST /api/payment/notify    → Midtrans notification callback
 * - POST /api/telegram/notify   → Send Telegram notification
 * 
 * Environment Variables:
 * - MIDTRANS_SERVER_KEY
 * - MIDTRANS_CLIENT_KEY
 * - MIDTRANS_IS_PRODUCTION
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 * - RAJAONGKIR_API_KEY
 */

interface Env {
  MIDTRANS_SERVER_KEY?: string;
  MIDTRANS_CLIENT_KEY?: string;
  MIDTRANS_IS_PRODUCTION?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  RAJAONGKIR_API_KEY?: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_FRONTEND_ORIGIN?: string;
  PRODUCTS_KV?: KVNamespace;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  weight: number;
  image?: string;
}

// Seed data; edits from the admin dashboard are persisted in PRODUCTS_KV.
const PRODUCTS: Product[] = [
  { id: "prod-001", name: "Mechanical Keyboard Kailh Brown", price: 1250000, stock: 25, category: "Elektronik", description: "Keyboard mekanikal dengan switch Kailh Brown, hot-swappable, RGB backlight, layout 75%.", weight: 800 },
  { id: "prod-002", name: "Monitor Ultrawide 34 inch", price: 5500000, stock: 8, category: "Elektronik", description: "Monitor ultrawide 34 inch, resolusi WQHD 3440x1440, refresh rate 144Hz, panel IPS.", weight: 7500 },
  { id: "prod-003", name: "Wireless Mouse Ergonomic", price: 450000, stock: 50, category: "Elektronik", description: "Mouse wireless ergonomic, sensor 26000 DPI, koneksi dual.", weight: 120 },
  { id: "prod-004", name: "USB-C Hub 8-in-1", price: 380000, stock: 35, category: "Aksesoris", description: "Hub USB-C dengan 8 port: HDMI 4K, USB 3.0 x3, SD/MicroSD, Ethernet, PD 100W.", weight: 95 },
  { id: "prod-005", name: "Webcam 4K Auto-Focus", price: 890000, stock: 15, category: "Elektronik", description: "Webcam 4K dengan auto-focus, built-in microphone noise cancelling.", weight: 180 },
  { id: "prod-006", name: "Standing Desk Mat", price: 320000, stock: 40, category: "Furniture", description: "Anti-fatigue mat untuk standing desk, material EVA foam premium.", weight: 1200 },
  { id: "prod-007", name: "Desk Lamp LED Smart", price: 550000, stock: 20, category: "Furniture", description: "Lampu meja LED smart, adjustable color temperature 2700K-6500K.", weight: 650 },
  { id: "prod-008", name: "Noise Cancelling Headphone", price: 2100000, stock: 12, category: "Audio", description: "Headphone over-ear dengan ANC hybrid, driver 40mm, battery 30 jam.", weight: 260 },
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const corsHeaders = getCorsHeaders(env, request.headers.get('Origin'));

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path === '/api/admin/login' && method === 'POST') {
        if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
          return jsonResponse({ error: 'Admin authentication is not configured' }, corsHeaders, 503);
        }

        const body = await request.json() as { username?: unknown; password?: unknown };
        const validUsername = typeof body.username === 'string'
          && await secureEqual(body.username, env.ADMIN_USERNAME);
        const validPassword = typeof body.password === 'string'
          && await secureEqual(body.password, env.ADMIN_PASSWORD);

        if (!validUsername || !validPassword) {
          return jsonResponse({ error: 'Invalid credentials' }, corsHeaders, 401);
        }

        const session = await createSession(env.ADMIN_SESSION_SECRET);
        return jsonResponse({ authenticated: true }, corsHeaders, 200, {
          'Set-Cookie': buildSessionCookie(session, url.protocol === 'https:'),
        });
      }

      if (path === '/api/admin/logout' && method === 'POST') {
        return jsonResponse({ authenticated: false }, corsHeaders, 200, {
          'Set-Cookie': clearSessionCookie(url.protocol === 'https:'),
        });
      }

      if (path.startsWith('/api/admin/')) {
        if (request.headers.get('X-Admin-Request') !== '1'
          || !env.ADMIN_SESSION_SECRET
          || !(await isAuthenticated(request, env.ADMIN_SESSION_SECRET))) {
          return jsonResponse({ error: 'Unauthorized' }, corsHeaders, 401);
        }

        if (path === '/api/admin/session' && method === 'GET') {
          return jsonResponse({ authenticated: true }, corsHeaders);
        }

        if (path === '/api/admin/products' && method === 'GET') {
          return jsonResponse(await getProducts(env), corsHeaders);
        }

        if (path === '/api/admin/products' && method === 'POST') {
          const body = await request.json() as unknown;
          if (!env.PRODUCTS_KV) {
            return jsonResponse({ error: 'Product storage is not configured' }, corsHeaders, 503);
          }
          const product = parseProductInput(body);
          if (!product) {
            return jsonResponse({ error: 'Invalid product data' }, corsHeaders, 400);
          }
          const products = await getProducts(env);
          const created = { ...product, id: `prod-${crypto.randomUUID().slice(0, 8)}` };
          await saveProducts(env, [...products, created]);
          return jsonResponse(created, corsHeaders, 201);
        }

        const productMatch = path.match(/^\/api\/admin\/products\/([^/]+)$/);
        if (productMatch) {
          const productId = productMatch[1];
          const products = await getProducts(env);
          const productIndex = products.findIndex(product => product.id === productId);
          if (productIndex === -1) {
            return jsonResponse({ error: 'Product not found' }, corsHeaders, 404);
          }

          if (method === 'DELETE') {
            if (!env.PRODUCTS_KV) {
              return jsonResponse({ error: 'Product storage is not configured' }, corsHeaders, 503);
            }
            await saveProducts(env, products.filter(product => product.id !== productId));
            return jsonResponse({ deleted: true }, corsHeaders);
          }

          if (method === 'PUT') {
            if (!env.PRODUCTS_KV) {
              return jsonResponse({ error: 'Product storage is not configured' }, corsHeaders, 503);
            }
            const body = await request.json() as unknown;
            const product = parseProductInput(body);
            if (!product) {
              return jsonResponse({ error: 'Invalid product data' }, corsHeaders, 400);
            }
            const updated = { ...product, id: productId };
            products[productIndex] = updated;
            await saveProducts(env, products);
            return jsonResponse(updated, corsHeaders);
          }
        }

        return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
      }

      // GET /api/products
      if (path === '/api/products' && method === 'GET') {
        return jsonResponse(await getProducts(env), corsHeaders);
      }

      // GET /api/products/:id
      if (path.startsWith('/api/products/') && method === 'GET') {
        const id = path.split('/').pop();
        const product = (await getProducts(env)).find(p => p.id === id);
        if (!product) {
          return jsonResponse({ error: 'Product not found' }, corsHeaders, 404);
        }
        return jsonResponse(product, corsHeaders);
      }

      // POST /api/shipping/calculate
      if (path === '/api/shipping/calculate' && method === 'POST') {
        const body = await request.json() as any;
        const { origin, destination, weight, courier } = body;

        // Simulate RajaOngkir API call
        // In production: fetch from https://api.rajaongkir.com/starter/cost
        const baseCost = 15000;
        const weightKg = Math.ceil(weight / 1000);
        const courierMultiplier: Record<string, number> = {
          jne: 1.0,
          jnt: 0.9,
          sicepat: 0.85,
          pos: 0.75,
        };
        const multiplier = courierMultiplier[courier] || 1;
        const cost = Math.round((baseCost + weightKg * 5000 * multiplier) / 1000) * 1000;

        return jsonResponse({
          origin,
          destination,
          weight,
          courier,
          cost,
          etd: courier === 'pos' ? '3-5 hari' : courier === 'jne' ? '2-3 hari' : '1-3 hari',
        }, corsHeaders);
      }

      // POST /api/payment/create - Create Midtrans Snap Transaction
      if (path === '/api/payment/create' && method === 'POST') {
        const body = await request.json() as any;
        const { order_id, gross_amount, customer_name, customer_email, customer_phone, items } = body;

        const midtransUrl = env.MIDTRANS_IS_PRODUCTION === 'true'
          ? 'https://app.midtrans.com/snap/v1/transactions'
          : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        const midtransPayload = {
          transaction_details: {
            order_id,
            gross_amount,
          },
          customer_details: {
            first_name: customer_name,
            email: customer_email,
            phone: customer_phone,
          },
          item_details: items.map((item: any) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            name: item.name,
          })),
          callbacks: {
            finish: `${url.origin}/tracking?order=${order_id}`,
          },
        };

        const response = await fetch(midtransUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(env.MIDTRANS_SERVER_KEY + ':')}`,
          },
          body: JSON.stringify(midtransPayload),
        });

        const data = await response.json();
        return jsonResponse(data, corsHeaders);
      }

      // POST /api/payment/notify - Midtrans Notification Handler
      if (path === '/api/payment/notify' && method === 'POST') {
        const body = await request.json() as any;
        const { order_id, transaction_status, fraud_status, gross_amount, customer_name } = body;

        let status = 'pending';
        if (transaction_status === 'capture') {
          status = fraud_status === 'accept' ? 'paid' : 'pending';
        } else if (transaction_status === 'settlement') {
          status = 'paid';
        } else if (transaction_status === 'deny' || transaction_status === 'expire' || transaction_status === 'cancel') {
          status = 'cancelled';
        }

        // Send Telegram notification
        const message = `🛒 *Pembayaran Diterima*\n\n` +
          `📋 Order ID: \`${order_id}\`\n` +
          `💰 Amount: Rp ${parseInt(gross_amount).toLocaleString('id-ID')}\n` +
          `👤 Customer: ${customer_name}\n` +
          `✅ Status: ${status.toUpperCase()}\n` +
          `🕐 Time: ${new Date().toLocaleString('id-ID')}`;

        await sendTelegramNotification(env, message);

        return jsonResponse({ status: 'ok', order_status: status }, corsHeaders);
      }

      // POST /api/telegram/notify - Direct Telegram notification
      if (path === '/api/telegram/notify' && method === 'POST') {
        const body = await request.json() as any;
        const { message } = body;
        await sendTelegramNotification(env, message);
        return jsonResponse({ status: 'sent' }, corsHeaders);
      }

      // 404
      return jsonResponse({ error: 'Not found' }, corsHeaders, 404);

    } catch (error: any) {
      return jsonResponse({ error: error.message || 'Internal server error' }, corsHeaders, 500);
    }
  },
};

async function sendTelegramNotification(env: Env, message: string): Promise<void> {
  const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  await fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
}

const PRODUCT_STORAGE_KEY = 'products';
const SESSION_MAX_AGE = 60 * 60 * 8;

function getCorsHeaders(env: Env, origin: string | null): Record<string, string> {
  const allowedOrigin = env.ADMIN_FRONTEND_ORIGIN
    ? (origin === env.ADMIN_FRONTEND_ORIGIN ? origin : 'null')
    : '*';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Request',
    'Vary': 'Origin',
  };
}

async function getProducts(env: Env): Promise<Product[]> {
  if (!env.PRODUCTS_KV) {
    return PRODUCTS;
  }

  return (await env.PRODUCTS_KV.get<Product[]>(PRODUCT_STORAGE_KEY, 'json')) || PRODUCTS;
}

async function saveProducts(env: Env, products: Product[]): Promise<void> {
  if (!env.PRODUCTS_KV) {
    throw new Error('Product storage is not configured');
  }
  await env.PRODUCTS_KV.put(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

function parseProductInput(value: unknown): Omit<Product, 'id'> | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const body = value as Record<string, unknown>;
  const textFields = ['name', 'category', 'description'] as const;
  if (textFields.some(field => typeof body[field] !== 'string' || !body[field].trim())) {
    return null;
  }

  const numericFields = ['price', 'stock', 'weight'] as const;
  if (numericFields.some(field => typeof body[field] !== 'number'
    || !Number.isFinite(body[field]) || body[field] < 0)) {
    return null;
  }

  return {
    name: (body.name as string).trim(),
    price: body.price as number,
    stock: body.stock as number,
    category: (body.category as string).trim(),
    description: (body.description as string).trim(),
    weight: body.weight as number,
    image: typeof body.image === 'string' ? body.image.trim() : undefined,
  };
}

async function secureEqual(left: string, right: string): Promise<boolean> {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(left)),
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(signature));
}

async function createSession(secret: string): Promise<string> {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const payload = `${Date.now()}.${toBase64Url(randomBytes)}`;
  return `${payload}.${await sign(payload, secret)}`;
}

async function isAuthenticated(request: Request, secret: string): Promise<boolean> {
  const cookieHeader = request.headers.get('Cookie') || '';
  const session = cookieHeader.match(/(?:^|;\s*)flatstore_admin=([^;]+)/)?.[1];
  if (!session) {
    return false;
  }

  const parts = session.split('.');
  if (parts.length !== 3) {
    return false;
  }
  const timestamp = Number(parts[0]);
  if (!Number.isFinite(timestamp) || Date.now() - timestamp > SESSION_MAX_AGE * 1000) {
    return false;
  }

  return secureEqual(await sign(`${parts[0]}.${parts[1]}`, secret), parts[2]);
}

function buildSessionCookie(session: string, secure: boolean): string {
  return `flatstore_admin=${session}; HttpOnly; SameSite=${secure ? 'None; Secure' : 'Lax'}; Path=/api/admin; Max-Age=${SESSION_MAX_AGE}`;
}

function clearSessionCookie(secure: boolean): string {
  return `flatstore_admin=; HttpOnly; SameSite=${secure ? 'None; Secure' : 'Lax'}; Path=/api/admin; Max-Age=0`;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function jsonResponse(
  data: unknown,
  headers: Record<string, string>,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...extraHeaders,
    },
  });
}
