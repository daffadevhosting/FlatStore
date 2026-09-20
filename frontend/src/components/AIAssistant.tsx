import { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import products from '../data/products';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya AI Assistant FlatStore. Tanyakan apapun tentang produk kami — nama, harga, stok, atau deskripsi.' }
  ]);
  const [input, setInput] = useState('');

  const processQuery = (query: string): string => {
    const q = query.toLowerCase();

    // Check if asking about specific product
    const matchedProduct = products.find(p =>
      q.includes(p.name.toLowerCase().split(' ')[0]) ||
      q.includes(p.id)
    );

    if (matchedProduct) {
      if (q.includes('harga') || q.includes('price') || q.includes('berapa')) {
        return `${matchedProduct.name} harganya Rp ${matchedProduct.price.toLocaleString('id-ID')}.`;
      }
      if (q.includes('stok') || q.includes('stock') || q.includes('tersedia')) {
        return `Stok ${matchedProduct.name}: ${matchedProduct.stock} unit tersedia.`;
      }
      if (q.includes('deskripsi') || q.includes('detail') || q.includes('tentang')) {
        return `${matchedProduct.name} — ${matchedProduct.description}`;
      }
      return `**${matchedProduct.name}**\n💰 Harga: Rp ${matchedProduct.price.toLocaleString('id-ID')}\n📦 Stok: ${matchedProduct.stock} unit\n📝 ${matchedProduct.description}`;
    }

    // General queries
    if (q.includes('semua produk') || q.includes('daftar produk') || q.includes('list')) {
      const list = products.map(p => `• ${p.name} — Rp ${p.price.toLocaleString('id-ID')}`).join('\n');
      return `Berikut daftar produk kami:\n\n${list}`;
    }

    if (q.includes('kategori') || q.includes('category')) {
      const categories = [...new Set(products.map(p => p.category))];
      return `Kategori produk kami: ${categories.join(', ')}`;
    }

    if (q.includes('termurah') || q.includes('murah') || q.includes('cheapest')) {
      const sorted = [...products].sort((a, b) => a.price - b.price);
      const cheapest = sorted[0];
      return `Produk termurah: ${cheapest.name} — Rp ${cheapest.price.toLocaleString('id-ID')}`;
    }

    if (q.includes('stok') && (q.includes('habis') || q.includes('tersedia'))) {
      const available = products.filter(p => p.stock > 0);
      return `Ada ${available.length} produk yang masih tersedia. Semua produk kami saat ini ready stock!`;
    }

    if (q.includes('bantuan') || q.includes('help') || q.includes('bisa apa')) {
      return `Saya bisa membantu Anda dengan:\n• Info produk (nama, harga, stok, deskripsi)\n• Daftar semua produk\n• Kategori produk\n• Produk termurah\n• Cek ketersediaan stok\n\nCoba tanyakan: "harga keyboard" atau "stok monitor"`;
    }

    return `Maaf, saya kurang paham pertanyaan Anda. Coba tanyakan tentang produk spesifik, misalnya "harga keyboard" atau "daftar produk".`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    const response = processQuery(input);
    const assistantMsg: Message = { role: 'assistant', content: response };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#00d4aa] text-black flex items-center justify-center hover:bg-[#00b894] transition-colors shadow-lg"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-[#111111] border border-[#222222] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#222222] flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00d4aa] flex items-center justify-center">
              <Bot size={12} className="text-black" />
            </div>
            <span className="text-sm font-medium text-white">AI Assistant</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-5 h-5 bg-[#1a1a1a] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={10} className="text-[#00d4aa]" />
                  </div>
                )}
                <div className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-[#00d4aa] text-black'
                    : 'bg-[#1a1a1a] text-[#ccc]'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-5 h-5 bg-[#333] flex items-center justify-center shrink-0 mt-0.5">
                    <User size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#222222]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Tanya tentang produk..."
                className="flex-1 bg-[#1a1a1a] border border-[#333] px-3 py-2 text-xs text-white placeholder-[#555] outline-none focus:border-[#00d4aa] transition-colors"
              />
              <button
                onClick={handleSend}
                className="px-3 py-2 bg-[#00d4aa] text-black hover:bg-[#00b894] transition-colors"
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
