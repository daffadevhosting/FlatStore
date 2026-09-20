import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, Home, MapPin, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const location = useLocation();
  const { state } = useCart();

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Produk', icon: Package },
    { to: '/cart', label: 'Keranjang', icon: ShoppingCart },
    { to: '/tracking', label: 'Tracking', icon: MapPin },
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#00d4aa] flex items-center justify-center">
              <span className="text-black font-bold text-xs">FS</span>
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">FlatStore</span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-[#00d4aa] bg-[#1a1a1a]'
                      : 'text-[#888] hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{link.label}</span>
                  {link.to === '/cart' && state.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00d4aa] text-black text-[10px] font-bold flex items-center justify-center">
                      {state.totalItems}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
