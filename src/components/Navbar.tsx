import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, Heart, User, ShieldCheck, LogOut, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenStylist: () => void;
  onOpenProfile: () => void;
  currentView: string;
  onNavigate: (view: string, categoryFilter?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenStylist,
  onOpenProfile,
  currentView,
  onNavigate
}) => {
  const { user, logout, quickSwitchAccount } = useAuth();
  const { itemCount, setIsCartOpen, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const categories = [
    { name: 'Panjabi', sub: 'Festive & Royal', tag: 'Eid Drop' },
    { name: 'Saree', sub: 'Jamdani & Katan Silk', tag: 'Heirloom' },
    { name: 'Western', sub: 'Linen Shirts & Chinos', tag: 'Contemporary' },
    { name: 'Winter', sub: 'Cashmere Coats & Jackets', tag: 'Limited' },
    { name: 'Accessories', sub: 'Pashmina Shawls & Mojari', tag: 'Handcrafted' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-neutral-900 to-amber-950/70 text-amber-200/90 text-xs py-1.5 px-4 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] tracking-wider uppercase font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>EID LUXURY DROP LIVE &bull; FREE NATIONWIDE EXPRESS DELIVERY OVER ৳3,000</span>
          </div>
          <div className="flex items-center gap-4 hidden sm:flex">
            <span className="text-neutral-400">Code: <strong className="text-amber-300">EID2026</strong> (15% OFF)</span>
            <div className="h-3 w-px bg-neutral-700"></div>
            {/* Quick Demo Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Demo Role:</span>
              <button
                onClick={() => quickSwitchAccount(user?.role === 'admin' ? 'customer' : 'admin')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 transition text-[10px]"
                title="Toggle between Admin & Customer demo session"
              >
                {user?.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <strong>ADMIN MODE</strong> (Click to Switch)
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-blue-400" />
                    <span>CUSTOMER MODE</span> (Switch to Admin)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('store')}>
            <div className="text-left">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-bold text-white uppercase block leading-none">
                A U R A
              </span>
              <span className="text-[9px] tracking-[0.35em] text-amber-400 uppercase font-semibold block mt-1">
                BANGLADESH &bull; ATELIER
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-widest font-medium">
            <button
              onClick={() => onNavigate('store')}
              className={`hover:text-amber-400 transition pb-1 ${
                currentView === 'store' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-neutral-300'
              }`}
            >
              All Drops
            </button>

            {/* Mega menu trigger for Collections */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-neutral-300 hover:text-amber-400 transition py-2"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Mega Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl z-50 grid grid-cols-2 gap-4">
                  {categories.map((c) => (
                    <div
                      key={c.name}
                      onClick={() => {
                        setMegaMenuOpen(false);
                        onNavigate('store', c.name);
                      }}
                      className="group flex flex-col p-3 rounded-lg hover:bg-neutral-800/80 cursor-pointer border border-transparent hover:border-neutral-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition">
                          {c.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
                          {c.tag}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 mt-1">{c.sub}</span>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setMegaMenuOpen(false);
                      onNavigate('store');
                    }}
                    className="col-span-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    <span>Explore entire winter & festive catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('store', 'Panjabi')}
              className="text-neutral-300 hover:text-amber-400 transition"
            >
              Panjabi
            </button>
            <button
              onClick={() => onNavigate('store', 'Saree')}
              className="text-neutral-300 hover:text-amber-400 transition"
            >
              Saree
            </button>
            <button
              onClick={() => onNavigate('store', 'Western')}
              className="text-neutral-300 hover:text-amber-400 transition"
            >
              Western
            </button>
            <button
              onClick={() => onNavigate('store', 'Winter')}
              className="text-neutral-300 hover:text-amber-400 transition"
            >
              Winter
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Smart AI Natural Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-white transition group"
              title="Smart AI Natural Language Search"
            >
              <Search className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition" />
              <span className="hidden md:inline text-xs text-neutral-400 group-hover:text-neutral-200">
                AI Search...
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            </button>

            {/* AI Fashion Stylist button */}
            <button
              onClick={onOpenStylist}
              className="relative p-2 text-neutral-300 hover:text-amber-400 transition group"
              title="Aura AI Fashion Stylist"
            >
              <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-500/20 group-hover:from-amber-500/40 group-hover:to-purple-500/40">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
              </div>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('store')}
              className="relative p-2 text-neutral-300 hover:text-amber-400 transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Slide-over Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-300 hover:text-amber-400 transition"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Admin Menu */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
                title="Account"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-amber-300">
                  {user ? user.name.slice(0, 1).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 text-sm"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-800">
                    <p className="text-white font-medium truncate">{user?.name || 'Guest Customer'}</p>
                    <p className="text-xs text-neutral-400 truncate">{user?.email || 'Not signed in'}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        user?.role === 'admin'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {user?.role === 'admin' ? '🛡️ Admin Role' : 'Customer Account'}
                      </span>
                    </div>
                  </div>

                  {user?.role === 'admin' && (
                    <div className="py-1 border-b border-neutral-800">
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-amber-300 hover:bg-neutral-800 flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Admin Suite Dashboard</span>
                      </button>
                    </div>
                  )}

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2 text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>My Orders &amp; Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        quickSwitchAccount(user?.role === 'admin' ? 'customer' : 'admin');
                      }}
                      className="w-full text-left px-4 py-2 text-amber-400 hover:bg-neutral-800 flex items-center gap-2 text-xs"
                    >
                      <span>Switch to {user?.role === 'admin' ? 'Customer Mode' : 'Admin Mode'}</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-neutral-800">
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-rose-400 hover:bg-neutral-800 flex items-center gap-2 text-xs"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('store');
              }}
              className="p-2.5 rounded bg-neutral-900 text-left text-white hover:text-amber-400"
            >
              All Drops
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('store', 'Panjabi');
              }}
              className="p-2.5 rounded bg-neutral-900 text-left text-white hover:text-amber-400"
            >
              Festive Panjabi
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('store', 'Saree');
              }}
              className="p-2.5 rounded bg-neutral-900 text-left text-white hover:text-amber-400"
            >
              Handloom Sarees
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('store', 'Western');
              }}
              className="p-2.5 rounded bg-neutral-900 text-left text-white hover:text-amber-400"
            >
              Western &amp; Linen
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('store', 'Winter');
              }}
              className="p-2.5 rounded bg-neutral-900 text-left text-white hover:text-amber-400"
            >
              Winter Cashmere
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('store', 'Accessories');
              }}
              className="p-2.5 rounded bg-neutral-900 text-left text-white hover:text-amber-400"
            >
              Accessories &amp; Shawls
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStylist();
              }}
              className="flex items-center gap-1.5 text-amber-400 font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Talk to Aura AI Stylist</span>
            </button>
            {user?.role === 'admin' ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="text-emerald-400 font-medium"
              >
                Go to Admin Suite &rarr;
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('admin/login');
                }}
                className="text-neutral-400 hover:text-white"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
