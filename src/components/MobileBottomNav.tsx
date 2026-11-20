import React from 'react';
import { Home, Sparkles, ShoppingBag, User, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  currentView: 'store' | 'profile' | 'admin';
  onNavigate: (view: 'store' | 'profile', categoryFilter?: string) => void;
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

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-1 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-5 items-center h-14">
        {/* Home / Shop */}
        <button
          onClick={() => onNavigate('store', 'All')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition ${
            currentView === 'store' ? 'text-[#e02424]' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Shop"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Shop</span>
        </button>

        {/* Filter Sheet Trigger */}
        <button
          onClick={onOpenFilterSheet}
          className="flex flex-col items-center justify-center min-h-[44px] text-neutral-400 hover:text-white transition"
          aria-label="Filter Catalog"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Filter</span>
        </button>

        {/* AI Assistant Center Anchor */}
        <button
          onClick={onOpenStylist}
          className="flex flex-col items-center justify-center -mt-3.5"
          aria-label="AI Assistant"
        >
          <div className="w-11 h-11 rounded-full bg-[#e02424] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-red-400 tracking-tight mt-0.5">AI Help</span>
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
              <span className="absolute -top-1.5 -right-2 px-1.5 min-w-[16px] h-4 rounded-full bg-[#e02424] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Cart</span>
        </button>

        {/* Customer Orders & Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition ${
            currentView === 'profile' ? 'text-[#e02424]' : 'text-neutral-400 hover:text-white'
          }`}
          aria-label="My Orders"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Orders</span>
        </button>
      </div>
    </nav>
  );
};
