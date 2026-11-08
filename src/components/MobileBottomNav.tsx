import React from 'react';
import { Home, Sparkles, ShoppingBag, User, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentView: 'store' | 'profile' | 'admin';
  onNavigate: (view: 'store' | 'profile' | 'admin', categoryFilter?: string) => void;
  onOpenStylist: () => void;
  onOpenFilterSheet: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenStylist,
  onOpenFilterSheet
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-5 items-center h-14">
        {/* Home / Shop */}
        <button
          onClick={() => onNavigate('store')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition ${
            currentView === 'store' ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Home and Drops"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Shop</span>
        </button>

        {/* Filter Sheet Trigger */}
        <button
          onClick={onOpenFilterSheet}
          className="flex flex-col items-center justify-center min-h-[44px] text-neutral-400 hover:text-amber-300 transition"
          aria-label="Filter Catalog"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Filter</span>
        </button>

        {/* AI Stylist Center Anchor */}
        <button
          onClick={onOpenStylist}
          className="flex flex-col items-center justify-center -mt-3.5"
          aria-label="Aura AI Stylist"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/25 active:scale-95 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-amber-400 tracking-tight mt-0.5">AI Stylist</span>
        </button>

        {/* Cart Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center min-h-[44px] text-neutral-400 hover:text-neutral-200 transition"
          aria-label="Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1.5 min-w-[16px] h-4 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Bag</span>
        </button>

        {/* User Account / Admin toggle */}
        <button
          onClick={() => {
            if (user?.role === 'admin') {
              onNavigate('admin');
            } else {
              onNavigate('profile');
            }
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] transition ${
            currentView === 'profile' || currentView === 'admin' ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Account"
        >
          {user?.role === 'admin' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            {user?.role === 'admin' ? 'Admin' : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};
