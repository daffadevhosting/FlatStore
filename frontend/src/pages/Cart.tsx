import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import products from '../data/products';

export default function Cart() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#111] border border-[#222] flex items-center justify-center mb-4">
          <ShoppingBag size={24} className="text-[#333]" />
        </div>
        <h2 className="text-lg font-medium text-white mb-2">Keranjang Kosong</h2>
        <p className="text-xs text-[#666] mb-5">Belum ada produk di keranjang Anda.</p>
        <Link
          to="/products"
          className="px-5 py-2.5 bg-[#00d4aa] text-black text-xs font-medium hover:bg-[#00b894] transition-colors"
        >
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Keranjang</h1>
          <p className="text-xs text-[#666]">{state.totalItems} item</p>
        </div>
        <button
          onClick={clearCart}
          className="px-3 py-1.5 text-[10px] text-[#ff4757] border border-[#331111] hover:bg-[#1a0a0a] transition-colors"
        >
          Kosongkan
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-px bg-[#222]">
          {state.items.map(item => {
            const product = products.find(p => p.id === item.id);
            return (
              <div key={item.id} className="bg-[#0a0a0a] p-4 flex gap-4">
                <div className="w-16 h-16 bg-[#111] flex items-center justify-center shrink-0">
                  <span className="text-2xl">
                    {item.image === 'keyboard' ? '⌨️' : item.image === 'monitor' ? '🖥️' : item.image === 'mouse' ? '🖱️' : item.image === 'hub' ? '🔌' : item.image === 'webcam' ? '📷' : item.image === 'mat' ? '🟫' : item.image === 'lamp' ? '💡' : item.image === 'headphone' ? '🎧' : '📦'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                  <p className="text-xs text-[#666] mt-0.5">Rp {item.price.toLocaleString('id-ID')}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-[#222]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#888] hover:text-white transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-8 text-center text-xs text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, product?.stock || 99))}
                        className="w-7 h-7 flex items-center justify-center text-[#888] hover:text-white transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#ff4757] hover:text-[#ff6b7a] transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-medium text-white">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-[#111] border border-[#222] p-5 h-fit">
          <h3 className="text-sm font-medium text-white mb-4">Ringkasan</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-[#666]">Subtotal</span>
              <span className="text-white">Rp {state.totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#666]">Ongkir</span>
              <span className="text-[#888]">Dihitung di checkout</span>
            </div>
          </div>
          <div className="border-t border-[#222] pt-3 mb-4">
            <div className="flex justify-between">
              <span className="text-xs font-medium text-white">Total</span>
              <span className="text-base font-bold text-[#00d4aa]">Rp {state.totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="w-full py-2.5 bg-[#00d4aa] text-black text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#00b894] transition-colors"
          >
            Checkout <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
