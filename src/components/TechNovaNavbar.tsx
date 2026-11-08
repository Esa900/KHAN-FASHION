import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, ChevronDown, Sparkles, ShieldCheck, LogOut, Phone, Truck, Laptop, Smartphone, Watch, Headphones, Tablet, BookOpen, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface TechNovaNavbarProps {
  onOpenSearch: () => void;
  onOpenStylist: () => void;
  onOpenProfile: () => void;
  currentView: string;
  onNavigate: (view: 'store' | 'profile' | 'admin', categoryFilter?: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export const TechNovaNavbar: React.FC<TechNovaNavbarProps> = ({
  onOpenSearch,
  onOpenStylist,
  onOpenProfile,
  currentView,
  onNavigate,
  onSearchSubmit
}) => {
  const { user, logout, quickSwitchAccount } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [searchInput, setSearchInput] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allCategories = [
    { name: 'Accessories', icon: Layers, count: '35+ items' },
    { name: 'Smartphone', icon: Smartphone, count: '28+ items' },
    { name: 'Laptop', icon: Laptop, count: '14+ items' },
    { name: 'Earbuds', icon: Headphones, count: '22+ items' },
    { name: 'Tablet', icon: Tablet, count: '10+ items' },
    { name: 'Smartwatch', icon: Watch, count: '18+ items' },
    { name: 'Personal Care', icon: Sparkles, count: '16+ items' },
    { name: 'Home Appliances', icon: Truck, count: '25+ items' },
    { name: 'Books', icon: BookOpen, count: '40+ items' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchInput.trim());
      } else {
        onOpenSearch();
      }
    } else {
      onOpenSearch();
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 shadow-xs bg-white">
      {/* 1. Black Top Bar with Hotline & Delivery */}
      <div className="bg-[#0b0f19] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-normal tracking-wide text-[12px]">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-neutral-300" />
            <span className="font-medium">Hotline: <a href="tel:01410732067" className="hover:underline font-semibold">01410732067</a></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-neutral-200">
              <span className="text-sm">🚀</span>
              <span>Same-day delivery in Dhaka!</span>
            </div>

            {/* Quick Demo Mode Badge */}
            <div className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-neutral-700">
              <button
                onClick={() => quickSwitchAccount(user?.role === 'admin' ? 'customer' : 'admin')}
                className="px-2 py-0.5 rounded text-[11px] bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-medium transition flex items-center gap-1"
                title="Toggle between Admin & Customer mode"
              >
                {user?.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Admin Mode Active</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-blue-400" />
                    <span>Customer Mode (Switch to Admin)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main White Header: Logo, Big Search Bar, Cart, Login */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-black min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => onNavigate('store')}
            className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0"
          >
            {/* Red Box with white T */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#e02424] rounded-lg flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-xs">
              T
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-neutral-900 leading-none">
                  TechNova
                </span>
                <span className="text-xs sm:text-sm font-medium text-neutral-500 ml-1 leading-none">
                  Mart
                </span>
              </div>
            </div>
          </div>

          {/* Center Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl mx-2 sm:mx-6 relative"
          >
            <div className="flex items-center w-full rounded-md border border-neutral-300 focus-within:border-neutral-900 overflow-hidden bg-white shadow-2xs transition">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#0b0f19] hover:bg-neutral-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 flex items-center justify-center transition min-h-[38px]"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Action Icons: Cart & Login */}
          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenStylist}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#e02424] border border-red-200 text-xs font-semibold transition"
              title="TechNova AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-neutral-800 hover:text-[#e02424] transition py-1 px-1 relative min-h-[44px]"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-neutral-800" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#e02424] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            </button>

            {/* User / Login Button */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 text-neutral-800 hover:text-[#e02424] transition py-1 px-1 min-h-[44px]"
                aria-label="User Account"
              >
                <User className="w-6 h-6 text-neutral-800" />
                <span className="hidden sm:inline text-xs font-semibold">
                  {user ? user.name.split(' ')[0] : 'Login'}
                </span>
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 text-xs text-neutral-800"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="font-semibold text-neutral-900 truncate">{user ? user.name : 'Welcome to TechNova'}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user ? user.email : 'Log in to track orders'}</p>
                    {user?.role === 'admin' && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        Admin Access
                      </span>
                    )}
                  </div>

                  {user?.role === 'admin' && (
                    <div className="py-1 border-b border-neutral-100">
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-[#e02424] hover:bg-neutral-50 flex items-center gap-2 font-bold"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#e02424]" />
                        <span>Admin Dashboard (/admin)</span>
                      </button>
                    </div>
                  )}

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-neutral-500" />
                      <span>My Orders & Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        quickSwitchAccount(user?.role === 'admin' ? 'customer' : 'admin');
                      }}
                      className="w-full text-left px-4 py-2 text-blue-600 hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <span>Switch to {user?.role === 'admin' ? 'Customer View' : 'Admin View'}</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-neutral-100">
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dark Subnav: Categories Dropdown & Quick Links */}
      <div className="bg-[#0b0f19] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Categories Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-2.5 bg-[#172033] hover:bg-[#1f293d] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[42px]"
            >
              <Menu className="w-4 h-4" />
              <span>Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Categories Dropdown Menu */}
            {categoriesOpen && (
              <div
                className="absolute left-0 top-full w-64 bg-white border border-neutral-200 shadow-2xl rounded-b-lg py-2 z-50 text-neutral-800"
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                {allCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setCategoriesOpen(false);
                        onNavigate('store', cat.name);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs hover:bg-neutral-100 flex items-center justify-between group transition"
                    >
                      <div className="flex items-center gap-2.5 text-neutral-800 group-hover:text-[#e02424] font-medium">
                        <Icon className="w-4 h-4 text-neutral-500 group-hover:text-[#e02424]" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{cat.count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Categories Bar across desktop */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-neutral-300 font-medium">
            <button
              onClick={() => onNavigate('store')}
              className="hover:text-white transition py-2 text-red-400 font-bold"
            >
              All Products
            </button>
            <button
              onClick={() => onNavigate('store', 'Accessories')}
              className="hover:text-white transition py-2"
            >
              Accessories
            </button>
            <button
              onClick={() => onNavigate('store', 'Personal Care')}
              className="hover:text-white transition py-2"
            >
              Massagers & Grooming
            </button>
            <button
              onClick={() => onNavigate('store', 'Home Appliances')}
              className="hover:text-white transition py-2"
            >
              Kitchen & Home
            </button>
            <button
              onClick={() => onNavigate('store', 'Smartphone')}
              className="hover:text-white transition py-2"
            >
              Smartphones
            </button>
            <button
              onClick={() => onNavigate('store', 'Earbuds')}
              className="hover:text-white transition py-2"
            >
              Audio & Speakers
            </button>
          </div>

          {/* Admin shortcut on the right */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => onNavigate('admin')}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1.5 transition py-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-4 space-y-3 shadow-lg">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Browse Categories
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {allCategories.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('store', c.name);
                }}
                className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-left text-neutral-800 hover:border-[#e02424] hover:text-[#e02424] font-medium transition"
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStylist();
              }}
              className="flex items-center gap-1.5 text-[#e02424] font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Gadget Expert</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin');
              }}
              className="text-emerald-700 font-bold"
            >
              Admin Suite &rarr;
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
