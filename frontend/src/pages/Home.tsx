import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, Bot } from 'lucide-react';

export default function Home() {
  const features = [
    { icon: Bot, title: 'AI Assistant', desc: 'Tanya produk secara natural, dapatkan info instan.' },
    { icon: Zap, title: 'Real-time Cart', desc: 'Keranjang update otomatis, tanpa reload.' },
    { icon: Truck, title: 'Ongkir Otomatis', desc: 'Hitung ongkir real-time ke seluruh Indonesia.' },
    { icon: Shield, title: 'Pembayaran Aman', desc: 'Midtrans payment gateway, notifikasi Telegram.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] border border-[#222] mb-6">
            <div className="w-1.5 h-1.5 bg-[#00d4aa]"></div>
            <span className="text-[10px] text-[#888] uppercase tracking-wider">E-Commerce Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Belanja tech gear<br />
            <span className="text-[#00d4aa]">tanpa ribet.</span>
          </h1>
          <p className="text-sm text-[#888] leading-relaxed mb-8 max-w-lg">
            Platform e-commerce modern dengan AI assistant, kalkulasi ongkir otomatis, 
            dan payment gateway terintegrasi. Semua yang Anda butuhkan dalam satu tempat.
          </p>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="px-5 py-2.5 bg-[#00d4aa] text-black text-xs font-medium flex items-center gap-2 hover:bg-[#00b894] transition-colors"
            >
              Lihat Produk <ArrowRight size={14} />
            </Link>
            <Link
              to="/tracking"
              className="px-5 py-2.5 bg-[#1a1a1a] border border-[#333] text-white text-xs font-medium flex items-center gap-2 hover:border-[#555] transition-colors"
            >
              Lacak Pesanan
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#222]">
          {[
            { value: '8+', label: 'Produk' },
            { value: '24/7', label: 'AI Support' },
            { value: '100%', label: 'Secure Payment' },
            { value: 'Fast', label: 'Shipping' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0a0a0a] p-5 text-center">
              <div className="text-xl font-bold text-[#00d4aa]">{stat.value}</div>
              <div className="text-[10px] text-[#666] uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto pb-20">
        <h2 className="text-lg font-semibold text-white mb-6">Fitur Utama</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#222]">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="bg-[#0a0a0a] p-5">
                <div className="w-8 h-8 bg-[#1a1a1a] border border-[#222] flex items-center justify-center mb-3">
                  <Icon size={14} className="text-[#00d4aa]" />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">{feat.title}</h3>
                <p className="text-xs text-[#666] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>


    </div>
  );
}
