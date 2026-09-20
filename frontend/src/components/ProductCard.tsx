import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
}

const imageIcons: Record<string, string> = {
  keyboard: '⌨️',
  monitor: '🖥️',
  mouse: '🖱️',
  hub: '🔌',
  webcam: '📷',
  mat: '🟫',
  lamp: '💡',
  headphone: '🎧',
};

export default function ProductCard({ id, name, price, stock, category, description, image }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-[#111111] border border-[#222222] p-4 flex flex-col hover:border-[#333] transition-colors">
      {/* Image placeholder */}
      <div className="w-full aspect-square bg-[#1a1a1a] flex items-center justify-center mb-4">
        <span className="text-5xl">{imageIcons[image] || '📦'}</span>
      </div>

      {/* Category */}
      <span className="text-[10px] uppercase tracking-wider text-[#00d4aa] font-medium mb-1">{category}</span>

      {/* Name */}
      <h3 className="text-sm font-medium text-white mb-1 leading-tight">{name}</h3>

      {/* Description */}
      <p className="text-xs text-[#666] leading-relaxed mb-3 line-clamp-2">{description}</p>

      {/* Price & Stock */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-semibold text-white">
          Rp {price.toLocaleString('id-ID')}
        </span>
        <span className={`text-[10px] ${stock > 10 ? 'text-[#00d4aa]' : stock > 0 ? 'text-[#ffa502]' : 'text-[#ff4757]'}`}>
          {stock > 0 ? `${stock} stok` : 'Habis'}
        </span>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={stock === 0}
        className={`w-full py-2 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
          added
            ? 'bg-[#00b894] text-black'
            : stock === 0
            ? 'bg-[#222] text-[#555] cursor-not-allowed'
            : 'bg-[#00d4aa] text-black hover:bg-[#00b894]'
        }`}
      >
        {added ? (
          <><Check size={12} /> Ditambahkan</>
        ) : (
          <><ShoppingCart size={12} /> Tambah ke Keranjang</>
        )}
      </button>
    </div>
  );
}
