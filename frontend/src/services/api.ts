/**
 * API Service - FlatStore
 * Connects frontend to Cloudflare Workers backend
 * 
 * In production, set WORKER_URL to your deployed Workers URL
 * For development, uses mock data
 */

const WORKER_URL = import.meta.env.VITE_WORKER_URL || '';

// Mock mode when no worker URL is configured
const isMock = !WORKER_URL;

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
  weight: number;
}

export interface ShippingResult {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
  cost: number;
  etd: string;
}

export interface PaymentResult {
  token: string;
  redirect_url: string;
  order_id: string;
}

export type ProductInput = Omit<Product, 'id' | 'image'> & { image?: string };

async function adminRequest(path: string, options: RequestInit = {}): Promise<Response> {
  if (!WORKER_URL) {
    throw new Error('VITE_WORKER_URL belum dikonfigurasi');
  }

  return fetch(`${WORKER_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Request': '1',
      ...options.headers,
    },
  });
}

async function readAdminResponse<T>(response: Response): Promise<T> {
  const data = await response.json() as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || 'Admin request gagal');
  }
  return data;
}

export async function adminLogin(username: string, password: string): Promise<void> {
  const response = await adminRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  await readAdminResponse(response);
}

export async function adminLogout(): Promise<void> {
  const response = await adminRequest('/api/admin/logout', { method: 'POST' });
  await readAdminResponse(response);
}

export async function getAdminProducts(): Promise<Product[]> {
  const response = await adminRequest('/api/admin/products');
  return readAdminResponse<Product[]>(response);
}

export async function createAdminProduct(product: ProductInput): Promise<Product> {
  const response = await adminRequest('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  return readAdminResponse<Product>(response);
}

export async function updateAdminProduct(id: string, product: ProductInput): Promise<Product> {
  const response = await adminRequest(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
  return readAdminResponse<Product>(response);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const response = await adminRequest(`/api/admin/products/${id}`, { method: 'DELETE' });
  await readAdminResponse(response);
}

// Products API
export async function getProducts(): Promise<Product[]> {
  if (isMock) {
    const { default: products } = await import('../data/products');
    return products;
  }
  const res = await fetch(`${WORKER_URL}/api/products`);
  return res.json();
}

export async function getProduct(id: string): Promise<Product | undefined> {
  if (isMock) {
    const { default: products } = await import('../data/products');
    return products.find((p: Product) => p.id === id);
  }
  const res = await fetch(`${WORKER_URL}/api/products/${id}`);
  return res.json();
}

// Shipping API
export async function calculateShipping(
  origin: string,
  destination: string,
  weight: number,
  courier: string
): Promise<ShippingResult> {
  if (isMock) {
    const baseCost = 15000;
    const weightKg = Math.ceil(weight / 1000);
    const multipliers: Record<string, number> = { jne: 1, jnt: 0.9, sicepat: 0.85, pos: 0.75 };
    const cost = Math.round((baseCost + weightKg * 5000 * (multipliers[courier] || 1)) / 1000) * 1000;
    return { origin, destination, weight, courier, cost, etd: '2-3 hari' };
  }
  const res = await fetch(`${WORKER_URL}/api/shipping/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, weight, courier }),
  });
  return res.json();
}

// Payment API (Midtrans)
export async function createPayment(params: {
  order_id: string;
  gross_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: { id: string; name: string; price: number; quantity: number }[];
}): Promise<PaymentResult> {
  if (isMock) {
    return {
      token: 'mock-snap-token-' + Date.now(),
      redirect_url: '#payment-mock',
      order_id: params.order_id,
    };
  }
  const res = await fetch(`${WORKER_URL}/api/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

// Telegram notification
export async function sendTelegramNotification(message: string): Promise<void> {
  if (isMock) {
    console.log('[Telegram Mock]', message);
    return;
  }
  await fetch(`${WORKER_URL}/api/telegram/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}
