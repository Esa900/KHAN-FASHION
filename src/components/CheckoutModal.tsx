import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Smartphone, ArrowRight, Printer, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BD_DIVISIONS_DATA, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrderInvoice: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onViewOrderInvoice
}) => {
  const { cart, subtotal, discount, total, clearCart } = useCart();
  const { user, token } = useAuth();

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '01712-345678');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('Gulshan-2');
  const [streetAddress, setStreetAddress] = useState('House 42, Road 113, Gulshan-2');
  const [postalCode, setPostalCode] = useState('1212');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'COD' | 'SSLCommerz'>('bKash');
  const [bKashNumber, setBKashNumber] = useState('01712-345678');
  const [trxId, setTrxId] = useState('');

  // Process status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculated dynamic shipping fee based on division
  const isInsideDhaka = division === 'Dhaka';
  const shippingFee = subtotal > 3000 ? 0 : (isInsideDhaka ? 80 : 150);
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
      customerEmail: email || 'guest@aura.com.bd',
      customerPhone: phone,
      items: cart.map(item => ({
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
      transactionId: trxId || (paymentMethod === 'bKash' ? `BK${Math.random().toString(36).substring(2, 9).toUpperCase()}` : undefined),
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

      setCreatedOrder(data);
      clearCart();

      // Launch victory confetti
      confetti({
        particleCount: 120,
        spread: 80,
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
            <span className="text-[10px] tracking-widest text-amber-400 font-bold uppercase block">
              Secure Checkout
            </span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-white">
              {createdOrder ? 'Order Confirmed' : 'Shipping & Payment Verification'}
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
        <div className="overflow-y-auto flex-1 p-6">
          {createdOrder ? (
            /* Order Success View */
            <div className="py-8 text-center space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-bold border border-amber-500/20">
                  {createdOrder.orderNumber}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-3">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  We've received your order and our artisan atelier is preparing your garments. You will receive SMS dispatch notifications at <strong>{createdOrder.customerPhone}</strong>.
                </p>
              </div>

              {/* Order Info Card */}
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
                  <span className="text-amber-400 font-bold">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pt-2 border-t border-neutral-850">
                  <span>Total Amount:</span>
                  <span className="text-sm font-bold text-white">
                    ৳{createdOrder.total.toLocaleString('en-BD')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onViewOrderInvoice(createdOrder)}
                  className="flex-1 py-3 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print PDF Invoice</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-amber-500/20"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Shipping Address Left (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <Truck className="w-4 h-4 text-amber-400" />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tanvir Hossain"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
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
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-neutral-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tanvir@example.com"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Division */}
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Division *</label>
                    <select
                      value={division}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {Object.keys(BD_DIVISIONS_DATA).map((div) => (
                        <option key={div} value={div}>
                          {div} Division
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">District *</label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {availableDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thana */}
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Thana / Upazila *</label>
                    <select
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {availableThanas.map((th) => (
                        <option key={th} value={th}>
                          {th}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Postal code */}
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 1212"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-neutral-400 mb-1">Street Address, House &amp; Apt *</label>
                    <textarea
                      required
                      rows={2}
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. House 42, Road 113, Block D, Gulshan-2, Dhaka"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Shipping timeline badge */}
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-neutral-300">
                      {isInsideDhaka ? 'Inside Dhaka (24 - 48 Hours)' : 'Outside Dhaka (48 - 72 Hours via Courier)'}
                    </span>
                  </div>
                  <span className="text-amber-400 font-semibold">
                    {subtotal > 3000 ? 'FREE' : `৳${isInsideDhaka ? 80 : 150}`}
                  </span>
                </div>
              </div>

              {/* Payment Methods Right (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                    Select Payment Gateway
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {/* bKash */}
                  <label
                    onClick={() => setPaymentMethod('bKash')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'bKash'
                        ? 'border-pink-500 bg-pink-950/20 shadow-md ring-1 ring-pink-500'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-600 text-white font-bold text-xs flex items-center justify-center">
                        bK
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">bKash Mobile Payment</span>
                        <span className="text-[10px] text-neutral-400">Instant verification &bull; 01819-876543</span>
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
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'Nagad'
                        ? 'border-orange-500 bg-orange-950/20 shadow-md ring-1 ring-orange-500'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                        NG
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Nagad Wallet</span>
                        <span className="text-[10px] text-neutral-400">Direct mobile transaction</span>
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

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'COD'
                        ? 'border-amber-500 bg-amber-950/20 shadow-md ring-1 ring-amber-500'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-600 text-black font-bold text-xs flex items-center justify-center">
                        COD
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Cash on Delivery (COD)</span>
                        <span className="text-[10px] text-neutral-400">Pay cash upon delivery at your doorstep</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-amber-500"
                    />
                  </label>

                  {/* SSLCommerz */}
                  <label
                    onClick={() => setPaymentMethod('SSLCommerz')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'SSLCommerz'
                        ? 'border-blue-500 bg-blue-950/20 shadow-md ring-1 ring-blue-500'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        SSL
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">SSLCommerz Gateway</span>
                        <span className="text-[10px] text-neutral-400">Visa, Mastercard, Amex, City Bank</span>
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

                {/* Simulated TrxID for bKash / Nagad */}
                {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                    <p className="text-neutral-400">
                      Send Money to Merchant: <strong className="text-amber-400 font-mono">01819-876543</strong>
                    </p>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        Transaction ID (TrxID) - Optional for demo
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. BK9X8712QA (Leave blank to auto-generate)"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Order Summary Recap */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Items Subtotal ({cart.length})</span>
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
                    <span className="text-base text-amber-400">
                      ৳{calculatedFinalTotal.toLocaleString('en-BD')}
                    </span>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying &amp; Placing Order...</span>
                  ) : (
                    <>
                      <span>Confirm &amp; Place Order (৳{calculatedFinalTotal.toLocaleString('en-BD')})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <span className="text-[10px] text-neutral-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Encrypted end-to-end payment gateway simulation
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
