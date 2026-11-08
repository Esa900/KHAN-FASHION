import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

interface TechNovaFooterProps {
  onNavigate: (view: 'store' | 'profile' | 'admin', categoryFilter?: string) => void;
  onOpenProfile: () => void;
}

export const TechNovaFooter: React.FC<TechNovaFooterProps> = ({
  onNavigate,
  onOpenProfile
}) => {
  return (
    <footer className="bg-[#0b0f19] text-white pt-12 sm:pt-16 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-neutral-800/80">
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('store')}>
              <div className="w-9 h-9 bg-[#e02424] rounded-lg flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
                T
              </div>
              <div className="flex items-baseline">
                <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                  TechNova
                </span>
                <span className="text-xs font-medium text-neutral-400 ml-1 leading-none">
                  Mart
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Bangladesh's best online gadget &amp; electronics shopping platform. Top quality products delivered to your doorstep.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#1877f2] text-neutral-300 hover:text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <span className="text-xs font-bold">f</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#ff0000] text-neutral-300 hover:text-white flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <span className="text-xs font-bold">▶</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-white transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-white transition"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-white transition"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-white transition"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={onOpenProfile}
                  className="hover:text-white transition"
                >
                  My Orders
                </button>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Return Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Warranty Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Terms &amp; Conditions
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Payment Icons (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Contact Us
            </h4>

            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e02424] mt-0.5 flex-shrink-0" />
                <span>57/1, Road-7A, Dhanmondi, Dhaka-1209, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e02424] flex-shrink-0" />
                <a href="tel:+8801410732067" className="hover:underline">
                  +880 1410-732067
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e02424] flex-shrink-0" />
                <a href="mailto:support@technovamartbd.com" className="hover:underline">
                  support@technovamartbd.com
                </a>
              </div>
            </div>

            {/* We Accept Payment Icons */}
            <div className="pt-2">
              <p className="text-[11px] text-neutral-400 mb-2 font-medium">We Accept:</p>
              <div className="flex flex-wrap items-center gap-2">
                {/* bKash */}
                <span className="px-2.5 py-1 rounded bg-white text-[#d12053] font-black text-[11px] shadow-2xs border border-neutral-300">
                  bKash
                </span>
                {/* Nagad */}
                <span className="px-2.5 py-1 rounded bg-white text-[#f7931e] font-black text-[11px] shadow-2xs border border-neutral-300">
                  নগদ
                </span>
                {/* Upay */}
                <span className="px-2.5 py-1 rounded bg-white text-[#0066b2] font-black text-[11px] shadow-2xs border border-neutral-300">
                  upay
                </span>
                {/* Rocket / Cellfin */}
                <span className="px-2.5 py-1 rounded bg-white text-[#8c2d8c] font-black text-[11px] shadow-2xs border border-neutral-300">
                  Rocket
                </span>
                {/* VISA */}
                <span className="px-2.5 py-1 rounded bg-white text-[#1a1f71] font-black text-[11px] shadow-2xs border border-neutral-300">
                  VISA
                </span>
                {/* Mastercard */}
                <span className="px-2.5 py-1 rounded bg-white text-[#eb001b] font-black text-[11px] shadow-2xs border border-neutral-300">
                  Mastercard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits Bar matching screenshot */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <p>© 2026 TechNova Mart. All rights reserved.</p>
          <p className="text-neutral-400">
            Powered by <span className="font-semibold text-white">WinterX AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
