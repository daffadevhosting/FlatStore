# FlatStore — E-Commerce Platform

Platform e-commerce modern dengan tema flat minimalis dark mode, dibangun menggunakan React + Vite (frontend) dan Cloudflare Workers (backend).

## 🏗️ Arsitektur

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   React/Vite    │────▶│  Cloudflare Workers   │────▶│  External APIs  │
│   (Frontend)    │◀────│  (API Backend)        │◀────│                 │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                                │
                                ├── Midtrans (Payment)
                                ├── RajaOngkir (Shipping)
                                └── Telegram Bot (Notification)
```

## ✨ Fitur

- **AI Assistant** — Chatbot untuk query produk (nama, harga, stok, deskripsi)
- **Keranjang Real-time** — Update otomatis tanpa reload
- **Kalkulasi Ongkir** — Integrasi API ekspedisi (RajaOngkir)
- **Payment Gateway** — Midtrans Snap (sandbox/production)
- **Tracking Pesanan** — Nomor resi & timeline status
- **Notifikasi Telegram** — Konfirmasi pembayaran via Telegram Bot
- **UI Flat Minimalis** — Dark mode, tipografi clean, border-radius minimal

## 📁 Struktur Proyek

```
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Entry point + routing
│   │   ├── main.tsx                # React DOM mount
│   │   ├── index.css               # Tailwind + custom theme
│   │   ├── context/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── data/
│   │   └── services/
│   ├── package.json             # Frontend dependencies and scripts
│   └── vite.config.js           # Vite configuration
├── worker/
│   ├── index.ts                 # Cloudflare Workers code
│   ├── package.json             # Worker dependencies and scripts
│   └── wrangler.toml            # Workers configuration
├── package.json                 # Root command shortcuts
└── README.md                   # Dokumentasi ini
```

## 🚀 Setup & Development

### Prerequisites
- Node.js 18+
- npm 9+
- Cloudflare account (untuk deploy Workers)
- Midtrans account (sandbox)
- Telegram Bot Token

### Frontend

```bash
# Install frontend dependencies
npm install --prefix frontend

# Install Worker dependencies
npm install --prefix worker

# Development server
npm run dev

# Build production
npm run build
```

### Backend (Cloudflare Workers)

```bash
# Login ke Cloudflare
npm --prefix worker exec wrangler login

# Set secrets
wrangler secret put MIDTRANS_SERVER_KEY
wrangler secret put MIDTRANS_CLIENT_KEY
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
wrangler secret put RAJAONGKIR_API_KEY
wrangler secret put ADMIN_USERNAME
wrangler secret put ADMIN_PASSWORD
wrangler secret put ADMIN_SESSION_SECRET

# Local Worker development
npm run worker:dev

# Deploy Worker
npm run worker:deploy
```

Sebelum memakai dashboard, buat KV namespace untuk menyimpan produk lalu isi ID-nya di `worker/wrangler.toml`:

```bash
npm --prefix worker exec wrangler kv namespace create PRODUCTS_KV
```

Dashboard tersedia di `/#/admin`. Set `ADMIN_FRONTEND_ORIGIN` ke origin frontend yang sebenarnya saat production.

## 🔧 Konfigurasi

### Environment Variables (Frontend)

Buat file `frontend/.env`:

```env
VITE_WORKER_URL=https://flatstore-api.your-subdomain.workers.dev
```

### Environment Variables (Workers)

Set via `wrangler secret put`:

| Variable | Deskripsi |
|----------|-----------|
| `MIDTRANS_SERVER_KEY` | Server key dari Midtrans dashboard |
| `MIDTRANS_CLIENT_KEY` | Client key dari Midtrans dashboard |
| `MIDTRANS_IS_PRODUCTION` | `"true"` atau `"false"` |
| `TELEGRAM_BOT_TOKEN` | Token dari @BotFather |
| `TELEGRAM_CHAT_ID` | Chat ID untuk notifikasi |
| `RAJAONGKIR_API_KEY` | API key RajaOngkir |

## 📡 API Endpoints (Workers)

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/products` | List semua produk |
| GET | `/api/products/:id` | Detail produk |
| POST | `/api/shipping/calculate` | Hitung ongkir |
| POST | `/api/payment/create` | Buat transaksi Midtrans |
| POST | `/api/payment/notify` | Callback Midtrans |
| POST | `/api/telegram/notify` | Kirim notifikasi Telegram |

### Contoh Request

**Hitung Ongkir:**
```bash
curl -X POST https://your-worker.workers.dev/api/shipping/calculate \
  -H "Content-Type: application/json" \
  -d '{"origin":"1","destination":"2","weight":1500,"courier":"jne"}'
```

**Buat Pembayaran:**
```bash
curl -X POST https://your-worker.workers.dev/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "ORD-001",
    "gross_amount": 1500000,
    "customer_name": "John Doe",
    "customer_email": "john@email.com",
    "customer_phone": "08123456789",
    "items": [{"id":"prod-001","name":"Keyboard","price":1250000,"quantity":1}]
  }'
```

## 🤖 Telegram Bot Setup

1. Chat dengan [@BotFather](https://t.me/BotFather) di Telegram
2. Kirim `/newbot` dan ikuti instruksi
3. Catat token yang diberikan
4. Untuk mendapatkan Chat ID, chat dengan bot Anda lalu kunjungi:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Set secrets di Workers

## 💳 Midtrans Setup

1. Daftar di [Midtrans](https://midtrans.com)
2. Masuk ke Dashboard → Settings → Access Keys
3. Copy Server Key dan Client Key (sandbox)
4. Set notification URL: `https://your-worker.workers.dev/api/payment/notify`
5. Set secrets di Workers

## 🎨 Desain

- **Tema**: Flat minimalis dark mode
- **Warna utama**: `#0a0a0a` (background), `#00d4aa` (accent)
- **Tipografi**: Inter, clean sans-serif
- **Border-radius**: 2px (minimal)
- **Gradien**: Tidak digunakan
- **Komponen**: Reusable, modular

## 📦 Deploy

### Frontend (Static)
```bash
npm run build
# Upload dist/ ke hosting (Cloudflare Pages, Vercel, Netlify, dll)
```

### Backend (Workers)
```bash
npm run worker:deploy
```

### Cloudflare Pages (Recommended)
1. Push repo ke GitHub
2. Connect ke Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set env variable `VITE_WORKER_URL`

## 📄 Lisensi

MIT
