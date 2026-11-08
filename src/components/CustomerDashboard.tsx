import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, Printer, MapPin, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

interface CustomerDashboardProps {
  onViewInvoice: (order: Order) => void;
  onExploreMore: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onViewInvoice,
  onExploreMore
}) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
          if (data.length > 0) {
            setSelectedOrder(data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  const getStatusStep = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending_payment':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-xl font-bold text-neutral-950 font-serif">
            {user?.name.slice(0, 1) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-serif">{user?.name || 'Customer Account'}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold uppercase">
                Aura Member
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{user?.email} &bull; {user?.phone || '+880 1711-XXXXXX'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreMore}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider transition"
          >
            Explore Collections
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Orders List Left (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Your Orders ({orders.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-neutral-400 text-xs">
              Loading your purchase history...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 rounded-xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
              <Package className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No orders placed yet</p>
              <p className="text-xs text-neutral-400">
                Explore our festive Panjabi, Handloom Sarees, and Western drops.
              </p>
              <button
                onClick={onExploreMore}
                className="px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-semibold"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-500/80 shadow-lg'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : ord.orderStatus === 'shipped'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400">
                      {ord.items.length} item(s) &bull; ৳{ord.total.toLocaleString('en-BD')} &bull; {ord.paymentMethod}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-amber-400 translate-x-1' : 'text-neutral-600'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Selected Order Details & Live Timeline Right (7 cols) */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-neutral-800 gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">
                    Order Details
                  </span>
                  <h3 className="text-base font-bold text-white font-mono">{selectedOrder.orderNumber}</h3>
                </div>

                <button
                  onClick={() => onViewInvoice(selectedOrder)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Printable Invoice</span>
                </button>
              </div>

              {/* Progress Steps Timeline */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-4">
                  Fulfillment Status Tracker
                </h4>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {['Pending', 'Processing', 'Shipped', 'Delivered'].map((stepName, idx) => {
                    const stepNum = idx + 1;
                    const currentStep = getStatusStep(selectedOrder.orderStatus);
                    const isCompleted = currentStep >= stepNum;
                    const isCurrent = currentStep === stepNum;

                    return (
                      <div key={stepName} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition ${
                          isCompleted
                            ? 'bg-amber-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                        </div>
                        <span className={`text-[11px] font-medium ${isCurrent ? 'text-amber-400 font-bold' : isCompleted ? 'text-white' : 'text-neutral-500'}`}>
                          {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                  Ordered Garments ({selectedOrder.items.length})
                </h4>

                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center gap-3"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-14 h-16 object-cover rounded-lg bg-neutral-900 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-white truncate">{item.productTitle}</h5>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Size: <strong className="text-neutral-200">{item.size}</strong> &bull; Color: <strong className="text-neutral-200">{item.color}</strong> &bull; Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-white">
                        ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-400 uppercase tracking-wider font-bold text-[10px] block">
                    Shipping Destination
                  </span>
                  <p className="font-semibold text-white">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-neutral-400 leading-relaxed">
                    {selectedOrder.shippingAddress.streetAddress}<br />
                    {selectedOrder.shippingAddress.thana}, {selectedOrder.shippingAddress.district}<br />
                    {selectedOrder.shippingAddress.division} Division
                  </p>
                  <p className="text-neutral-400">Phone: {selectedOrder.customerPhone}</p>
                </div>

                <div className="space-y-1 text-right">
                  <span className="text-neutral-400 uppercase tracking-wider font-bold text-[10px] block">
                    Payment Breakdown
                  </span>
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal:</span>
                    <span>৳{selectedOrder.subtotal.toLocaleString('en-BD')}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span>-৳{selectedOrder.discount.toLocaleString('en-BD')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping Fee:</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'FREE' : `৳${selectedOrder.shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1 border-t border-neutral-800">
                    <span>Total Paid ({selectedOrder.paymentMethod}):</span>
                    <span className="text-amber-400">৳{selectedOrder.total.toLocaleString('en-BD')}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-neutral-500 text-xs">
              Select an order from the list to track its real-time journey.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
