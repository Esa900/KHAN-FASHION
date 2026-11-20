import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Sparkles, Star, RefreshCw, Zap } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onDirectBuy: (product: Product, size: string, color: ProductColor, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onSelectProduct,
  onDirectBuy
}) => {
  if (!product) return null;

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return product.sizes.find(s => s.stock > 0)?.size || product.sizes[0]?.size || 'Standard';
  });
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  const [completeTheLook, setCompleteTheLook] = useState<{ reason: string; items: Product[] } | null>(null);
  const [loadingAIRecommendations, setLoadingAIRecommendations] = useState(false);

  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedColor(product.colors[0] || { name: 'Standard', hex: '#000000' });
    setSelectedSize(product.sizes.find(s => s.stock > 0)?.size || product.sizes[0]?.size || 'Standard');
    setQuantity(1);

    async function fetchLook() {
      setLoadingAIRecommendations(true);
      try {
        const res = await fetch('/api/ai/complete-the-look', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product?.id })
        });
        if (res.ok) {
          const data = await res.json();
          setCompleteTheLook(data);
        }
      } catch (e) {
        console.error('Failed to load recommendations:', e);
      } finally {
        setLoadingAIRecommendations(false);
      }
    }
    fetchLook();
  }, [product]);

  const activeSizeObj = product.sizes.find(s => s.size === selectedSize);
  const currentStock = activeSizeObj?.stock ?? 0;
  const isWishlisted = isInWishlist(product.id);
  const hasSale = product.salePrice !== undefined && product.salePrice < product.price;
  const unitPrice = product.salePrice ?? product.price;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleAddToCart = () => {
    if (currentStock <= 0) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleDirectBuy = () => {
    if (currentStock <= 0) return;
    onDirectBuy(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full sm:max-w-5xl bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Mobile Drag Pill */}
        <div className="sm:hidden pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 p-4 sm:p-8 pb-32 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
            {/* Gallery Column */}
            <div className="space-y-3">
              <div
                className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white border border-neutral-800 cursor-crosshair flex items-center justify-center p-4"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-contain transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`
                        }
                      : undefined
                  }
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 bg-white transition flex-shrink-0 ${
                        activeImageIdx === idx ? 'border-[#e02424]' : 'border-neutral-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>{product.category}</span>
                  <span>&middot;</span>
                  <span>{product.subCategory || 'Electronics'}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="ml-1.5 font-bold text-neutral-200 tabular-nums">{product.rating}</span>
                  </div>
                  <span className="text-xs text-neutral-400 tabular-nums">({product.reviewsCount} reviews)</span>
                </div>

                {/* Pricing */}
                <div className="mt-3 flex items-baseline gap-3 tabular-nums">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                    ৳{unitPrice.toLocaleString('en-BD')}
                  </span>
                  {hasSale && (
                    <>
                      <span className="text-sm text-neutral-500 line-through font-mono">
                        ৳{product.price.toLocaleString('en-BD')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#e02424] text-white text-[10px] font-bold uppercase">
                        Save ৳{(product.price - product.salePrice!).toLocaleString('en-BD')}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  {product.description}
                </p>

                {/* Colors */}
                <div className="mt-5">
                  <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-2">
                    Color: <strong className="text-white">{selectedColor.name}</strong>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition min-h-[40px] ${
                          selectedColor.name === c.name
                            ? 'border-[#e02424] bg-neutral-800 text-white'
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-neutral-700" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variant / Option */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[11px]">
                      Edition / Option
                    </span>
                    {product.warranty && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{product.warranty}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const isSelected = selectedSize === s.size;
                      const isOutOfStock = s.stock === 0;

                      return (
                        <button
                          key={s.size}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSize(s.size)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition border min-h-[46px] ${
                            isSelected
                              ? 'bg-white text-neutral-950 border-white shadow-lg'
                              : isOutOfStock
                              ? 'bg-neutral-950/60 text-neutral-600 border-neutral-900 line-through'
                              : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <span>{s.size}</span>
                          <span className="text-[9px] font-normal mt-0.5 tabular-nums">
                            {isOutOfStock ? 'Sold Out' : `${s.stock} in stock`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Build & Care */}
                <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5 text-xs">
                  {product.fabric && (
                    <div>
                      <span className="text-neutral-400 font-semibold">Build &amp; Material:</span>{' '}
                      <span className="text-neutral-200">{product.fabric}</span>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div>
                      <span className="text-neutral-400 font-semibold">Usage &amp; Care:</span>{' '}
                      <span className="text-neutral-300">{product.careInstructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Action Row: Qty + Add to Cart + Direct Buy */}
              <div className="hidden sm:flex pt-4 border-t border-neutral-800 items-center gap-2.5">
                <div className="flex items-center rounded-lg bg-neutral-950 border border-neutral-800 px-2.5 py-2 min-h-[44px]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-neutral-400 hover:text-white px-2 py-0.5"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white px-2.5 tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="text-neutral-400 hover:text-white px-2 py-0.5 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={currentStock <= 0}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition min-h-[44px] disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{currentStock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleDirectBuy}
                  disabled={currentStock <= 0}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 bg-[#e02424] hover:bg-[#c81e1e] text-white shadow-lg shadow-red-600/20 transition min-h-[44px] disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isWishlisted ? 'bg-rose-500 text-white border-rose-500' : 'bg-neutral-950 text-neutral-300 border-neutral-800'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Related Pairings Section */}
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e02424]" />
                <h3 className="text-sm font-bold text-white">Frequently Bought Together</h3>
              </div>
              {loadingAIRecommendations && <RefreshCw className="w-3.5 h-3.5 text-[#e02424] animate-spin" />}
            </div>

            {completeTheLook?.items && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {completeTheLook.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-red-500/50 cursor-pointer flex items-center gap-3 transition min-h-[56px]"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-contain rounded-lg bg-white p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-red-400 font-semibold uppercase block">{item.category}</span>
                      <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                      <p className="text-xs font-mono font-bold text-neutral-200 mt-0.5 tabular-nums">
                        ৳{(item.salePrice ?? item.price).toLocaleString('en-BD')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Mobile Action Bar: Qty + Add to Cart + Direct Buy */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 flex items-center gap-2 z-30 safe-area-bottom">
          <div className="flex items-center rounded-xl bg-neutral-900 border border-neutral-700 px-1.5 py-1 min-h-[46px]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-neutral-400 hover:text-white px-2 py-1 text-base font-bold"
            >
              -
            </button>
            <span className="text-xs font-bold text-white px-1.5 font-mono tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              disabled={quantity >= currentStock}
              className="text-neutral-400 hover:text-white px-2 py-1 text-base font-bold disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="flex-1 py-3 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-1.5 min-h-[46px] disabled:opacity-50 whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add Cart</span>
          </button>

          <button
            onClick={handleDirectBuy}
            disabled={currentStock <= 0}
            className="flex-1 py-3 px-3 rounded-xl bg-[#e02424] hover:bg-[#c81e1e] text-white font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/20 min-h-[46px] disabled:opacity-50 whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
