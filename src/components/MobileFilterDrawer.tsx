import React from 'react';
import { X, RotateCcw, Check, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../types';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalProductsCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  totalProductsCount
}) => {
  if (!isOpen) return null;

  const categories = ['All', 'Panjabi', 'Saree', 'Western', 'Winter', 'Accessories'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const fabrics = [
    'All Fabrics',
    'Pure Silk',
    'Handloom Cotton',
    'Flax Linen',
    'Cashmere',
    'Pashmina',
    'Leather'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-up Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-neutral-900 border-t border-neutral-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Drag Handle Affordance */}
        <div className="pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Filter &amp; Refine Garments
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6 text-xs">
          {/* Category Pills */}
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[11px] mb-2.5">
              Collection Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onChange({ category: cat })}
                  className={`py-2.5 px-3 rounded-xl font-medium text-xs transition border min-h-[44px] flex items-center justify-center ${
                    filters.category === cat
                      ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-md'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[11px] mb-2.5">
              Size Fit (Chest / Drapery)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => onChange({ size: filters.size === sz ? '' : sz })}
                  className={`py-2.5 rounded-xl font-bold text-xs transition border min-h-[44px] flex items-center justify-center ${
                    filters.size === sz
                      ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              <span>Max Budget</span>
              <span className="text-amber-400 font-bold text-sm">৳{filters.maxPrice.toLocaleString('en-BD')}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>৳1,000</span>
              <span>৳30,000+</span>
            </div>
          </div>

          {/* Fabric Type */}
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[11px] mb-2">
              Fabric Weave &amp; Material
            </label>
            <select
              value={filters.fabric}
              onChange={(e) => onChange({ fabric: e.target.value === 'All Fabrics' ? '' : e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-xs text-white min-h-[44px] focus:outline-none focus:border-amber-500"
            >
              {fabrics.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[11px] mb-2">
              Sort Sequence
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as any })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-xs text-white min-h-[44px] focus:outline-none focus:border-amber-500"
            >
              <option value="featured">Curated &amp; Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-2 border-t border-neutral-800">
            <label className="flex items-center gap-3 text-xs text-neutral-200 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onChange({ inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500"
              />
              <span>In-stock pieces only</span>
            </label>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center gap-3 safe-area-bottom">
          <button
            onClick={onReset}
            className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 min-h-[48px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 min-h-[48px]"
          >
            <Check className="w-4 h-4" />
            <span>Show {totalProductsCount} Garments</span>
          </button>
        </div>
      </div>
    </div>
  );
};
