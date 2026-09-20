import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import products from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const categories = ['Semua', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Semua' || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Produk</h1>
        <p className="text-xs text-[#666]">{products.length} produk tersedia</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full bg-[#111] border border-[#222] pl-9 pr-4 py-2 text-xs text-white placeholder-[#555] outline-none focus:border-[#333]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#555]" />
          <div className="flex gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  category === cat
                    ? 'bg-[#00d4aa] text-black'
                    : 'bg-[#111] border border-[#222] text-[#888] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#222]">
          {filtered.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-sm text-[#555]">Tidak ada produk ditemukan.</p>
        </div>
      )}
    </div>
  );
}
