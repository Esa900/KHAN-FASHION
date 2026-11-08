import React from 'react';
import { Smartphone, Laptop, Headphones, Tablet, Watch, BookOpen, Layers } from 'lucide-react';

interface TechNovaCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const TechNovaCategories: React.FC<TechNovaCategoriesProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories = [
    {
      id: 'Accessories',
      name: 'Accessories',
      icon: Layers,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80',
      bgColor: 'bg-red-50 text-red-600'
    },
    {
      id: 'Smartphone',
      name: 'Smartphone',
      icon: Smartphone,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&q=80',
      bgColor: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'Laptop',
      name: 'Laptop',
      icon: Laptop,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=150&q=80',
      bgColor: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'Earbuds',
      name: 'Earbuds',
      icon: Headphones,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=150&q=80',
      bgColor: 'bg-amber-50 text-amber-600'
    },
    {
      id: 'Tablet',
      name: 'Tablet',
      icon: Tablet,
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=150&q=80',
      bgColor: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'Smartwatch',
      name: 'Smartwatch',
      icon: Watch,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80',
      bgColor: 'bg-sky-50 text-sky-600'
    },
    {
      id: 'Books',
      name: 'Books',
      icon: BookOpen,
      imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=150&q=80',
      bgColor: 'bg-indigo-50 text-indigo-600'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Categories
        </h2>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs text-red-600 font-semibold hover:underline"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {/* 7 categories in responsive grid / horizontal scroll on mobile */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? 'All' : cat.id)}
              className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] sm:min-h-[110px] ${
                isSelected
                  ? 'bg-red-50 border-red-500 shadow-sm ring-2 ring-red-400'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              {/* Icon Container */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 shadow-2xs ${cat.bgColor}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Category Label */}
              <span className={`text-xs sm:text-sm font-semibold tracking-tight ${
                isSelected ? 'text-red-600 font-bold' : 'text-neutral-800'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
