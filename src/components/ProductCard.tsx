import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);

  const hasSale = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;
  const isWishlisted = isInWishlist(product.id);

  // Check total stock across sizes
  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
  const isLowStock = totalStock > 0 && totalStock <= 6;
  const isOutOfStock = totalStock === 0;

  // First available size
  const defaultSize = product.sizes.find(s => s.stock > 0)?.size || 'M';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, defaultSize, selectedColor, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-neutral-900/60 rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.99]"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Minimal Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {hasSale && (
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase shadow-md">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] sm:text-[10px] font-bold tracking-wider uppercase shadow-md">
              NEW
            </span>
          )}
          {isLowStock && (
            <span className="px-2 py-0.5 rounded bg-neutral-950/90 text-amber-300 border border-amber-500/40 text-[9px] sm:text-[10px] font-medium">
              Only {totalStock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 rounded bg-neutral-950/90 text-neutral-400 border border-neutral-700 text-[9px] sm:text-[10px] font-bold uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button (Touch friendly min 44x44px hitbox) */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition z-10 ${
            isWishlisted
              ? 'text-rose-500'
              : 'text-neutral-300 hover:text-white'
          }`}
          aria-label="Wishlist"
        >
          <div className="p-2 rounded-full bg-neutral-950/70 backdrop-blur-md">
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
          </div>
        </button>

        {/* Desktop Quick Actions overlay on hover */}
        <div className="hidden sm:flex absolute inset-x-3 bottom-3 items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-md transition ${
              isOutOfStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-white hover:bg-amber-400 text-neutral-950'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="p-2.5 rounded-lg bg-neutral-950/80 hover:bg-neutral-900 text-white border border-neutral-700 backdrop-blur-md transition min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean unboxed metadata separator */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 font-light mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">&bull;</span>
            <span className="truncate">{product.fabric ? product.fabric.split(' ')[0] : (product.brand || 'TechNova')}</span>
          </div>

          <h3 className="font-medium text-xs sm:text-sm text-neutral-100 group-hover:text-amber-400 transition line-clamp-1 leading-snug">
            {product.title}
          </h3>
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-base font-bold text-white tracking-tight font-mono">
              ৳{(product.salePrice ?? product.price).toLocaleString('en-BD')}
            </span>
            {hasSale && (
              <span className="text-[10px] sm:text-xs text-neutral-500 line-through font-mono">
                ৳{product.price.toLocaleString('en-BD')}
              </span>
            )}
          </div>

          {/* Mobile Tap Quick Add button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="sm:hidden p-2 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-black text-amber-300 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>

          {/* Color swatch dots for desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c);
                }}
                className={`w-3 h-3 rounded-full border transition ${
                  selectedColor.name === c.name ? 'ring-2 ring-amber-400 scale-110 border-white' : 'border-neutral-700 opacity-80'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
