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

const products: Product[] = [
  {
    id: "prod-001",
    name: "Mechanical Keyboard Kailh Brown",
    price: 1250000,
    stock: 25,
    category: "Elektronik",
    description: "Keyboard mekanikal dengan switch Kailh Brown, hot-swappable, RGB backlight, layout 75%. Cocok untuk typing dan gaming.",
    image: "keyboard",
    weight: 800
  },
  {
    id: "prod-002",
    name: "Monitor Ultrawide 34 inch",
    price: 5500000,
    stock: 8,
    category: "Elektronik",
    description: "Monitor ultrawide 34 inch, resolusi WQHD 3440x1440, refresh rate 144Hz, panel IPS, HDR400.",
    image: "monitor",
    weight: 7500
  },
  {
    id: "prod-003",
    name: "Wireless Mouse Ergonomic",
    price: 450000,
    stock: 50,
    category: "Elektronik",
    description: "Mouse wireless ergonomic, sensor 26000 DPI, koneksi dual (Bluetooth + 2.4GHz), battery life 70 jam.",
    image: "mouse",
    weight: 120
  },
  {
    id: "prod-004",
    name: "USB-C Hub 8-in-1",
    price: 380000,
    stock: 35,
    category: "Aksesoris",
    description: "Hub USB-C dengan 8 port: HDMI 4K, USB 3.0 x3, SD/MicroSD, Ethernet, PD 100W.",
    image: "hub",
    weight: 95
  },
  {
    id: "prod-005",
    name: "Webcam 4K Auto-Focus",
    price: 890000,
    stock: 15,
    category: "Elektronik",
    description: "Webcam 4K dengan auto-focus, built-in microphone noise cancelling, field of view 90°, plug and play.",
    image: "webcam",
    weight: 180
  },
  {
    id: "prod-006",
    name: "Standing Desk Mat",
    price: 320000,
    stock: 40,
    category: "Furniture",
    description: "Anti-fatigue mat untuk standing desk, material EVA foam premium, ukuran 65x45cm, permukaan textured.",
    image: "mat",
    weight: 1200
  },
  {
    id: "prod-007",
    name: "Desk Lamp LED Smart",
    price: 550000,
    stock: 20,
    category: "Furniture",
    description: "Lampu meja LED smart, adjustable color temperature 2700K-6500K, brightness 10 level, kontrol via app.",
    image: "lamp",
    weight: 650
  },
  {
    id: "prod-008",
    name: "Noise Cancelling Headphone",
    price: 2100000,
    stock: 12,
    category: "Audio",
    description: "Headphone over-ear dengan ANC hybrid, driver 40mm, battery 30 jam, codec LDAC, multipoint connection.",
    image: "headphone",
    weight: 260
  }
];

export default products;
