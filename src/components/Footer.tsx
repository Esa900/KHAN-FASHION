import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC<{ onNavigateAdmin: () => void }> = ({ onNavigateAdmin }) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white uppercase block">
              A U R A
            </span>
            <span className="text-[10px] tracking-[0.3em] text-amber-400 uppercase font-semibold block">
              BANGLADESH &bull; LUXURY ATELIER
            </span>
            <p className="text-neutral-400 font-light leading-relaxed max-w-sm">
              Pioneering modern South Asian luxury through master handloom weaving, bespoke Panjabi tailoring, and architectural silhouettes designed for the contemporary connoisseur.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Google AI Studio Gemini API</span>
            </div>
          </div>

          {/* Boutiques */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">Flagship Boutiques</h4>
            <ul className="space-y-2 text-neutral-400 font-light">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>Gulshan-2: House 42, Road 113, Dhaka-1212</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 mt-0.5 flex-shrink-0" />
                <span>Dhanmondi: Road 27, Imperial Lounge</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 mt-0.5 flex-shrink-0" />
                <span>Banani: Road 11, Block F</span>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">Concierge &amp; Care</h4>
            <ul className="space-y-2 text-neutral-400 font-light">
              <li>Exchange &amp; Returns (7 Days)</li>
              <li>Size &amp; Measurement Guide</li>
              <li>Handloom Silk Preservation</li>
              <li>Track Active Consignment</li>
              <li>Corporate &amp; Wedding Orders</li>
            </ul>
          </div>

          {/* Admin & Operations Portal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">Internal Operations</h4>
            <p className="text-[11px] text-neutral-400 font-light">
              Store managers and inventory operations staff can access the secure portal.
            </p>
            <button
              onClick={onNavigateAdmin}
              className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-neutral-700 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Panel (/admin)</span>
            </button>
          </div>
        </div>

        {/* Payment Gateways & Logistics Badges */}
        <div className="pt-8 border-t border-neutral-850 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>Official Gateways:</span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-pink-400 font-bold">bKash</span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-orange-400 font-bold">Nagad</span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-300 font-bold">Cash on Delivery</span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-blue-400 font-bold">SSLCommerz</span>
          </div>

          <div>
            <span>Nationwide Couriers: Pathao Express &bull; Steadfast &bull; Paperfly</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-600 text-[10px]">
          <p>&copy; {new Date().getFullYear()} AURA Bangladesh Atelier. All rights reserved.</p>
          <p>Handcrafted luxury with integrity &bull; Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
};
