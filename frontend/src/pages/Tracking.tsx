import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useSession, Order } from '../context/SessionContext';

export default function Tracking() {
  const { orders } = useSession();
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!searchId.trim()) return;
    const found = orders.find(o => o.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setSearchResult(found);
      setNotFound(false);
    } else {
      setSearchResult(null);
      setNotFound(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} className="text-[#ffa502]" />;
      case 'paid': return <CheckCircle size={14} className="text-[#00d4aa]" />;
      case 'shipped': return <Truck size={14} className="text-[#00d4aa]" />;
      case 'delivered': return <Package size={14} className="text-[#00d4aa]" />;
      default: return <Clock size={14} className="text-[#555]" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Pembayaran';
      case 'paid': return 'Dibayar';
      case 'shipped': return 'Dikirim';
      case 'delivered': return 'Terkirim';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Lacak Pesanan</h1>
        <p className="text-xs text-[#666]">Masukkan Order ID untuk melacak pesanan Anda</p>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-8 max-w-md">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Masukkan Order ID..."
            className="w-full bg-[#111] border border-[#222] pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#333]"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-[#00d4aa] text-black text-xs font-medium hover:bg-[#00b894] transition-colors"
        >
          Lacak
        </button>
      </div>

      {/* Demo hint */}
      {orders.length === 0 && !searchResult && (
        <div className="bg-[#111] border border-[#222] p-5 mb-6">
          <p className="text-xs text-[#666]">
            💡 <span className="text-[#888]">Belum ada pesanan. Lakukan checkout terlebih dahulu untuk melihat tracking.</span>
          </p>
        </div>
      )}

      {/* Not Found */}
      {notFound && (
        <div className="bg-[#111] border border-[#331111] p-5 mb-6">
          <p className="text-xs text-[#ff4757]">Order ID tidak ditemukan. Pastikan ID yang dimasukkan benar.</p>
        </div>
      )}

      {/* Search Result */}
      {searchResult && (
        <div className="bg-[#111] border border-[#222] p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-white">{searchResult.id}</p>
              <p className="text-[10px] text-[#666]">{new Date(searchResult.createdAt).toLocaleString('id-ID')}</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#0a2a1a] border border-[#00d4aa33]">
              {getStatusIcon(searchResult.status)}
              <span className="text-[10px] text-[#00d4aa] font-medium">{getStatusLabel(searchResult.status)}</span>
            </div>
          </div>

          {/* Tracking Timeline */}
          {searchResult.trackingNumber && (
            <div className="mb-4 p-3 bg-[#0a0a0a] border border-[#222]">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={12} className="text-[#00d4aa]" />
                <span className="text-[10px] text-[#888] uppercase tracking-wider">No. Resi</span>
                <span className="text-xs font-mono text-[#00d4aa]">{searchResult.trackingNumber}</span>
              </div>
              <div className="space-y-3 pl-2 border-l border-[#222]">
                {[
                  { label: 'Pesanan dibuat', time: searchResult.createdAt, done: true },
                  { label: 'Pembayaran dikonfirmasi', time: searchResult.createdAt, done: true },
                  { label: 'Paket dijemput kurir', time: '', done: searchResult.status === 'shipped' || searchResult.status === 'delivered' },
                  { label: 'Paket terkirim', time: '', done: searchResult.status === 'delivered' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className={`absolute -left-[11px] w-2 h-2 ${step.done ? 'bg-[#00d4aa]' : 'bg-[#333]'}`}></div>
                    <div className="ml-3">
                      <p className={`text-xs ${step.done ? 'text-white' : 'text-[#555]'}`}>{step.label}</p>
                      {step.time && <p className="text-[10px] text-[#555]">{new Date(step.time).toLocaleString('id-ID')}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="border-t border-[#222] pt-3">
            <p className="text-[10px] text-[#666] uppercase tracking-wider mb-2">Item</p>
            <div className="space-y-1.5">
              {searchResult.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-[#888]">{item.name} × {item.quantity}</span>
                  <span className="text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#222] mt-2 pt-2 flex justify-between">
              <span className="text-xs text-[#666]">Total</span>
              <span className="text-sm font-bold text-[#00d4aa]">Rp {searchResult.total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-[#222] mt-3 pt-3">
            <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Dikirim ke</p>
            <p className="text-xs text-white">{searchResult.customerName}</p>
            <p className="text-xs text-[#888]">{searchResult.address}</p>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {orders.length > 0 && !searchResult && (
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Pesanan Terbaru</h3>
          <div className="space-y-px bg-[#222]">
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => { setSearchId(order.id); setSearchResult(order); setNotFound(false); }}
                className="bg-[#0a0a0a] p-4 flex items-center justify-between cursor-pointer hover:bg-[#111] transition-colors"
              >
                <div>
                  <p className="text-xs font-medium text-white">{order.id}</p>
                  <p className="text-[10px] text-[#666]">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white">Rp {order.total.toLocaleString('id-ID')}</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
