import React from 'react';
import { ChevronRight, ShieldCheck, Zap, Headphones, Laptop, Smartphone, Watch } from 'lucide-react';

interface TechNovaHeroProps {
  onShopNow: () => void;
}

export const TechNovaHero: React.FC<TechNovaHeroProps> = ({ onShopNow }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#3b28cc] via-[#3320bf] to-[#1e107a] text-white">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Bengali Headline, Subtitle, CTA */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-purple-200">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Winter 2026 Gadget Fest Live</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-['Hind_Siliguri',sans-serif]">
              সেরা গ্যাজেট,<br />
              <span className="text-amber-300">সেরা দামে!</span>
            </h1>

            <p className="text-sm sm:text-lg text-white/90 font-normal max-w-xl mx-auto lg:mx-0 font-['Hind_Siliguri',sans-serif]">
              বাংলাদেশ সবচেয়ে বড় অনলাইন গ্যাজেট শপ
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-sm tracking-wide shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2 group cursor-pointer active:scale-98 min-h-[44px]"
              >
                <span>এখনই কিনুন</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#3b28cc]" />
              </button>

              <div className="flex items-center gap-4 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ১০০% আসল প্রোডাক্ট
                </span>
                <span>•</span>
                <span>ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Tech Gadgets Artwork Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Visual composition matching the screenshot with glowing devices */}
            <div className="relative w-full max-w-lg aspect-[16/10] flex items-center justify-center">
              {/* Device 1: Modern Laptop (Angle tilted) */}
              <div className="absolute left-4 bottom-2 w-72 sm:w-96 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Laptop Screen with colorful gradient wallpaper */}
                <div className="aspect-[16/10] bg-gradient-to-tr from-indigo-900 via-purple-700 to-pink-500 rounded-lg p-3 flex flex-col justify-between overflow-hidden relative shadow-inner">
                  <div className="w-full flex items-center justify-between text-[8px] text-white/70">
                    <span>TechNova OS 26</span>
                    <span>100% 🔋</span>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-xs font-bold text-white drop-shadow">Ultra Slim Pro</p>
                    <p className="text-[9px] text-white/80">M3 Max Silicon</p>
                  </div>
                  <div className="h-1.5 w-16 bg-white/30 rounded-full mx-auto" />
                </div>
                {/* Laptop Keyboard base */}
                <div className="h-3 bg-neutral-800 rounded-b mt-1.5 flex items-center justify-center">
                  <div className="w-12 h-1 bg-neutral-700 rounded-full" />
                </div>
              </div>

              {/* Device 2: Smartphone (Vertical modern bezel-less phone) */}
              <div className="absolute right-12 top-0 sm:top-2 w-28 sm:w-36 aspect-[9/19] bg-neutral-950 rounded-2xl border-2 border-neutral-700 shadow-2xl p-1 z-20 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                {/* Dynamic island */}
                <div className="w-8 h-2 bg-black rounded-full mx-auto mb-1" />
                {/* Screen */}
                <div className="w-full h-[calc(100%-12px)] bg-gradient-to-b from-purple-600 via-indigo-700 to-neutral-900 rounded-xl p-2 flex flex-col justify-between text-white text-[9px]">
                  <div className="text-center pt-2">
                    <p className="font-bold text-xs">10:08</p>
                    <p className="text-[8px] text-white/70">Sunday</p>
                  </div>
                  <div className="p-1.5 bg-white/10 backdrop-blur rounded-lg text-[8px] text-center">
                    <span>⚡ Special Offer</span>
                  </div>
                </div>
              </div>

              {/* Device 3: Smartwatch */}
              <div className="absolute right-0 bottom-4 w-24 sm:w-32 aspect-square bg-neutral-950 rounded-2xl border-2 border-neutral-700 shadow-2xl p-2 z-30 transform -rotate-6 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[8px] text-neutral-400">
                  <Watch className="w-3 h-3 text-red-500" />
                  <span>10:08</span>
                </div>
                <div className="text-center">
                  <span className="text-base font-extrabold text-white">84</span>
                  <span className="text-[8px] text-emerald-400 block font-semibold">BPM &bull; FIT</span>
                </div>
                <div className="h-1 bg-red-500/60 rounded-full w-full" />
              </div>

              {/* Device 4: AirPods Pro Case */}
              <div className="absolute left-28 sm:left-40 bottom-0 w-20 sm:w-24 aspect-[4/3] bg-white rounded-xl shadow-2xl border border-neutral-200 p-2 z-30 flex flex-col items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mb-1 animate-pulse" />
                <Headphones className="w-5 h-5 text-neutral-800" />
                <span className="text-[7px] text-neutral-500 font-bold mt-1">AirPods</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
