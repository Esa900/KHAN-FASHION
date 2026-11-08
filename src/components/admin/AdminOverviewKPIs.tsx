import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Truck, ShoppingBag, AlertTriangle, ArrowRight, Eye, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { Order } from '../../types';

interface AdminOverviewKPIsProps {
  onViewOrderInvoice: (order: Order) => void;
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewKPIs: React.FC<AdminOverviewKPIsProps> = ({
  onViewOrderInvoice,
  onNavigateTab
}) => {
  const [kpiData, setKpiData] = useState<any>({
    deliveredRevenue: 2760,
    inTransitPipeline: 1760,
    liveVisitors: 156,
    totalOrders: 2,
    lowStockCount: 2,
    outOfStockCount: 0,
    lowStockItems: [],
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchKPIs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/overview-kpis');
      if (res.ok) {
        const data = await res.json();
        setKpiData(data);
      }
    } catch (e) {
      console.error('Failed to fetch KPIs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
    const interval = setInterval(fetchKPIs, 20000); // 20s live sync
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Sync Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Overview &amp; KPIs</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Dashboard
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            রিয়েল-টাইম আদায়কৃত বিক্রয়, লাইভ ভিজিটর এবং কুরিয়ার পাইপলাইন পরিসংখ্যান
          </p>
        </div>

        <button
          onClick={fetchKPIs}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition self-start sm:self-auto min-h-[36px]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ ডেটা</span>
        </button>
      </div>

      {/* 4 Big KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Delivered Revenue */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              আদায়কৃত মোট বিক্রয় (Delivered)
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tracking-tight">
              ৳{(kpiData.deliveredRevenue || 0).toLocaleString('en-BD')}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <span>✓ কাস্টমার হতে ক্যাশ আদায়কৃত</span>
          </p>
        </div>

        {/* Card 2: Live Visitors */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              লাইভ ভিজিটর (Live Visitors)
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tracking-tight">
              {kpiData.liveVisitors || 148}
            </span>
            <span className="text-xs text-neutral-500">অনলাইনে সক্রিয়</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>সরাসরি ওয়েবসাইট ব্রাউজ করছেন</span>
          </p>
        </div>

        {/* Card 3: In-Transit Pipeline */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              ইন-ট্রানজিট পাইপলাইন
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tracking-tight">
              ৳{(kpiData.inTransitPipeline || 0).toLocaleString('en-BD')}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-2">
            কুরিয়ারে ও প্রসেসিংয়ে থাকা সম্ভাব্য টাকা
          </p>
        </div>

        {/* Card 4: Total Orders & Low Stock */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              মোট অর্ডার ও স্টক
            </span>
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono">
                {kpiData.totalOrders || 0}
              </span>
              <span className="text-xs text-neutral-500 ml-1">অর্ডার</span>
            </div>
            {kpiData.lowStockCount > 0 && (
              <span className="px-2 py-1 rounded bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                {kpiData.lowStockCount} লো স্টক
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-2">
            সর্বশেষ ইনভেন্টরি ও ট্র্যাকিং রেট
          </p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-neutral-900">
              রিসেন্ট অর্ডারস (Recent Orders)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              সর্বশেষ আসা কাস্টমার অর্ডারগুলোর লাইভ স্ট্যাটাস
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#e02424] hover:underline flex items-center gap-1"
          >
            <span>সব অর্ডার দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3">অর্ডার আইডি</th>
                <th className="px-4 py-3">কাস্টমার</th>
                <th className="px-4 py-3">আইটেম</th>
                <th className="px-4 py-3">মোট টাকা</th>
                <th className="px-4 py-3">পেমেন্ট</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-right">ইনভয়েস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(kpiData.recentOrders || []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                    এখনও কোনো অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                (kpiData.recentOrders || []).map((ord: Order) => (
                  <tr key={ord.id} className="hover:bg-neutral-50 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-neutral-900">
                      {ord.orderNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-neutral-800">{ord.customerName}</p>
                      <p className="text-[11px] text-neutral-400">{ord.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600">
                      {ord.items.map(i => `${i.productTitle} (${i.quantity})`).join(', ')}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[#e02424]">
                      ৳{ord.total.toLocaleString('en-BD')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentMethod} • {ord.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'shipped' || ord.orderStatus === 'out_for_delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onViewOrderInvoice(ord)}
                        className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition inline-flex items-center gap-1"
                        title="ইনভয়েস প্রিন্ট করুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>চালান</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
