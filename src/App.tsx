import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
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

// Admin Components (All 7 Tabs)
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminOverviewKPIs } from './components/admin/AdminOverviewKPIs';
import { AdminAnalysisSales } from './components/admin/AdminAnalysisSales';
import { AdminProductsManagement } from './components/admin/AdminProductsManagement';
import { AdminCategoriesManagement } from './components/admin/AdminCategoriesManagement';
import { AdminOrdersManagement } from './components/admin/AdminOrdersManagement';
import { AdminVouchersManagement } from './components/admin/AdminVouchersManagement';
import { AdminStoreControls } from './components/admin/AdminStoreControls';

import { Product, FilterState, Order, StoreSettings } from './types';
import { Sparkles, ChevronRight, SlidersHorizontal, ArrowUpDown, Volume2, X } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const { setIsCartOpen } = useCart();

  // Navigation State: 'store' | 'profile' | 'admin'
  const [currentView, setCurrentView] = useState<'store' | 'profile' | 'admin'>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path.includes('admin') || hash.includes('admin') || search.includes('admin')) {
      return 'admin';
    }
    if (path.includes('profile') || hash.includes('profile')) {
      return 'profile';
    }
    return 'store';
  });

  // Admin Tab: 'overview' | 'analysis' | 'products' | 'categories' | 'orders' | 'vouchers' | 'settings'
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Products and Filtering
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    subCategory: '',
    minPrice: 0,
    maxPrice: 50000,
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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync browser URL bar with state (e.g. /admin, /#admin, etc.)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('admin') || hash.includes('admin') || search.includes('admin')) {
        setCurrentView('admin');
      } else if (path.includes('profile') || hash.includes('profile')) {
        setCurrentView('profile');
      } else {
        setCurrentView('store');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (view: 'store' | 'profile' | 'admin', categoryFilter?: string) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (view === 'profile') {
      window.history.pushState({}, '', '/profile');
    } else {
      window.history.pushState({}, '', '/');
    }

    if (categoryFilter) {
      setFilters(prev => ({ ...prev, category: categoryFilter }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Fetch store settings (storeName, announcementText, etc.)
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

  // If in Admin Panel View
  if (currentView === 'admin') {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onExitAdmin={() => navigateTo('store')}
      >
        {/* Tab 1: Overview & KPIs */}
        {adminTab === 'overview' && (
          <AdminOverviewKPIs
            onViewOrderInvoice={setActiveInvoiceOrder}
            onNavigateTab={setAdminTab}
          />
        )}

        {/* Tab 2: Analysis & Sales */}
        {adminTab === 'analysis' && <AdminAnalysisSales />}

        {/* Tab 3: Products Management */}
        {adminTab === 'products' && <AdminProductsManagement />}

        {/* Tab 4: Categories Management */}
        {adminTab === 'categories' && <AdminCategoriesManagement />}

        {/* Tab 5: Orders & Courier Fulfillment */}
        {adminTab === 'orders' && (
          <AdminOrdersManagement onViewInvoice={setActiveInvoiceOrder} />
        )}

        {/* Tab 6: Vouchers & Coupons */}
        {adminTab === 'vouchers' && <AdminVouchersManagement />}

        {/* Tab 7: Store Controls */}
        {adminTab === 'settings' && <AdminStoreControls />}

        {/* Global Invoice Modal */}
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      </AdminLayout>
    );
  }

  // Client Storefront View
  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 flex flex-col font-sans selection:bg-red-500 selection:text-white pb-20 lg:pb-0">
      {/* Top Announcement Notice Bar (if enabled in Store Controls) */}
      {storeSettings?.isAnnouncementActive && !isAnnouncementDismissed && (
        <div className="bg-gradient-to-r from-[#b91c1c] via-[#e02424] to-[#b91c1c] text-white text-xs py-2 px-4 shadow-xs relative z-50 flex items-center justify-between">
          <div className="flex-1 text-center font-bold tracking-wide flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{storeSettings.announcementText}</span>
          </div>
          <button
            onClick={() => setIsAnnouncementDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded transition"
            title="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
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
          <main className="space-y-6 sm:space-y-10">
            {/* Hero Banner matching screenshot */}
            <TechNovaHero onShopNow={() => {
              const el = document.getElementById('featured-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }} />

            {/* Categories 7-icon Strip matching screenshot */}
            <TechNovaCategories
              selectedCategory={filters.category}
              onSelectCategory={(cat) => setFilters(prev => ({ ...prev, category: cat }))}
            />

            {/* Featured Products Section matching screenshot */}
            <section id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
              {/* Header: Featured Products on Left, View All > on Right */}
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                    {filters.category === 'All' ? 'Featured Products' : `${filters.category} (${filteredProducts.length})`}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sorting dropdown for desktop/mobile */}
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

                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))}
                    className="text-xs sm:text-sm font-semibold text-[#e02424] hover:underline flex items-center gap-0.5"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Products Grid: 4 columns on desktop, 2 columns on mobile */}
              {isLoadingProducts ? (
                <div className="py-24 text-center text-neutral-400 text-xs">
                  Loading electronics catalog...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center space-y-4 bg-white rounded-xl border border-neutral-200 p-8 shadow-xs">
                  <p className="text-base font-semibold text-neutral-800">
                    No gadgets match "{filters.category}" category
                  </p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try clearing category filters to view our full collection of massagers, trimmers, kettles, and electronics.
                  </p>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))}
                    className="px-5 py-2.5 rounded-lg bg-[#e02424] text-white text-xs font-bold shadow-xs hover:bg-[#c81e1e] transition cursor-pointer"
                  >
                    Show All Featured Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {filteredProducts.map((prod) => (
                    <TechNovaProductCard
                      key={prod.id}
                      product={prod}
                      onOpenDetails={setSelectedProduct}
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
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0b0f19] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-2xl transition transform hover:scale-105 group min-h-[48px] border border-neutral-700"
            title="Ask AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-[#e02424] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span>TechNova AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        )}
      </div>

      {/* Mobile Bottom Navigation Dock */}
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
        onReset={() => setFilters({
          category: 'All',
          subCategory: '',
          minPrice: 0,
          maxPrice: 50000,
          size: '',
          color: '',
          fabric: '',
          inStockOnly: false,
          sortBy: 'featured'
        })}
        totalProductsCount={filteredProducts.length}
      />

      {/* Interactive Modals */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={setSelectedProduct}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreMore={() => navigateTo('store')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onViewOrderInvoice={(ord) => {
          setIsCheckoutOpen(false);
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

      {/* TechNova Footer matching screenshot */}
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
