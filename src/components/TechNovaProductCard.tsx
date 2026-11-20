import React, { useState } from 'react';
import { ShoppingCart, Heart, Zap, Package, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface TechNovaProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onDirectBuy: (product: Product) => void;
}

export const TechNovaProductCard: React.FC<TechNovaProductCardProps> = ({
  product,
  onOpenDetails,
  onDirectBuy
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
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
    const defaultSize = product.sizes.find(s => s.stock > 0)?.size || product.sizes[0]?.size || 'Standard';
    const defaultColor = product.colors[0] || { name: 'Standard', hex: '#000000' };
    addToCart(product, defaultSize, defaultColor, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleDirectBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onDirectBuy(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden flex items-center justify-center p-3">
        {/* Discount Tag */}
        {hasDiscount && (
          <div className="absolute top-0 left-0 bg-[#e02424] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-br-lg z-10 tabular-nums">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-400 hover:text-[#e02424] shadow-2xs transition z-10 min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#e02424]' : ''}`} />
        </button>

        {/* Product Image with Resilient Fallback */}
        {imageError || !product.images?.[0] ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100 rounded-lg p-3 text-center">
            <Package className="w-8 h-8 mb-1.5 text-neutral-300" />
            <span className="text-[11px] font-medium text-neutral-500 line-clamp-2">
              {product.title}
            </span>
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.title}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-80'
            }`}
            loading="lazy"
          />
        )}

        {/* Out of Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="px-3 py-1 rounded bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
        <div>
          <p className="text-[11px] text-neutral-500 font-medium leading-none mb-1.5 truncate">
            {product.category} &middot; {product.brand || 'TechNova Mart'}
          </p>

          <h3
            className="text-xs sm:text-sm font-semibold text-neutral-900 group-hover:text-[#e02424] transition line-clamp-2 h-9 sm:h-10 leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        <div className="mt-2.5">
          {/* Pricing */}
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-base sm:text-lg font-bold text-[#e02424] tracking-tight">
              ৳{salePrice.toLocaleString('en-BD')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{originalPrice.toLocaleString('en-BD')}
              </span>
            )}
          </div>

          {/* Side-by-Side: Add to Cart + Direct Buy (1-Click Order) */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-2 px-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-98 min-h-[40px] whitespace-nowrap border ${
                isOutOfStock
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600 text-white border-emerald-600 cursor-pointer'
                  : 'bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white border-neutral-300 hover:border-neutral-900 cursor-pointer'
              }`}
              title="Add to Cart"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    <span className="hidden sm:inline">Add </span>Cart
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleDirectBuy}
              disabled={isOutOfStock}
              className={`py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition active:scale-98 min-h-[40px] whitespace-nowrap shadow-2xs ${
                isOutOfStock
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#e02424] hover:bg-[#c81e1e] text-white cursor-pointer'
              }`}
              title="1-Click Direct Order"
            >
              <Zap className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{isOutOfStock ? 'Sold Out' : 'Buy Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
