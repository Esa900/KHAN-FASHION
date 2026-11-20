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

  const categories = [
    'All',
    'Smartphone',
    'Laptop',
    'Earbuds',
    'Smartwatch',
    'Tablet',
    'Home Appliances',
    'Personal Care',
    'Accessories',
    'Books'
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
        {/* Drag Handle */}
        <div className="pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#e02424]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Filter Products
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
          {/* Category Grid */}
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[11px] mb-2.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onChange({ category: cat })}
                  className={`py-2.5 px-3 rounded-xl font-medium text-xs transition border min-h-[44px] flex items-center justify-center ${
                    filters.category === cat
                      ? 'bg-[#e02424] text-white border-[#e02424] font-bold shadow-md'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              <span>Max Budget</span>
              <span className="text-white font-bold text-sm tabular-nums">
                ৳{filters.maxPrice.toLocaleString('en-BD')}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="150000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-[#e02424] bg-neutral-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1 tabular-nums">
              <span>৳500</span>
              <span>৳1,50,000+</span>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[11px] mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as any })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-xs text-white min-h-[44px] focus:outline-none focus:border-[#e02424]"
            >
              <option value="featured">Featured First</option>
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
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-[#e02424] focus:ring-[#e02424]"
              />
              <span>In-stock items only</span>
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
            className="flex-1 py-3 rounded-xl bg-[#e02424] hover:bg-[#c81e1e] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[48px]"
          >
            <Check className="w-4 h-4" />
            <span>Show {totalProductsCount} Items</span>
          </button>
        </div>
      </div>
    </div>
  );
};
