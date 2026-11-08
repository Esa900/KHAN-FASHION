import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Tag, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreMore
}) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, success: res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Your bag is empty</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Discover our new festive and handcrafted collections.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreMore();
                  }}
                  className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemPrice = item.product.salePrice ?? item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor?.name || 'def'}-${index}`}
                    className="flex gap-4 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 group"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-20 h-24 object-cover rounded-lg bg-neutral-900 flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-neutral-500 hover:text-rose-400 transition p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variants tag */}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                          {item.selectedSize && (
                            <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 font-medium">
                              {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-neutral-700"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span>{item.selectedColor.name}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Quantity Stepper */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-850">
                        <div className="flex items-center rounded-md bg-neutral-900 border border-neutral-700 text-xs">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-white font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-white">
                          ৳{(itemPrice * item.quantity).toLocaleString('en-BD')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/90 space-y-4">
              {/* Promo code */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        Promo Applied: <strong>{appliedCoupon.code}</strong> (
                        {appliedCoupon.discountPercent ? `${appliedCoupon.discountPercent}% OFF` : `৳${appliedCoupon.flatDiscount} OFF`})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-400 hover:text-white text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (Try: EID2026)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 uppercase tracking-wider focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponMessage.success ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-400 border-t border-neutral-850 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">৳{subtotal.toLocaleString('en-BD')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-৳{discount.toLocaleString('en-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 uppercase text-[10px] font-bold">Free</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total Amount</span>
                  <span className="text-base text-amber-400">৳{total.toLocaleString('en-BD')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Secured &bull; bKash, Nagad, Visa, Mastercard &amp; COD</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
