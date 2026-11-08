import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductColor } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color?: ProductColor, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode: string;
  appliedCoupon: { code: string; discountPercent?: number; flatDiscount?: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('technova_cart') || localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('technova_wishlist') || localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent?: number; flatDiscount?: number } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('technova_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('technova_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist:', e);
    }
  }, [wishlist]);

  const addToCart = (
    product: Product,
    size: string,
    color?: ProductColor,
    quantity = 1
  ) => {
    const effectiveColor = color || product.colors[0] || { name: 'Standard', hex: '#000000' };
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id &&
          item.selectedSize === size &&
          (!item.selectedColor || item.selectedColor.name === effectiveColor.name)
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, selectedSize: size, selectedColor: effectiveColor, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'EID2026') {
      setAppliedCoupon({ code: clean, discountPercent: 15 });
      setCouponCode(clean);
      return { success: true, message: 'Eid Celebration 15% discount applied!' };
    } else if (clean === 'AURA10') {
      setAppliedCoupon({ code: clean, discountPercent: 10 });
      setCouponCode(clean);
      return { success: true, message: '10% Welcome discount applied!' };
    } else if (clean === 'FASHION500') {
      setAppliedCoupon({ code: clean, flatDiscount: 500 });
      setCouponCode(clean);
      return { success: true, message: '৳500 Voucher applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try: EID2026 or AURA10' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.salePrice ?? item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discount = Math.min(subtotal, appliedCoupon.flatDiscount);
    }
  }

  // Free shipping over ৳3,000, otherwise ৳80 inside Dhaka standard
  const shippingFee = subtotal > 3000 || subtotal === 0 ? 0 : 80;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
