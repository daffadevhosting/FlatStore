import { MapPin, Phone, Mail, Clock, CreditCard, Truck, HelpCircle, FileText, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Store Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#00d4aa] flex items-center justify-center">
                <span className="text-black font-bold text-xs">FS</span>
              </div>
              <span className="font-semibold text-white text-sm">FlatStore</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-[#00d4aa] mt-0.5 shrink-0" />
                <span className="text-xs text-[#888] leading-relaxed">
                  Jl. Teknologi No. 123<br />
                  Jakarta Selatan, 12345
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#00d4aa] shrink-0" />
                <span className="text-xs text-[#888]">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#00d4aa] shrink-0" />
                <span className="text-xs text-[#888]">support@flatstore.id</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-[#00d4aa] mt-0.5 shrink-0" />
                <div className="text-xs text-[#888] leading-relaxed">
                  <div>Senin - Jumat: 09:00 - 18:00</div>
                  <div>Sabtu: 09:00 - 15:00</div>
                  <div>Minggu: Tutup</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4">Customer Service</h3>
            <div className="space-y-2.5">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#888] hover:text-[#00d4aa] transition-colors">
                <Phone size={14} className="text-[#00d4aa]" />
                <span>WhatsApp</span>
              </a>
              <a href="https://t.me/flatstore_cs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#888] hover:text-[#00d4aa] transition-colors">
                <Phone size={14} className="text-[#00d4aa]" />
                <span>Telegram</span>
              </a>
              <a href="mailto:support@flatstore.id" className="flex items-center gap-2 text-xs text-[#888] hover:text-[#00d4aa] transition-colors">
                <Mail size={14} className="text-[#00d4aa]" />
                <span>Email Support</span>
              </a>
              <div className="pt-2 mt-2 border-t border-[#1a1a1a]">
                <p className="text-[10px] text-[#666] leading-relaxed">
                  Tim CS kami siap membantu Anda Senin - Sabtu pada jam operasional.
                </p>
              </div>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4">Pembayaran & Pengiriman</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={14} className="text-[#00d4aa]" />
                  <span className="text-[10px] text-[#666] uppercase tracking-wider">Metode Pembayaran</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['BCA', 'Mandiri', 'BNI', 'BRI', 'OVO', 'DANA', 'GoPay', 'ShopeePay'].map(method => (
                    <span key={method} className="px-2 py-1 bg-[#111] border border-[#222] text-[10px] text-[#888]">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={14} className="text-[#00d4aa]" />
                  <span className="text-[10px] text-[#666] uppercase tracking-wider">Kurir Pengiriman</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['JNE', 'J&T', 'SiCepat', 'POS', 'Anteraja', 'Ninja'].map(courier => (
                    <span key={courier} className="px-2 py-1 bg-[#111] border border-[#222] text-[10px] text-[#888]">
                      {courier}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Policies & Links */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4">Informasi</h3>
            <div className="space-y-2.5">
              <a href="#faq" className="flex items-center gap-2 text-xs text-[#888] hover:text-[#00d4aa] transition-colors">
                <HelpCircle size={14} className="text-[#00d4aa]" />
                <span>FAQ (Pertanyaan Umum)</span>
              </a>
              <a href="#terms" className="flex items-center gap-2 text-xs text-[#888] hover:text-[#00d4aa] transition-colors">
                <FileText size={14} className="text-[#00d4aa]" />
                <span>Syarat & Ketentuan</span>
              </a>
              <a href="#return" className="flex items-center gap-2 text-xs text-[#888] hover:text-[#00d4aa] transition-colors">
                <RotateCcw size={14} className="text-[#00d4aa]" />
                <span>Kebijakan Pengembalian</span>
              </a>
              <a href="#privacy" className="flex items-center gap-2 text-xs text-[#888] hover:text-[#00d4aa] transition-colors">
                <FileText size={14} className="text-[#00d4aa]" />
                <span>Kebijakan Privasi</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-[#555]">
            © 2026 FlatStore. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[#555]">
            <span>Powered by Cloudflare Workers</span>
            <span>•</span>
            <span>Payment by Midtrans</span>
            <span>•</span>
            <span>Notification via Telegram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
