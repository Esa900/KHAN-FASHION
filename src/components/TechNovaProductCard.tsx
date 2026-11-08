import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface TechNovaProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const TechNovaProductCard: React.FC<TechNovaProductCardProps> = ({
  product,
  onOpenDetails
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const salePrice = product.salePrice ?? product.price;
  const originalPrice = product.price;
  const hasDiscount = product.salePrice !== undefined && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  // Stock check
  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
  const isOutOfStock = totalStock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes[0]?.size || 'Standard';
    const defaultColor = product.colors[0] || { name: 'Standard', hex: '#000000' };
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden flex items-center justify-center p-3">
        {/* Red Discount Badge in top-left matching screenshot */}
        {hasDiscount && (
          <div className="absolute top-0 left-0 bg-[#e02424] text-white text-[11px] font-bold px-2 py-0.5 rounded-br z-10 shadow-2xs">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button (touch target friendly) */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-neutral-400 hover:text-red-500 shadow-2xs transition z-10 min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={product.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-70'
          }`}
          loading="lazy"
        />

        {/* Out of Stock overlay if applicable */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="px-3 py-1 rounded bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Subtitle / Brand: Technova Mart */}
          <p className="text-[11px] text-neutral-400 font-normal leading-none mb-1">
            Technova Mart
          </p>

          {/* Product Title (2-line clamp) */}
          <h3
            className="text-xs sm:text-sm font-medium text-neutral-900 group-hover:text-[#e02424] transition line-clamp-2 h-9 sm:h-10 leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        <div className="mt-2.5">
          {/* Pricing: Red Sale Price + Strikethrough Original */}
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#e02424] tracking-tight">
              ৳{salePrice.toLocaleString('en-BD')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{originalPrice.toLocaleString('en-BD')}.00
              </span>
            )}
          </div>

          {/* Red Add to Cart Button matching screenshot */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full mt-2.5 py-2 sm:py-2.5 px-3 rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition active:scale-98 min-h-[40px] shadow-2xs ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-[#e02424] hover:bg-[#c81e1e] text-white cursor-pointer'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
