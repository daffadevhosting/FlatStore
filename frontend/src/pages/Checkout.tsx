import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSession, Order } from '../context/SessionContext';

const CITIES = [
  { id: '1', name: 'Jakarta' },
  { id: '2', name: 'Bandung' },
  { id: '3', name: 'Surabaya' },
  { id: '4', name: 'Medan' },
  { id: '5', name: 'Semarang' },
  { id: '6', name: 'Makassar' },
  { id: '7', name: 'Bali (Denpasar)' },
  { id: '8', name: 'Yogyakarta' },
];

const COURIERS = [
  { id: 'jne', name: 'JNE' },
  { id: 'jnt', name: 'J&T Express' },
  { id: 'sicepat', name: 'SiCepat' },
  { id: 'pos', name: 'POS Indonesia' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const { setSession, addOrder } = useSession();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [selectedCourier, setSelectedCourier] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'shipping' | 'payment' | 'success'>('form');
  const [orderId, setOrderId] = useState('');

  const totalWeight = state.items.reduce((sum, item) => sum + item.weight * item.quantity, 0);

  useEffect(() => {
    if (state.items.length === 0 && step !== 'success') {
      navigate('/cart');
    }
  }, [state.items.length]);

  const calculateShipping = () => {
    if (!form.city || !selectedCourier) return;
    setCalculating(true);
    // Simulate API call to calculate shipping
    setTimeout(() => {
      const baseCost = 15000;
      const weightFactor = Math.ceil(totalWeight / 1000) * 5000;
      const courierMultiplier: Record<string, number> = { jne: 1, jnt: 0.9, sicepat: 0.85, pos: 0.75 };
      const cost = baseCost + weightFactor * (courierMultiplier[selectedCourier] || 1);
      setShippingCost(Math.round(cost / 1000) * 1000);
      setCalculating(false);
    }, 800);
  };

  const handlePayment = () => {
    setProcessing(true);
    // Simulate Midtrans payment processing
    setTimeout(() => {
      const id = 'ORD-' + Date.now().toString(36).toUpperCase();
      setOrderId(id);

      const order: Order = {
        id,
        items: state.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total: state.totalPrice + shippingCost,
        shippingCost,
        status: 'paid',
        trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 10).toUpperCase(),
        createdAt: new Date().toISOString(),
        customerName: form.name,
        customerPhone: form.phone,
        address: `${form.address}, ${form.city} ${form.postalCode}`,
      };

      addOrder(order);
      setSession(form);
      clearCart();
      setProcessing(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#0a2a1a] border border-[#00d4aa33] flex items-center justify-center mb-4">
          <CheckCircle size={28} className="text-[#00d4aa]" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Pembayaran Berhasil!</h2>
        <p className="text-xs text-[#666] mb-1">Order ID: <span className="text-[#00d4aa]">{orderId}</span></p>
        <p className="text-xs text-[#666] mb-6">Notifikasi telah dikirim via Telegram Bot.</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/tracking')}
            className="px-5 py-2.5 bg-[#00d4aa] text-black text-xs font-medium hover:bg-[#00b894] transition-colors"
          >
            Lacak Pesanan
          </button>
          <button
            onClick={() => navigate('/products')}
            className="px-5 py-2.5 bg-[#1a1a1a] border border-[#333] text-white text-xs font-medium hover:border-[#555] transition-colors"
          >
            Belanja Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['form', 'shipping', 'payment'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold ${
              step === s ? 'bg-[#00d4aa] text-black' : i < ['form', 'shipping', 'payment'].indexOf(step) ? 'bg-[#00d4aa33] text-[#00d4aa]' : 'bg-[#1a1a1a] text-[#555]'
            }`}>
              {i + 1}
            </div>
            <span className={`text-[10px] uppercase tracking-wider ${step === s ? 'text-white' : 'text-[#555]'}`}>
              {s === 'form' ? 'Data' : s === 'shipping' ? 'Ongkir' : 'Bayar'}
            </span>
            {i < 2 && <div className="w-8 h-px bg-[#222]"></div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 'form' && (
            <div className="bg-[#111] border border-[#222] p-5">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <Truck size={14} className="text-[#00d4aa]" /> Data Pengiriman
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#666] uppercase tracking-wider mb-1 block">Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs text-white outline-none focus:border-[#333]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#666] uppercase tracking-wider mb-1 block">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs text-white outline-none focus:border-[#333]"
                    placeholder="john@email.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#666] uppercase tracking-wider mb-1 block">No. Telepon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs text-white outline-none focus:border-[#333]"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#666] uppercase tracking-wider mb-1 block">Kode Pos</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={e => setForm({ ...form, postalCode: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs text-white outline-none focus:border-[#333]"
                    placeholder="12345"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-[#666] uppercase tracking-wider mb-1 block">Alamat</label>
                  <textarea
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs text-white outline-none focus:border-[#333] h-16 resize-none"
                    placeholder="Jl. Contoh No. 123"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-[#666] uppercase tracking-wider mb-1 block">Kota</label>
                  <select
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs text-white outline-none focus:border-[#333]"
                  >
                    <option value="">Pilih kota...</option>
                    {CITIES.map(city => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep('shipping')}
                disabled={!form.name || !form.phone || !form.address || !form.city}
                className="mt-4 px-5 py-2.5 bg-[#00d4aa] text-black text-xs font-medium hover:bg-[#00b894] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Lanjut ke Ongkir
              </button>
            </div>
          )}

          {step === 'shipping' && (
            <div className="bg-[#111] border border-[#222] p-5">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <Truck size={14} className="text-[#00d4aa]" /> Pilih Kurir
              </h3>
              <div className="grid sm:grid-cols-2 gap-2 mb-4">
                {COURIERS.map(courier => (
                  <button
                    key={courier.id}
                    onClick={() => setSelectedCourier(courier.id)}
                    className={`p-3 text-left border transition-colors ${
                      selectedCourier === courier.id
                        ? 'border-[#00d4aa] bg-[#0a1a15]'
                        : 'border-[#222] bg-[#0a0a0a] hover:border-[#333]'
                    }`}
                  >
                    <span className="text-xs font-medium text-white">{courier.name}</span>
                    <p className="text-[10px] text-[#666] mt-0.5">
                      {courier.id === 'jne' ? 'Estimasi 2-3 hari' : courier.id === 'jnt' ? 'Estimasi 1-3 hari' : courier.id === 'sicepat' ? 'Estimasi 1-2 hari' : 'Estimasi 3-5 hari'}
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#666] mb-3">Total berat: {(totalWeight / 1000).toFixed(1)} kg</p>
              <button
                onClick={calculateShipping}
                disabled={!selectedCourier || calculating}
                className="px-4 py-2 bg-[#1a1a1a] border border-[#333] text-white text-xs font-medium hover:border-[#555] transition-colors disabled:opacity-30"
              >
                {calculating ? <Loader2 size={12} className="animate-spin" /> : 'Hitung Ongkir'}
              </button>
              {shippingCost > 0 && (
                <p className="text-xs text-[#00d4aa] mt-3">Ongkir: Rp {shippingCost.toLocaleString('id-ID')}</p>
              )}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep('form')} className="px-4 py-2 bg-[#1a1a1a] border border-[#333] text-white text-xs hover:border-[#555] transition-colors">
                  Kembali
                </button>
                <button
                  onClick={() => setStep('payment')}
                  disabled={shippingCost === 0}
                  className="px-5 py-2.5 bg-[#00d4aa] text-black text-xs font-medium hover:bg-[#00b894] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Lanjut ke Pembayaran
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-[#111] border border-[#222] p-5">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <CreditCard size={14} className="text-[#00d4aa]" /> Pembayaran (Midtrans)
              </h3>
              <div className="bg-[#0a0a0a] border border-[#222] p-4 mb-4">
                <p className="text-[10px] text-[#666] uppercase tracking-wider mb-2">Detail Pembayaran</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888]">Subtotal ({state.totalItems} item)</span>
                    <span className="text-white">Rp {state.totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888]">Ongkir ({COURIERS.find(c => c.id === selectedCourier)?.name})</span>
                    <span className="text-white">Rp {shippingCost.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-[#222] pt-1.5 mt-1.5 flex justify-between">
                    <span className="text-xs font-medium text-white">Total</span>
                    <span className="text-sm font-bold text-[#00d4aa]">Rp {(state.totalPrice + shippingCost).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] p-4 mb-4">
                <p className="text-[10px] text-[#666] uppercase tracking-wider mb-2">Kirim ke</p>
                <p className="text-xs text-white">{form.name}</p>
                <p className="text-xs text-[#888]">{form.phone}</p>
                <p className="text-xs text-[#888]">{form.address}, {form.city} {form.postalCode}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('shipping')} className="px-4 py-2 bg-[#1a1a1a] border border-[#333] text-white text-xs hover:border-[#555] transition-colors">
                  Kembali
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="flex-1 py-2.5 bg-[#00d4aa] text-black text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#00b894] transition-colors disabled:opacity-50"
                >
                  {processing ? <><Loader2 size={12} className="animate-spin" /> Memproses...</> : <><CreditCard size={12} /> Bayar Sekarang</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-[#111] border border-[#222] p-5 h-fit">
          <h3 className="text-sm font-medium text-white mb-3">Pesanan Anda</h3>
          <div className="space-y-2 mb-4">
            {state.items.map(item => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="text-[#888] truncate mr-2">{item.name} × {item.quantity}</span>
                <span className="text-white shrink-0">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#222] pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-[#666]">Subtotal</span>
              <span className="text-white">Rp {state.totalPrice.toLocaleString('id-ID')}</span>
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#666]">Ongkir</span>
                <span className="text-white">Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between mt-2 pt-2 border-t border-[#222]">
              <span className="text-xs font-medium text-white">Total</span>
              <span className="text-sm font-bold text-[#00d4aa]">
                Rp {(state.totalPrice + shippingCost).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
