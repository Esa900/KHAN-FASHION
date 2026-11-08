import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  badge: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'EID ATELIER DROP 2026',
    title: 'Imperial Velvet & Zardozi Panjabis',
    subtitle: 'Woven with high-thread mulberry silk and sculpted antique brass closures, tailored for monumental festive gatherings.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85',
    category: 'Panjabi',
    badge: 'Exclusive Drop'
  },
  {
    id: 2,
    tag: 'SONARGAON ARCHIVE',
    title: 'Handloom Jamdani & Pure Katan Sarees',
    subtitle: 'Preserving four centuries of Bengali textile heritage. 84-count organic cotton with woven floral jaals in antique gold zari.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
    category: 'Saree',
    badge: 'Heirloom Craft'
  },
  {
    id: 3,
    tag: 'CONTEMPORARY TAILORING',
    title: 'Normandy Flax Linen & Pleated Chinos',
    subtitle: 'Breathable sartorial architecture engineered for the Dhaka climate. Effortless minimalism meets crisp silhouettes.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=85',
    category: 'Western',
    badge: 'New Season'
  }
];

export const HeroSlider: React.FC<{ onSelectCategory: (cat: string) => void }> = ({ onSelectCategory }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full h-[460px] sm:h-[600px] overflow-hidden bg-neutral-950">
      {/* Background Slides with Fade */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/50" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {slide.tag}
            </span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
            {slide.title}
          </h1>

          <p className="text-xs sm:text-base text-neutral-300 leading-relaxed max-w-xl font-light line-clamp-2 sm:line-clamp-none">
            {slide.subtitle}
          </p>

          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => onSelectCategory(slide.category)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 group min-h-[44px]"
            >
              <span>Explore {slide.category}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => onSelectCategory('All')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-wider border border-neutral-700 transition min-h-[44px]"
            >
              View Full Lookbook
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-6 bottom-16 sm:bottom-20 z-20 flex items-center gap-2">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
          className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-amber-400' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
