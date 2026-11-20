import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { TechNovaNavbar } from './components/TechNovaNavbar';
import { TechNovaHero } from './components/TechNovaHero';
import { TechNovaCategories } from './components/TechNovaCategories';
import { TechNovaProductCard } from './components/TechNovaProductCard';
import { TechNovaFooter } from './components/TechNovaFooter';
import { MobileFilterDrawer } from './components/MobileFilterDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { SmartSearchModal } from './components/SmartSearchModal';
import { AIFashionStylist } from './components/AIFashionStylist';
import { CustomerDashboard } from './components/CustomerDashboard';

// Admin Components (Only accessible via domain/admin)
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminOverviewKPIs } from './components/admin/AdminOverviewKPIs';
import { AdminAnalysisSales } from './components/admin/AdminAnalysisSales';
import { AdminProductsManagement } from './components/admin/AdminProductsManagement';
import { AdminCategoriesManagement } from './components/admin/AdminCategoriesManagement';
import { AdminOrdersManagement } from './components/admin/AdminOrdersManagement';
import { AdminVouchersManagement } from './components/admin/AdminVouchersManagement';
import { AdminStoreControls } from './components/admin/AdminStoreControls';

import { Product, ProductColor, CartItem, FilterState, Order, StoreSettings } from './types';
import {
  Sparkles,
  ChevronRight,
  ArrowUpDown,
  Volume2,
  X,
  Truck,
  ShieldCheck,
  RefreshCw,
  Banknote
} from 'lucide-react';

function isAdminPath() {
  const path = window.location.pathname.toLowerCase();
  return path === '/admin' || path.startsWith('/admin/');
}

function MainApp() {
  // Navigation State: 'store' | 'profile' | 'admin'
  // Admin is strictly routed from domain/admin
  const [currentView, setCurrentView] = useState<'store' | 'profile' | 'admin'>(() => {
    if (isAdminPath()) {
      return 'admin';
    }
    if (window.location.pathname.toLowerCase().startsWith('/profile')) {
      return 'profile';
    }
    return 'store';
  });

  // Admin Tab
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Products and Filtering
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    subCategory: '',
    minPrice: 0,
    maxPrice: 150000,
    size: '',
    color: '',
    fabric: '',
    inStockOnly: false,
    sortBy: 'featured'
  });

  // Store Settings (Announcement Bar, etc.)
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync browser URL bar with state
  useEffect(() => {
    const handleUrlChange = () => {
      if (isAdminPath()) {
        setCurrentView('admin');
      } else if (window.location.pathname.toLowerCase().startsWith('/profile')) {
        setCurrentView('profile');
      } else {
        setCurrentView('store');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const navigateTo = (view: 'store' | 'profile', categoryFilter?: string) => {
    setCurrentView(view);
    if (view === 'profile') {
      window.history.pushState({}, '', '/profile');
    } else {
      window.history.pushState({}, '', '/');
    }

    if (categoryFilter) {
      setFilters(prev => ({ ...prev, category: categoryFilter }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1-Click Direct Buy Handler
  const handleDirectBuy = (
    product: Product,
    size?: string,
    color?: ProductColor,
    quantity = 1
  ) => {
    const defaultSize = size || product.sizes.find(s => s.stock > 0)?.size || product.sizes[0]?.size || 'Standard';
    const defaultColor = color || product.colors[0] || { name: 'Standard', hex: '#000000' };
    setSelectedProduct(null);
    setDirectBuyItem({
      product,
      selectedSize: defaultSize,
      selectedColor: defaultColor,
      quantity
    });
    setIsCheckoutOpen(true);
  };

  // Fetch store products from Express backend
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch store settings
  const fetchStoreSettings = async () => {
    try {
      const res = await fetch('/api/store-settings');
      if (res.ok) {
        const data = await res.json();
        setStoreSettings(data);
        if (data.metaTitle) {
          document.title = data.metaTitle;
        }
      }
    } catch (err) {
      console.error('Failed to load store settings:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStoreSettings();
  }, []);

  // Filter & sort products
  const filteredProducts = products
    .filter((p) => {
      if (filters.category !== 'All' && p.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
      const itemPrice = p.salePrice ?? p.price;
      if (itemPrice > filters.maxPrice || itemPrice < filters.minPrice) {
        return false;
      }
      if (filters.inStockOnly) {
        const inStock = p.sizes.some(s => s.stock > 0);
        if (!inStock) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (filters.sortBy === 'price-low') return priceA - priceB;
      if (filters.sortBy === 'price-high') return priceB - priceA;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  // Admin Panel View (Strictly accessible via domain/admin)
  if (currentView === 'admin') {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onExitAdmin={() => navigateTo('store')}
      >
        {adminTab === 'overview' && (
          <AdminOverviewKPIs
            onViewOrderInvoice={setActiveInvoiceOrder}
            onNavigateTab={setAdminTab}
          />
        )}
        {adminTab === 'analysis' && <AdminAnalysisSales />}
        {adminTab === 'products' && <AdminProductsManagement />}
        {adminTab === 'categories' && <AdminCategoriesManagement />}
        {adminTab === 'orders' && (
          <AdminOrdersManagement onViewInvoice={setActiveInvoiceOrder} />
        )}
        {adminTab === 'vouchers' && <AdminVouchersManagement />}
        {adminTab === 'settings' && <AdminStoreControls />}

        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      </AdminLayout>
    );
  }

  // Client Storefront View
  const showAnnouncement = Boolean(
    (storeSettings?.announcementEnabled || storeSettings?.isAnnouncementActive) &&
      storeSettings?.announcementText &&
      !isAnnouncementDismissed
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 flex flex-col font-sans selection:bg-red-500 selection:text-white pb-20 lg:pb-0">
      {/* Slim Dismissible Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-[#b91c1c] via-[#e02424] to-[#b91c1c] text-white text-xs py-2 px-4 relative z-50 flex items-center justify-between">
          <div className="flex-1 text-center font-semibold tracking-wide flex items-center justify-center gap-2">
            <Volume2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{storeSettings?.announcementText}</span>
          </div>
          <button
            onClick={() => setIsAnnouncementDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded transition cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Storefront Navbar (No Admin links) */}
      <TechNovaNavbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenStylist={() => setIsStylistOpen(true)}
        onOpenProfile={() => navigateTo('profile')}
        currentView={currentView}
        onNavigate={(view, cat) => navigateTo(view, cat)}
        onSearchSubmit={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {currentView === 'profile' ? (
          <CustomerDashboard
            onViewInvoice={setActiveInvoiceOrder}
            onExploreMore={() => navigateTo('store')}
          />
        ) : (
          <main className="space-y-6 sm:space-y-8">
            {/* Hero Banner */}
            <TechNovaHero
              onShopNow={() => {
                const el = document.getElementById('featured-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 4-Pillar Trust & Delivery Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-[#e02424] flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">Same-Day Dhaka</p>
                    <p className="text-[11px] text-neutral-500 truncate">Fast doorstep courier</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">Cash on Delivery</p>
                    <p className="text-[11px] text-neutral-500 truncate">Pay after checking</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">7-Day Replacement</p>
                    <p className="text-[11px] text-neutral-500 truncate">Hassle-free exchange</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">100% Authentic</p>
                    <p className="text-[11px] text-neutral-500 truncate">Official brand warranty</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Shop by Category Strip */}
            <TechNovaCategories
              selectedCategory={filters.category}
              onSelectCategory={(cat) => setFilters(prev => ({ ...prev, category: cat }))}
            />

            {/* Featured & Curated Products Grid */}
            <section id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                    {filters.category === 'All'
                      ? 'Featured Gadgets & Collections'
                      : `${filters.category} (${filteredProducts.length})`}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Add to cart or use Buy Now for 1-click express checkout
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-600 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="bg-transparent focus:outline-none text-neutral-800 font-medium cursor-pointer"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest Arrivals</option>
                    </select>
                  </div>

                  {filters.category !== 'All' && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))}
                      className="text-xs sm:text-sm font-semibold text-[#e02424] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="py-24 text-center text-neutral-400 text-xs">
                  Loading products catalog...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center space-y-4 bg-white rounded-xl border border-neutral-200 p-8 shadow-xs">
                  <p className="text-base font-semibold text-neutral-800">
                    No products found in "{filters.category}"
                  </p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try clearing your category filter to browse our full catalog of smartphones, laptops, earbuds, smartwatches, and appliances.
                  </p>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))}
                    className="px-5 py-2.5 rounded-lg bg-[#e02424] text-white text-xs font-bold shadow-xs hover:bg-[#c81e1e] transition cursor-pointer"
                  >
                    Show All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {filteredProducts.map((prod) => (
                    <TechNovaProductCard
                      key={prod.id}
                      product={prod}
                      onOpenDetails={setSelectedProduct}
                      onDirectBuy={(p) => handleDirectBuy(p)}
                    />
                  ))}
                </div>
              )}
            </section>
          </main>
        )}
      </div>

      {/* Floating AI Assistant Trigger (Desktop) */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40">
        {!isStylistOpen && (
          <button
            onClick={() => setIsStylistOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0b0f19] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-2xl transition transform hover:scale-105 min-h-[48px] border border-neutral-700 cursor-pointer"
            title="Ask AI Gadget Expert"
          >
            <div className="w-6 h-6 rounded-full bg-[#e02424] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span>TechNova AI</span>
          </button>
        )}
      </div>

      {/* Mobile Bottom Navigation Dock (No Admin link) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(view, cat) => navigateTo(view, cat)}
        onOpenStylist={() => setIsStylistOpen(true)}
        onOpenFilterSheet={() => setIsMobileFilterOpen(true)}
      />

      {/* Mobile Filter Sheet Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onChange={(upd) => setFilters(prev => ({ ...prev, ...upd }))}
        onReset={() =>
          setFilters({
            category: 'All',
            subCategory: '',
            minPrice: 0,
            maxPrice: 150000,
            size: '',
            color: '',
            fabric: '',
            inStockOnly: false,
            sortBy: 'featured'
          })
        }
        totalProductsCount={filteredProducts.length}
      />

      {/* Interactive Modals */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={setSelectedProduct}
        onDirectBuy={handleDirectBuy}
      />

      <CartDrawer
        onProceedToCheckout={() => {
          setDirectBuyItem(null);
          setIsCheckoutOpen(true);
        }}
        onExploreMore={() => navigateTo('store')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        directBuyItem={directBuyItem}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectBuyItem(null);
        }}
        onViewOrderInvoice={(ord) => {
          setIsCheckoutOpen(false);
          setDirectBuyItem(null);
          setActiveInvoiceOrder(ord);
        }}
      />

      <InvoiceModal
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />

      <SmartSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={setSelectedProduct}
      />

      <AIFashionStylist
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        onOpenProduct={(p) => {
          setSelectedProduct(p);
        }}
      />

      {/* Footer (No Admin link) */}
      <TechNovaFooter
        onNavigate={(view, cat) => navigateTo(view, cat)}
        onOpenProfile={() => navigateTo('profile')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
