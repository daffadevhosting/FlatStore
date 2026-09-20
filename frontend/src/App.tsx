import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SessionProvider } from './context/SessionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <SessionProvider>
          <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <AIAssistant />
            <Footer />
          </div>
        </SessionProvider>
      </CartProvider>
    </HashRouter>
  );
}
