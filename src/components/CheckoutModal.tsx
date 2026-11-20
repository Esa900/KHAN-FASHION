import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, ArrowRight, Printer, AlertCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BD_DIVISIONS_DATA, CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  directBuyItem: CartItem | null;
  onClose: () => void;
  onViewOrderInvoice: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  directBuyItem,
  onClose,
  onViewOrderInvoice
}) => {
  const { cart, subtotal: cartSubtotal, discount: cartDiscount, clearCart } = useCart();
  const { user, token } = useAuth();

  // Direct buy quantity state (allows adjusting qty inside 1-click checkout)
  const [directQty, setDirectQty] = useState(directBuyItem?.quantity || 1);

  // Load saved shipping info for true 1-click repeat ordering
  const getSavedShipping = () => {
    try {
      const saved = localStorage.getItem('technova_last_shipping');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const savedShipping = getSavedShipping();

  // Form State
  const [fullName, setFullName] = useState(savedShipping?.fullName || user?.name || '');
  const [email, setEmail] = useState(savedShipping?.email || user?.email || '');
  const [phone, setPhone] = useState(savedShipping?.phone || user?.phone || '01712-445566');
  const [division, setDivision] = useState(savedShipping?.division || user?.address?.division || 'Dhaka');
  const [district, setDistrict] = useState(savedShipping?.district || user?.address?.district || 'Dhaka');
  const [thana, setThana] = useState(savedShipping?.thana || user?.address?.thana || 'Dhanmondi');
  const [streetAddress, setStreetAddress] = useState(
    savedShipping?.streetAddress || user?.address?.streetAddress || '57/1, Road-7A, Dhanmondi, Dhaka'
  );
  const [postalCode, setPostalCode] = useState(savedShipping?.postalCode || user?.address?.postalCode || '1209');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment State (Default COD for fastest 1-click order in Bangladesh)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'bKash' | 'Nagad' | 'SSLCommerz'>('COD');
  const [trxId, setTrxId] = useState('');

  // Process status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCreatedOrder(null);
      setErrorMsg(null);
      setDirectQty(directBuyItem?.quantity || 1);
    }
  }, [isOpen, directBuyItem]);

  if (!isOpen) return null;

  const isDirectBuy = Boolean(directBuyItem);
  const activeItems: CartItem[] = directBuyItem
    ? [{ ...directBuyItem, quantity: directQty }]
    : cart;

  const subtotal = directBuyItem
    ? (directBuyItem.product.salePrice ?? directBuyItem.product.price) * directQty
    : cartSubtotal;
  const discount = directBuyItem ? 0 : cartDiscount;

  // Calculated dynamic shipping fee based on division
  const isInsideDhaka = division === 'Dhaka';
  const shippingFee = subtotal > 3000 ? 0 : isInsideDhaka ? 80 : 150;
  const calculatedFinalTotal = Math.max(0, subtotal - discount + shippingFee);

  const availableDistricts = Object.keys(BD_DIVISIONS_DATA[division]?.districts || { Dhaka: [] });
  const availableThanas = BD_DIVISIONS_DATA[division]?.districts[district] || ['Main Town / Sadar'];

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const firstDistrict = Object.keys(BD_DIVISIONS_DATA[newDiv]?.districts || {})[0] || '';
    setDistrict(firstDistrict);
    const firstThana = BD_DIVISIONS_DATA[newDiv]?.districts[firstDistrict]?.[0] || 'Sadar';
    setThana(firstThana);
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const firstThana = BD_DIVISIONS_DATA[division]?.districts[newDist]?.[0] || 'Sadar';
    setThana(firstThana);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !streetAddress) {
      setErrorMsg('Please complete all recipient shipping details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const orderPayload = {
      customerName: fullName,
      customerEmail: email || 'guest@technovamartbd.com',
      customerPhone: phone,
      items: activeItems.map(item => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.images[0],
        price: item.product.salePrice ?? item.product.price,
        size: item.selectedSize || 'Standard',
        color: item.selectedColor?.name || 'Default',
        quantity: item.quantity
      })),
      discount,
      shippingFee,
      paymentMethod,
      transactionId:
        trxId ||
        (paymentMethod === 'bKash' || paymentMethod === 'Nagad'
          ? `${paymentMethod === 'bKash' ? 'BK' : 'NG'}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
          : undefined),
      shippingAddress: {
        fullName,
        phone,
        division,
        district,
        thana,
        streetAddress,
        postalCode,
        orderNotes
      }
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Persist shipping address for future 1-click orders
      try {
        localStorage.setItem(
          'technova_last_shipping',
          JSON.stringify({
            fullName,
            email,
            phone,
            division,
            district,
            thana,
            streetAddress,
            postalCode
          })
        );
      } catch {}

      setCreatedOrder(data);
      if (!isDirectBuy) {
        clearCart();
      }

      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full sm:max-w-4xl bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <span className="text-[10px] tracking-widest text-[#e02424] font-bold uppercase flex items-center gap-1">
              {isDirectBuy ? (
                <>
                  <Zap className="w-3 h-3" />
                  <span>1-Click Express Direct Order</span>
                </>
              ) : (
                <span>Secure Checkout</span>
              )}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {createdOrder ? 'Order Confirmed!' : 'Shipping & Payment Confirmation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6">
          {createdOrder ? (
            /* Order Success View */
            <div className="py-6 text-center space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded bg-neutral-800 text-amber-300 text-xs font-mono font-bold border border-neutral-700">
                  {createdOrder.orderNumber}
                </span>
                <h3 className="text-2xl font-bold text-white mt-3">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Your order has been received and our team is preparing it for fast dispatch. Updates will be sent to{' '}
                  <strong className="text-white">{createdOrder.customerPhone}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Recipient:</span>
                  <span className="text-white font-medium">{createdOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Address:</span>
                  <span className="text-white font-medium text-right max-w-[220px] truncate">
                    {createdOrder.shippingAddress.thana}, {createdOrder.shippingAddress.district}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Payment Method:</span>
                  <span className="text-emerald-400 font-bold">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pt-2 border-t border-neutral-800">
                  <span>Total Amount:</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    ৳{createdOrder.total.toLocaleString('en-BD')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onViewOrderInvoice(createdOrder)}
                  className="flex-1 py-3 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Invoice</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#e02424] hover:bg-[#c81e1e] text-white font-semibold text-xs tracking-wider uppercase transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Shipping Address Left (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Express Item Card when in Direct Buy mode */}
                {directBuyItem && (
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                    <img
                      src={directBuyItem.product.images[0]}
                      alt={directBuyItem.product.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-contain rounded-lg bg-white p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase text-[#e02424] block">
                        Express Direct Item
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                        {directBuyItem.product.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {directBuyItem.selectedSize || 'Standard'} &middot;{' '}
                        {directBuyItem.selectedColor?.name || 'Default'}
                      </p>
                    </div>
                    <div className="flex items-center rounded-lg bg-neutral-900 border border-neutral-700 text-xs">
                      <button
                        type="button"
                        onClick={() => setDirectQty(Math.max(1, directQty - 1))}
                        className="px-2.5 py-1 text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 text-white font-bold tabular-nums">{directQty}</span>
                      <button
                        type="button"
                        onClick={() => setDirectQty(directQty + 1)}
                        className="px-2.5 py-1 text-neutral-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <Truck className="w-4 h-4 text-[#e02424]" />
                  <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                    Bangladesh Delivery Address
                  </h3>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e02424]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Mobile Number (+880) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e02424]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Division *</label>
                    <select
                      value={division}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e02424]"
                    >
                      {Object.keys(BD_DIVISIONS_DATA).map((div) => (
                        <option key={div} value={div}>
                          {div} Division
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">District *</label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e02424]"
                    >
                      {availableDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Thana / Upazila *</label>
                    <select
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e02424]"
                    >
                      {availableThanas.map((th) => (
                        <option key={th} value={th}>
                          {th}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 1209"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e02424]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-neutral-400 mb-1">Full Address (House, Road, Area) *</label>
                    <textarea
                      required
                      rows={2}
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. House 57/1, Road 7A, Dhanmondi, Dhaka"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e02424]"
                    />
                  </div>
                </div>

                {/* Delivery ETA */}
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-300">
                    {isInsideDhaka ? 'Inside Dhaka: Same-Day / 24 Hr Delivery' : 'Outside Dhaka: 48 - 72 Hr Courier'}
                  </span>
                  <span className="text-emerald-400 font-semibold tabular-nums">
                    {shippingFee === 0 ? 'FREE' : `৳${shippingFee}`}
                  </span>
                </div>
              </div>

              {/* Payment Methods Right (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <CreditCard className="w-4 h-4 text-[#e02424]" />
                  <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                    Payment Method
                  </h3>
                </div>

                <div className="space-y-2">
                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'COD'
                        ? 'border-[#e02424] bg-red-950/20 ring-1 ring-[#e02424]'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#e02424] text-white font-bold text-[10px] flex items-center justify-center">
                        COD
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Cash on Delivery (COD)</span>
                        <span className="text-[10px] text-neutral-400">Pay cash when parcel arrives</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-[#e02424]"
                    />
                  </label>

                  {/* bKash */}
                  <label
                    onClick={() => setPaymentMethod('bKash')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'bKash'
                        ? 'border-pink-500 bg-pink-950/20 ring-1 ring-pink-500'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-600 text-white font-bold text-xs flex items-center justify-center">
                        bK
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">bKash Mobile Payment</span>
                        <span className="text-[10px] text-neutral-400">Merchant: 01410-732067</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bKash'}
                      onChange={() => setPaymentMethod('bKash')}
                      className="accent-pink-500"
                    />
                  </label>

                  {/* Nagad */}
                  <label
                    onClick={() => setPaymentMethod('Nagad')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'Nagad'
                        ? 'border-orange-500 bg-orange-950/20 ring-1 ring-orange-500'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                        NG
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Nagad Wallet</span>
                        <span className="text-[10px] text-neutral-400">Instant mobile payment</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Nagad'}
                      onChange={() => setPaymentMethod('Nagad')}
                      className="accent-orange-500"
                    />
                  </label>

                  {/* SSLCommerz */}
                  <label
                    onClick={() => setPaymentMethod('SSLCommerz')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'SSLCommerz'
                        ? 'border-blue-500 bg-blue-950/20 ring-1 ring-blue-500'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                        CARD
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Cards / SSLCommerz</span>
                        <span className="text-[10px] text-neutral-400">Visa, Mastercard, Nexus</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'SSLCommerz'}
                      onChange={() => setPaymentMethod('SSLCommerz')}
                      className="accent-blue-500"
                    />
                  </label>
                </div>

                {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                    <p className="text-neutral-400">
                      Send Money to: <strong className="text-white font-mono">01410-732067</strong>
                    </p>
                    <input
                      type="text"
                      placeholder="Transaction ID (optional)"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono"
                    />
                  </div>
                )}

                {/* Order Summary */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs tabular-nums">
                  <div className="flex justify-between text-neutral-400">
                    <span>Items Subtotal ({activeItems.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span>৳{subtotal.toLocaleString('en-BD')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount</span>
                      <span>-৳{discount.toLocaleString('en-BD')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery Fee ({division})</span>
                    <span>{shippingFee === 0 ? 'FREE' : `৳${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                    <span>Total Payable</span>
                    <span className="text-base text-[#ff5a5a]">
                      ৳{calculatedFinalTotal.toLocaleString('en-BD')}
                    </span>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting || activeItems.length === 0}
                  className="w-full py-3.5 rounded-xl bg-[#e02424] hover:bg-[#c81e1e] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order (৳{calculatedFinalTotal.toLocaleString('en-BD')})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <span className="text-[10px] text-neutral-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    100% Authentic Warranty &bull; Easy 7-Day Return
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
