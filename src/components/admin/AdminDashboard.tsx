import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminStats, Order } from '../../types';

interface AdminDashboardProps {
  onViewOrderInvoice: (order: Order) => void;
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onViewOrderInvoice,
  onNavigateTab
}) => {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  if (isLoading || !stats) {
    return (
      <div className="py-24 text-center text-neutral-400 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        <p className="text-sm font-semibold">Aggregating store telemetry and sales metrics...</p>
      </div>
    );
  }

  const maxRev = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 100000);
  const categoryEntries = Object.entries(stats.categorySales);
  const totalCategoryRev = categoryEntries.reduce((sum, [_, v]) => sum + v, 0) || 1;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">Executive Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time sales performance, seasonal trends, and inventory health for AURA Bangladesh.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="w-full sm:w-auto px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-1.5 transition min-h-[40px]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards Grid (2-cols on mobile, 4-cols on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Sales */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800/90 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-neutral-400">Total Sales</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-2xl font-bold text-white font-mono block">
              ৳{stats.totalSales.toLocaleString('en-BD')}
            </span>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4%</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800/90">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-neutral-400">Orders</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-2xl font-bold text-white font-mono block">
              {stats.totalOrders}
            </span>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-1">8 BD Divisions</p>
          </div>
        </div>

        {/* Active Customers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800/90">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-neutral-400">Customers</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-2xl font-bold text-white font-mono block">
              {stats.activeCustomers}
            </span>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-1">Active patrons</p>
          </div>
        </div>

        {/* Stock Alerts */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800/90 cursor-pointer hover:border-amber-500/50 transition group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-neutral-400">Stock Alerts</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-lg sm:text-2xl font-bold text-rose-400 font-mono">
              {stats.lowStockCount + stats.outOfStockCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-400 group-hover:underline">
              Fix &rarr;
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-1">
            {stats.outOfStockCount} sold out
          </p>
        </div>
      </div>

      {/* Visual Charts: Monthly Revenue & Best-Selling Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Monthly Revenue Chart Left (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">Monthly Revenue Trends</h3>
              <p className="text-[11px] sm:text-xs text-neutral-400">Seasonal demand leading to Eid and wedding peak</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-amber-400 font-mono">
              FY 25/26
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4 h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-6 border-b border-neutral-800 pb-2">
            {stats.monthlyRevenue.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.revenue / maxRev) * 100));
              const isCurrent = idx === stats.monthlyRevenue.length - 1;

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group relative">
                  <div className="w-full h-32 sm:h-40 flex items-end justify-center">
                    <div
                      className={`w-full max-w-[28px] sm:max-w-[36px] rounded-t-lg transition-all duration-500 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-neutral-800 hover:bg-neutral-700'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 group-hover:text-white">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] sm:text-[11px] text-neutral-500">
            <span>Baseline</span>
            <span>Peak: ৳{maxRev.toLocaleString('en-BD')}</span>
          </div>
        </div>

        {/* Best-Selling Categories Right (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">Category Sales Distribution</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400">Festive Panjabis, Sarees, and Western collections</p>
          </div>

          <div className="space-y-3 pt-2">
            {categoryEntries.map(([category, rev]) => {
              const share = Math.round((rev / totalCategoryRev) * 100);
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-200">{category}</span>
                    <span className="text-neutral-400 font-mono">
                      ৳{rev.toLocaleString('en-BD')} ({share}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                      style={{ width: `${Math.max(5, share)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-4 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">Recent Customer Orders</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400">Live transactions requiring dispatch</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Order Cards (Visible on screens < md) */}
        <div className="md:hidden space-y-2.5">
          {stats.recentOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300 text-xs">{ord.orderNumber}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    ord.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {ord.orderStatus.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white truncate">{ord.customerName}</p>
                <p className="text-[10px] text-neutral-400">{ord.shippingAddress.thana}, {ord.shippingAddress.district}</p>
                <p className="text-xs font-mono font-bold text-neutral-200">৳{ord.total.toLocaleString('en-BD')}</p>
              </div>

              <button
                onClick={() => onViewOrderInvoice(ord)}
                className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white min-h-[40px] min-w-[40px] flex items-center justify-center flex-shrink-0"
                title="View Invoice"
              >
                <Eye className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Data Table (Hidden on screens < md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
              {stats.recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-850/40">
                  <td className="py-3 px-3 font-mono font-bold text-amber-300">{ord.orderNumber}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{ord.customerName}</div>
                    <span className="text-[10px] text-neutral-500">{ord.customerPhone}</span>
                  </td>
                  <td className="py-3 px-3">
                    {ord.shippingAddress.thana}, {ord.shippingAddress.district}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ord.orderStatus === 'delivered'
                        ? 'bg-emerald-950 text-emerald-400'
                        : ord.orderStatus === 'shipped'
                        ? 'bg-blue-950 text-blue-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}>
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono">
                    ৳{ord.total.toLocaleString('en-BD')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onViewOrderInvoice(ord)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="View Invoice"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
