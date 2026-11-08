import React from 'react';
import { FilterState } from '../types';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalProductsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  totalProductsCount
}) => {
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
    <aside className="hidden lg:block lg:w-64 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-5 space-y-6 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Filters ({totalProductsCount})</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value as any })}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
        >
          <option value="featured">Curated &amp; Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-2.5">
          Category
        </label>
        <div className="flex flex-wrap lg:flex-col gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat })}
              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                filters.category === cat
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <label className="block text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-2.5">
          Size
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {sizes.map((sz) => (
            <button
              key={sz}
              onClick={() => onChange({ size: filters.size === sz ? '' : sz })}
              className={`py-2 rounded-md text-xs font-bold transition border ${
                filters.size === sz
                  ? 'bg-amber-400 text-black border-amber-400'
                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-2">
          <span>Max Price</span>
          <span className="text-amber-400 font-bold">৳{filters.maxPrice.toLocaleString('en-BD')}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="30000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
          <span>৳1,000</span>
          <span>৳30,000+</span>
        </div>
      </div>

      {/* Fabric Type */}
      <div>
        <label className="block text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-2">
          Fabric &amp; Material
        </label>
        <select
          value={filters.fabric}
          onChange={(e) => onChange({ fabric: e.target.value === 'All Fabrics' ? '' : e.target.value })}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
        >
          {fabrics.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* In Stock Only Checkbox */}
      <div className="pt-2 border-t border-neutral-800">
        <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500"
          />
          <span>In-stock items only</span>
        </label>
      </div>
    </aside>
  );
};
