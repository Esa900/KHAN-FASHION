import React from 'react';
import {
  LayoutGrid,
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Watch,
  Layers,
  Home,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface TechNovaCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const TechNovaCategories: React.FC<TechNovaCategoriesProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories = [
    { id: 'All', name: 'All Items', icon: LayoutGrid, bgColor: 'bg-neutral-100 text-neutral-800' },
    { id: 'Smartphone', name: 'Smartphone', icon: Smartphone, bgColor: 'bg-blue-50 text-blue-600' },
    { id: 'Laptop', name: 'Laptop', icon: Laptop, bgColor: 'bg-purple-50 text-purple-600' },
    { id: 'Earbuds', name: 'Earbuds', icon: Headphones, bgColor: 'bg-amber-50 text-amber-600' },
    { id: 'Smartwatch', name: 'Smartwatch', icon: Watch, bgColor: 'bg-sky-50 text-sky-600' },
    { id: 'Tablet', name: 'Tablet', icon: Tablet, bgColor: 'bg-emerald-50 text-emerald-600' },
    { id: 'Home Appliances', name: 'Appliances', icon: Home, bgColor: 'bg-orange-50 text-orange-600' },
    { id: 'Personal Care', name: 'Personal Care', icon: Sparkles, bgColor: 'bg-rose-50 text-rose-600' },
    { id: 'Accessories', name: 'Accessories', icon: Layers, bgColor: 'bg-red-50 text-red-600' },
    { id: 'Books', name: 'Books', icon: BookOpen, bgColor: 'bg-indigo-50 text-indigo-600' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
          Shop by Category
        </h2>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs text-[#e02424] font-semibold hover:underline cursor-pointer"
          >
            Show All Categories
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected && cat.id !== 'All' ? 'All' : cat.id)}
              className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer min-h-[84px] ${
                isSelected
                  ? 'bg-red-50 border-[#e02424] shadow-xs ring-1 ring-[#e02424]'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 ${cat.bgColor}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <span
                className={`text-[11px] sm:text-xs font-semibold tracking-tight whitespace-nowrap ${
                  isSelected ? 'text-[#e02424] font-bold' : 'text-neutral-800'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
