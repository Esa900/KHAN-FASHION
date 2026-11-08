import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  RefreshCw,
  MapPin,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';

interface AdminOrdersProps {
  onViewInvoice: (order: Order) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onViewInvoice }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Selected Order for Modal View
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const url = selectedStatus === 'all' ? '/api/orders' : `/api/orders?status=${selectedStatus}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus']
  ) => {
    setUpdatingStatus(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus,
          note: `Status updated to ${newStatus} by admin operator`
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setActiveOrder(updated);
        setStatusMessage(`Order updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
        fetchOrders();
      }
    } catch (e) {
      console.error('Status update failed:', e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending_payment', label: 'Pending Payment' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.shippingAddress.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">Order Fulfillment &amp; Invoicing</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track bKash/Nagad transactions, dispatch couriers, and generate tax invoices.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition min-h-[44px]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition min-h-[38px] flex items-center ${
                selectedStatus === tab.id
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Customer, Phone..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 min-h-[40px]"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Mobile Card List (Visible on screens < md) */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-400 text-xs">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-xs">No orders found in this category.</div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-300 text-sm block">{ord.orderNumber}</span>
                  <span className="text-[10px] text-neutral-500">
                    {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ord.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {ord.paymentStatus}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ord.orderStatus === 'delivered'
                      ? 'bg-emerald-950 text-emerald-400'
                      : ord.orderStatus === 'shipped'
                      ? 'bg-blue-950 text-blue-400'
                      : 'bg-amber-950 text-amber-400'
                  }`}>
                    {ord.orderStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1 pt-1 border-t border-neutral-850">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Customer:</span>
                  <span className="text-white font-medium">{ord.customerName} ({ord.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Destination:</span>
                  <span className="text-neutral-200">{ord.shippingAddress.thana}, {ord.shippingAddress.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment:</span>
                  <span className="text-amber-400 font-semibold">{ord.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-neutral-850">
                  <span className="text-white">Amount:</span>
                  <span className="text-white font-mono">৳{ord.total.toLocaleString('en-BD')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
                <button
                  onClick={() => setActiveOrder(ord)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition min-h-[44px]"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Manage Status</span>
                </button>

                <button
                  onClick={() => onViewInvoice(ord)}
                  className="py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1 transition min-h-[44px]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Orders Table (Hidden on screens < md) */}
      <div className="hidden md:block rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-neutral-400 text-xs">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 text-xs">No orders found in this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px] bg-neutral-950/50">
                  <th className="py-3.5 px-4">Order Number</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Gateway</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Total (BDT)</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-850/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                      {ord.orderNumber}
                      <span className="text-[10px] text-neutral-500 block font-normal">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <span className="text-[10px] text-neutral-400">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span>{ord.shippingAddress.thana}, {ord.shippingAddress.district}</span>
                      <span className="text-[10px] text-neutral-400 block">{ord.shippingAddress.division} Div</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-300">{ord.paymentMethod}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-amber-950 text-amber-400'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-950 text-emerald-400'
                          : ord.orderStatus === 'shipped'
                          ? 'bg-blue-950 text-blue-400'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-950 text-rose-400'
                          : 'bg-amber-950 text-amber-400'
                      }`}>
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      ৳{ord.total.toLocaleString('en-BD')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setActiveOrder(ord)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-medium flex items-center gap-1 transition min-h-[36px]"
                          title="Manage Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                        <button
                          onClick={() => onViewInvoice(ord)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-300 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="Print PDF Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Status Changer Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full sm:max-w-2xl bg-neutral-900 border sm:border-neutral-800 sm:rounded-2xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">
                  Order Management
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-mono">{activeOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 text-xs">
              {statusMessage && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Status Update Control */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-400 block">
                  Update Fulfillment &amp; Payment Status
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Fulfillment Status</label>
                    <select
                      value={activeOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus(activeOrder.id, e.target.value as any, activeOrder.paymentStatus)}
                      disabled={updatingStatus}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white font-medium min-h-[40px]"
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="processing">Processing (In Atelier)</option>
                      <option value="shipped">Shipped (In Transit)</option>
                      <option value="delivered">Delivered to Recipient</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Payment Status</label>
                    <select
                      value={activeOrder.paymentStatus}
                      onChange={(e) => handleUpdateStatus(activeOrder.id, activeOrder.orderStatus, e.target.value as any)}
                      disabled={updatingStatus}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white font-medium min-h-[40px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid &bull; Verified</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items in Order */}
              <div className="space-y-3">
                <span className="font-bold uppercase tracking-wider text-[11px] text-neutral-400 block">
                  Garments &amp; Variants ({activeOrder.items.length})
                </span>
                <div className="space-y-2">
                  {activeOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                      <img src={it.productImage} alt="" className="w-12 h-14 object-cover rounded bg-neutral-900 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-white block truncate">{it.productTitle}</span>
                        <span className="text-[10px] text-neutral-400">
                          Size: <strong className="text-white">{it.size}</strong> &bull; Color: <strong className="text-white">{it.color}</strong> &bull; Qty: {it.quantity}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-white">৳{(it.price * it.quantity).toLocaleString('en-BD')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Details */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="font-bold uppercase tracking-wider text-[11px] text-neutral-400 block">
                  Customer &amp; Shipping Destination
                </span>
                <p className="font-semibold text-white">{activeOrder.customerName} &bull; {activeOrder.customerPhone}</p>
                <p className="text-neutral-400 leading-relaxed">
                  {activeOrder.shippingAddress.streetAddress}, {activeOrder.shippingAddress.thana}, {activeOrder.shippingAddress.district}, {activeOrder.shippingAddress.division} Division
                </p>
                {activeOrder.transactionId && (
                  <p className="text-neutral-400 font-mono text-[11px]">
                    Payment Gateway: {activeOrder.paymentMethod} &bull; TrxID: {activeOrder.transactionId}
                  </p>
                )}
              </div>

              {/* Print Invoice Action */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveOrder(null);
                    onViewInvoice(activeOrder);
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 min-h-[44px]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Generate PDF Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveOrder(null)}
                  className="w-full sm:w-auto px-4 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 min-h-[44px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
