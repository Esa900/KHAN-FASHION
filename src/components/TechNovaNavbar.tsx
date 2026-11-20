import React, { useState } from 'react';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  Phone,
  Truck,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Tablet,
  BookOpen,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface TechNovaNavbarProps {
  onOpenSearch: () => void;
  onOpenStylist: () => void;
  onOpenProfile: () => void;
  currentView: string;
  onNavigate: (view: 'store' | 'profile', categoryFilter?: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export const TechNovaNavbar: React.FC<TechNovaNavbarProps> = ({
  onOpenSearch,
  onOpenStylist,
  onOpenProfile,
  onNavigate,
  onSearchSubmit
}) => {
  const { user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [searchInput, setSearchInput] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allCategories = [
    { name: 'Smartphone', icon: Smartphone, count: 'Flagship 5G' },
    { name: 'Laptop', icon: Laptop, count: 'Ultrabooks' },
    { name: 'Earbuds', icon: Headphones, count: 'ANC Audio' },
    { name: 'Smartwatch', icon: Watch, count: 'AMOLED' },
    { name: 'Tablet', icon: Tablet, count: '2K Display' },
    { name: 'Accessories', icon: Layers, count: 'Chargers & Audio' },
    { name: 'Home Appliances', icon: Truck, count: 'Kitchen & Home' },
    { name: 'Personal Care', icon: Sparkles, count: 'Grooming & Spa' },
    { name: 'Books', icon: BookOpen, count: 'Bestsellers' },
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
      {/* 1. Top Utility Bar */}
      <div className="bg-[#0b0f19] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-normal tracking-wide text-[12px]">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-neutral-300" />
            <span className="font-medium">
              Hotline: <a href="tel:01410732067" className="hover:underline font-semibold">01410732067</a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-neutral-200">
              <Truck className="w-3.5 h-3.5 text-red-400" />
              <span>Same-day delivery in Dhaka &bull; Cash on Delivery Nationwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header: Logo, Search Bar, AI Assistant, Cart, Account */}
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

          {/* Brand Wordmark */}
          <div
            onClick={() => onNavigate('store', 'All')}
            className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#e02424] rounded-lg flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-xs">
              T
            </div>
            <div className="flex items-baseline">
              <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-neutral-900 leading-none whitespace-nowrap">
                TechNova
              </span>
              <span className="text-xs sm:text-sm font-medium text-neutral-500 ml-1 leading-none whitespace-nowrap">
                Mart
              </span>
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
                placeholder="Search smartphones, earbuds, trimmers, kettles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onClick={onOpenSearch}
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

          {/* Right Action Icons: AI Assistant, Cart, Account */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <button
              onClick={onOpenStylist}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#e02424] border border-red-200 text-xs font-semibold transition whitespace-nowrap shrink-0 cursor-pointer"
              title="TechNova AI Gadget Expert"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-neutral-800 hover:text-[#e02424] transition py-1 px-1 relative min-h-[44px] cursor-pointer"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-neutral-800" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#e02424] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">Cart</span>
            </button>

            {/* Customer Account Button */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 text-neutral-800 hover:text-[#e02424] transition py-1 px-1 min-h-[44px] cursor-pointer"
                aria-label="User Account"
              >
                <User className="w-6 h-6 text-neutral-800" />
                <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">
                  {user ? user.name.split(' ')[0] : 'Account'}
                </span>
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 text-xs text-neutral-800"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="font-semibold text-neutral-900 truncate">
                      {user ? user.name : 'Welcome to TechNova Mart'}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {user ? user.email : 'Track your orders & delivery'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2 font-medium"
                    >
                      <User className="w-4 h-4 text-neutral-500" />
                      <span>My Orders &amp; Profile</span>
                    </button>
                  </div>

                  {user && (
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
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dark Subnav: Categories Dropdown & Quick Links */}
      <div className="bg-[#0b0f19] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-2.5 bg-[#172033] hover:bg-[#1f293d] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[42px] cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>

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
                      className="w-full px-4 py-2.5 text-left text-xs hover:bg-neutral-100 flex items-center justify-between group transition cursor-pointer"
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

          <div className="hidden lg:flex items-center space-x-6 text-xs text-neutral-300 font-medium">
            <button
              onClick={() => onNavigate('store', 'All')}
              className="hover:text-white transition py-2 text-red-400 font-bold cursor-pointer whitespace-nowrap"
            >
              All Products
            </button>
            <button
              onClick={() => onNavigate('store', 'Smartphone')}
              className="hover:text-white transition py-2 cursor-pointer whitespace-nowrap"
            >
              Smartphones
            </button>
            <button
              onClick={() => onNavigate('store', 'Laptop')}
              className="hover:text-white transition py-2 cursor-pointer whitespace-nowrap"
            >
              Laptops
            </button>
            <button
              onClick={() => onNavigate('store', 'Earbuds')}
              className="hover:text-white transition py-2 cursor-pointer whitespace-nowrap"
            >
              Earbuds &amp; Audio
            </button>
            <button
              onClick={() => onNavigate('store', 'Smartwatch')}
              className="hover:text-white transition py-2 cursor-pointer whitespace-nowrap"
            >
              Smartwatches
            </button>
            <button
              onClick={() => onNavigate('store', 'Home Appliances')}
              className="hover:text-white transition py-2 cursor-pointer whitespace-nowrap"
            >
              Home &amp; Kitchen
            </button>
            <button
              onClick={() => onNavigate('store', 'Personal Care')}
              className="hover:text-white transition py-2 cursor-pointer whitespace-nowrap"
            >
              Personal Care
            </button>
          </div>

          <button
            onClick={onOpenProfile}
            className="hidden sm:flex items-center text-[11px] text-neutral-300 hover:text-white transition py-2 cursor-pointer whitespace-nowrap"
          >
            Track My Order &rarr;
          </button>
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
                onOpenProfile();
              }}
              className="text-neutral-700 font-bold"
            >
              My Orders &rarr;
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
