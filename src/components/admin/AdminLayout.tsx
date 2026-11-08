import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Package,
  Users,
  ExternalLink,
  ShieldCheck,
  LogOut,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminLogin } from './AdminLogin';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'products' | 'orders' | 'inventory' | 'customers';
  onSelectTab: (tab: 'dashboard' | 'products' | 'orders' | 'inventory' | 'customers') => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  children
}) => {
  const { user, logout, quickSwitchAccount } = useAuth();

  // Access Control: Only users with role='admin' can enter. Otherwise show AdminLogin
  if (!user || user.role !== 'admin') {
    return (
      <AdminLogin
        onLoginSuccess={() => onSelectTab('dashboard')}
        onBackToStore={onExitAdmin}
      />
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', fullLabel: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', fullLabel: 'Gadgets & Products', icon: Package },
    { id: 'orders', label: 'Orders', fullLabel: 'Order Fulfillment', icon: ShoppingBag },
    { id: 'inventory', label: 'Stock Alerts', fullLabel: 'Inventory & Stock Alerts', icon: Package },
    { id: 'customers', label: 'Customers', fullLabel: 'Customer Directory', icon: Users }
  ] as const;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col lg:flex-row text-neutral-100 pb-20 lg:pb-0">
      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#e02424] rounded flex items-center justify-center text-white font-black text-xs">
            T
          </div>
          <span className="font-extrabold text-sm tracking-wide text-white uppercase">
            TechNova Mart
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => quickSwitchAccount('customer')}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 text-amber-300 text-[10px] font-semibold border border-neutral-700 transition"
            title="Switch to customer storefront view"
          >
            Customer View
          </button>
          <button
            onClick={onExitAdmin}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="View Live Store"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden lg:flex w-64 bg-neutral-900 border-r border-neutral-800 flex-col justify-between p-4 flex-shrink-0 min-h-screen sticky top-0">
        <div>
          {/* Brand & Role */}
          <div className="p-3 mb-6 bg-neutral-950/80 rounded-xl border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#e02424] rounded-lg flex items-center justify-center text-white font-black text-base shadow-xs">
                T
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  TechNova Mart
                </span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Admin Suite
                </span>
              </div>
            </div>
            <button
              onClick={onExitAdmin}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              title="View Public Store"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/10'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.fullLabel}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-black" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions Bottom */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <div className="px-2">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => quickSwitchAccount('customer')}
              className="w-full text-left px-3 py-2 rounded-lg text-[11px] text-amber-300 hover:bg-neutral-800 flex items-center gap-2 transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch to Customer Mode</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="w-full text-left px-3 py-2 rounded-lg text-[11px] text-neutral-300 hover:bg-neutral-800 flex items-center gap-2 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 rounded-lg text-[11px] text-rose-400 hover:bg-neutral-800 flex items-center gap-2 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-neutral-950">
        {children}
      </main>

      {/* Mobile Bottom Dock for Admin */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-1 shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-5 items-center h-14">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] transition ${
                  isActive ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
