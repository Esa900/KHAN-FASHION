import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Phone,
  MessageCircle,
  Printer,
  Trash2,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  Calendar,
  DollarSign,
  Send,
  Save,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersManagementProps {
  onViewInvoice: (order: Order) => void;
}

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; icon: any }> = {
  Pending: { label: 'পেন্ডিং', bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  Confirmed: { label: 'কনফার্মড', bg: 'bg-sky-50', text: 'text-sky-700', icon: CheckCircle2 },
  Processing: { label: 'প্রসেসিং', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: Package },
  Shipped: { label: 'শিপড (কুরিয়ারে)', bg: 'bg-purple-50', text: 'text-purple-700', icon: Truck },
  'Out for Delivery': { label: 'ডেলিভারিতে আছে', bg: 'bg-blue-50', text: 'text-blue-700', icon: Truck },
  Delivered: { label: 'ডেলিভারড (আদায় সম্পন্ন)', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  Cancelled: { label: 'বাতিল', bg: 'bg-rose-50', text: 'text-rose-700', icon: AlertCircle }
};

const COURIER_OPTIONS = [
  'Steadfast Courier',
  'Pathao Courier',
  'RedX Delivery',
  'Sundarban Courier',
  'eCourier',
  'Paperfly'
];

export const AdminOrdersManagement: React.FC<AdminOrdersManagementProps> = ({ onViewInvoice }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Editing courier consignment
  const [editingCourierId, setEditingCourierId] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<string>('Steadfast Courier');
  const [trackingId, setTrackingId] = useState<string>('');

  // Delete modal
  const [deleteTargetOrder, setDeleteTargetOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setFeedback({ type: 'success', message: `অর্ডার স্ট্যাটাস সফলভাবে "${newStatus}" করা হয়েছে!` });
      }
    } catch {
      setFeedback({ type: 'error', message: 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে' });
    }
  };

  const handleSaveCourier = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/courier`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courierService: selectedCourier,
          courierTrackingId: trackingId.trim()
        })
      });

      if (res.ok) {
        setOrders(prev =>
          prev.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  courierService: selectedCourier,
                  courierTrackingId: trackingId.trim(),
                  status: o.status === 'Pending' ? 'Shipped' : o.status
                }
              : o
          )
        );
        setEditingCourierId(null);
        setFeedback({ type: 'success', message: 'কুরিয়ার ও কনসাইনমেন্ট আইডি সেভ করা হয়েছে!' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'কুরিয়ার তথ্য সেভ করতে সমস্যা হয়েছে' });
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteTargetOrder) return;
    try {
      const res = await fetch(`/api/orders/${deleteTargetOrder.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== deleteTargetOrder.id));
        setDeleteTargetOrder(null);
        setFeedback({ type: 'success', message: 'অর্ডার মুছে ফেলা হয়েছে' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'অর্ডার ডিলিট ব্যর্থ হয়েছে' });
    }
  };

  // WhatsApp template format
  const getWhatsAppLink = (order: Order) => {
    let rawPhone = order.shippingAddress.phone.replace(/[^0-9]/g, '');
    if (rawPhone.startsWith('0')) {
      rawPhone = '880' + rawPhone.slice(1);
    } else if (!rawPhone.startsWith('880')) {
      rawPhone = '880' + rawPhone;
    }

    const itemsSummary = order.items.map(i => `${i.productTitle} (${i.quantity}টি)`).join(', ');
    const msg = `আসসালামু আলাইকুম ${order.shippingAddress.fullName}, KHAN FASHION থেকে আপনার অর্ডার #${order.orderNumber} কনফার্ম করার জন্য মেসেজ দেওয়া হয়েছে।\n\nঅর্ডারকৃত পণ্য: ${itemsSummary}\nমোট টাকা: ৳${order.totalAmount}\nপেমেন্ট পদ্ধতি: ${order.paymentMethod}\nঠিকানা: ${order.shippingAddress.address}, ${order.shippingAddress.city}\n\nআপনার অর্ডারটি সঠিক থাকলে দয়া করে রিপ্লাই দিন। ধন্যবাদ!`;

    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(msg)}`;
  };

  const filteredOrders = orders.filter(o => {
    const st = (o.status || o.orderStatus || 'Pending') as string;
    if (selectedStatus !== 'All' && st !== selectedStatus) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.shippingAddress.fullName.toLowerCase().includes(q);
      const matchPhone = o.shippingAddress.phone.includes(q);
      const city = o.shippingAddress.city || o.shippingAddress.district || '';
      const matchCity = city.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone || matchCity;
    }
    return true;
  });

  const statusCounts = orders.reduce((acc, o) => {
    const st = (o.status || o.orderStatus || 'Pending') as string;
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Orders &amp; Courier Fulfillment</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-[#e02424] font-bold">
              {orders.length} Total Orders
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            অর্ডার স্ট্যাটাস পরিবর্তন, কুরিয়ার কনসাইনমেন্ট ট্র্যাকিং, ১-ক্লিক কল এবং হোয়াটসঅ্যাপ কনফার্মেশন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-neutral-400 hover:text-neutral-600">
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs matching order pipeline */}
      <div className="bg-white p-2 rounded-xl border border-neutral-200 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setSelectedStatus('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedStatus === 'All'
                ? 'bg-[#e02424] text-white shadow-2xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <span>সব অর্ডার ({orders.length})</span>
          </button>

          {(
            [
              'Pending',
              'Confirmed',
              'Processing',
              'Shipped',
              'Out for Delivery',
              'Delivered',
              'Cancelled'
            ] as OrderStatus[]
          ).map(st => {
            const count = statusCounts[st] || 0;
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{ORDER_STATUS_CONFIG[st].label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs flex items-center gap-2">
        <Search className="w-4 h-4 text-neutral-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="অর্ডার নম্বর, কাস্টমারের নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন..."
          className="w-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="p-1 text-neutral-400 hover:text-neutral-600">
            &times;
          </button>
        )}
      </div>

      {/* Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const currentStatus = (order.status || order.orderStatus || 'Pending') as OrderStatus;
          const cfg = ORDER_STATUS_CONFIG[currentStatus] || ORDER_STATUS_CONFIG['Pending'];
          const StatusIcon = cfg.icon;
          const isCourierOpen = editingCourierId === order.id;

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden hover:shadow-xs transition"
            >
              {/* Order Header Strip */}
              <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-neutral-900">
                    #{order.orderNumber}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.text} border-current/20`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{cfg.label}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    {new Date(order.createdAt).toLocaleString('bn-BD', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs font-bold bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#e02424] cursor-pointer shadow-2xs"
                  >
                    <option value="Pending">পেন্ডিং (Pending)</option>
                    <option value="Confirmed">কনফার্মড (Confirmed)</option>
                    <option value="Processing">প্রসেসিং (Processing)</option>
                    <option value="Shipped">শিপড (Shipped)</option>
                    <option value="Out for Delivery">ডেলিভারিতে আছে (Out for Delivery)</option>
                    <option value="Delivered">ডেলিভারড (Delivered)</option>
                    <option value="Cancelled">বাতিল (Cancelled)</option>
                  </select>

                  {/* Print Invoice Button */}
                  <button
                    onClick={() => onViewInvoice(order)}
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                    title="প্রিন্ট চালান / ইনভয়েস"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeleteTargetOrder(order)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                    title="অর্ডার মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Body Details */}
              <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Col 1: Customer & Communication */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      গ্রাহকের বিবরণ
                    </span>
                    <h4 className="font-bold text-sm text-neutral-900 mt-0.5">
                      {order.shippingAddress.fullName}
                    </h4>
                    <p className="text-xs text-neutral-600 font-mono mt-0.5">
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                    </p>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${order.shippingAddress.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition border border-blue-200"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>ডাইরেক্ট কল</span>
                    </a>

                    <a
                      href={getWhatsAppLink(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp কনফার্ম</span>
                    </a>
                  </div>
                </div>

                {/* Col 2: Ordered Items */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    অর্ডারকৃত পণ্যসমূহ ({order.items.reduce((sum, i) => sum + i.quantity, 0)} টি)
                  </span>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg border border-neutral-100 text-xs"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-10 h-10 object-contain rounded bg-white border border-neutral-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-neutral-800 truncate">
                            {item.productTitle}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-0.5">
                            <span>সাইজ: {item.size}</span>
                            <span>•</span>
                            <span>রং: {item.color}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-neutral-900">
                            ৳{item.price * item.quantity}
                          </span>
                          <p className="text-[10px] text-neutral-500">
                            ৳{item.price} &times; {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-600">পেমেন্ট ({order.paymentMethod}):</span>
                    <span className="text-base text-[#e02424]">৳{order.totalAmount}</span>
                  </div>
                </div>

                {/* Col 3: Courier Assignment */}
                <div className="space-y-3 bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-neutral-600" />
                      <span>কুরিয়ার অ্যাসাইনমেন্ট</span>
                    </span>
                    {!isCourierOpen && (
                      <button
                        onClick={() => {
                          setEditingCourierId(order.id);
                          setSelectedCourier(order.courierService || 'Steadfast Courier');
                          setTrackingId(order.courierTrackingId || '');
                        }}
                        className="text-[11px] font-bold text-[#e02424] hover:underline"
                      >
                        {order.courierTrackingId ? 'সম্পাদনা' : '+ কুরিয়ার যুক্ত করুন'}
                      </button>
                    )}
                  </div>

                  {isCourierOpen ? (
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">
                          কুরিয়ার কোম্পানি:
                        </label>
                        <select
                          value={selectedCourier}
                          onChange={(e) => setSelectedCourier(e.target.value)}
                          className="w-full text-xs bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#e02424]"
                        >
                          {COURIER_OPTIONS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">
                          কনসাইনমেন্ট / ট্র্যাকিং আইডি:
                        </label>
                        <input
                          type="text"
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                          placeholder="যেমন: STF-982312"
                          className="w-full text-xs bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#e02424]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-1">
                        <button
                          onClick={() => setEditingCourierId(null)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-neutral-600 hover:bg-neutral-200 rounded"
                        >
                          বাতিল
                        </button>
                        <button
                          onClick={() => handleSaveCourier(order.id)}
                          className="px-3 py-1 text-[11px] font-bold bg-[#e02424] hover:bg-[#c81e1e] text-white rounded flex items-center gap-1 shadow-2xs"
                        >
                          <Save className="w-3 h-3" />
                          <span>সেভ করুন</span>
                        </button>
                      </div>
                    </div>
                  ) : order.courierService || order.courierTrackingId ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">কুরিয়ার:</span>
                        <span className="font-bold text-neutral-900">{order.courierService || 'Not Set'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">ট্র্যাকিং আইডি:</span>
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {order.courierTrackingId || 'N/A'}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        কাস্টমার ট্র্যাকিং আইডি দিয়ে কুরিয়ার ওয়েবসাইটে পার্সেল ট্র্যাক করতে পারবে।
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-3 text-neutral-400 text-xs">
                      কুরিয়ার ও কনসাইনমেন্ট এখনও সেট করা হয়নি
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-neutral-200 p-6">
            <p className="text-sm font-semibold text-neutral-700">কোনো অর্ডার পাওয়া যায়নি</p>
            <p className="text-xs text-neutral-400 mt-1">
              স্ট্যাটাস ফিল্টার পরিবর্তন করুন অথবা কাস্টমার ইনফো দিয়ে পুনরায় অনুসন্ধান করুন।
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">অর্ডার মুছে ফেলতে চান?</h3>
                <p className="text-xs text-neutral-500 mt-0.5 font-mono">
                  #{deleteTargetOrder.orderNumber}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              এই অর্ডারটি স্থায়ীভাবে ডাটাবেজ থেকে মুছে ফেলা হবে। আপনি কি নিশ্চিত?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                বাতিল
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
