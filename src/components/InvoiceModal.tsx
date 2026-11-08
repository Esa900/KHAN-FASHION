import React from 'react';
import { X, Printer, Download, CheckCircle, Clock } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-neutral-900 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Print-Ready Invoice
            </span>
            <span className="text-xs text-neutral-400">#{order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="overflow-y-auto flex-1 p-8 sm:p-12 bg-white text-neutral-900 text-xs font-sans print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-neutral-300 pb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl font-extrabold tracking-[0.2em] text-neutral-950 uppercase">
                A U R A
              </h1>
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-700 font-bold mt-0.5">
                BANGLADESH &bull; LUXURY ATELIER
              </p>
              <p className="text-neutral-600 mt-2 leading-relaxed">
                Flagship: House 42, Road 113, Gulshan-2, Dhaka-1212<br />
                Concierge: +880 1711-234567 | concierge@aura.com.bd<br />
                VAT / BIN: 001928374-0101
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-mono font-bold text-sm border border-neutral-200">
                INVOICE: {order.orderNumber}
              </div>
              <p className="text-neutral-500 text-[11px] pt-1">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {order.paymentStatus === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>Payment {order.paymentStatus}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bill To & Shipping Info */}
          <div className="grid grid-cols-2 gap-8 py-6 border-b border-neutral-200">
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                Billed &amp; Shipped To
              </h3>
              <p className="text-sm font-bold text-neutral-900">{order.customerName}</p>
              <p className="text-neutral-600 mt-0.5 leading-relaxed">
                {order.shippingAddress.streetAddress}<br />
                {order.shippingAddress.thana}, {order.shippingAddress.district} - {order.shippingAddress.postalCode || '1212'}<br />
                {order.shippingAddress.division} Division, Bangladesh
              </p>
              <p className="text-neutral-700 font-medium mt-1">Phone: {order.customerPhone}</p>
              {order.customerEmail && <p className="text-neutral-500">{order.customerEmail}</p>}
            </div>

            <div className="space-y-1.5 text-right">
              <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                Dispatch &amp; Payment Details
              </h3>
              <p className="text-neutral-700">
                Payment Gateway: <strong className="text-neutral-950 uppercase">{order.paymentMethod}</strong>
              </p>
              {order.transactionId && (
                <p className="text-neutral-500 font-mono text-[11px]">
                  TrxID: {order.transactionId}
                </p>
              )}
              <p className="text-neutral-700">
                Fulfillment Status: <strong className="text-neutral-950 uppercase">{order.orderStatus.replace('_', ' ')}</strong>
              </p>
              <p className="text-neutral-500">
                Courier: Pathao Express / Steadfast Logistics
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-neutral-900 text-[10px] uppercase tracking-wider text-neutral-600">
                  <th className="py-3 px-2">Item Description</th>
                  <th className="py-3 px-2 text-center">Variant</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-neutral-800">
                    <td className="py-3 px-2 font-medium">
                      <div>{item.productTitle}</div>
                      <span className="text-[10px] text-neutral-400 font-mono">PID: {item.productId}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-medium text-[11px]">
                        {item.size} / {item.color}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      ৳{item.price.toLocaleString('en-BD')}
                    </td>
                    <td className="py-3 px-2 text-center font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-2 text-right font-bold font-mono">
                      ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <div className="w-64 space-y-2 text-right">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono">৳{order.subtotal.toLocaleString('en-BD')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Voucher / Discount:</span>
                  <span className="font-mono">-৳{order.discount.toLocaleString('en-BD')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Nationwide Shipping:</span>
                <span className="font-mono">
                  {order.shippingFee === 0 ? 'FREE' : `৳${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t-2 border-neutral-900">
                <span>Total Amount:</span>
                <span className="font-mono text-base">৳{order.total.toLocaleString('en-BD')}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-12 pt-6 border-t border-neutral-200 text-neutral-500 text-[10px] space-y-1">
            <p className="font-bold text-neutral-800 uppercase tracking-wider">
              AURA Luxury Exchange &amp; Return Policy:
            </p>
            <p>
              Garments in pristine, unworn condition with intact security tags may be exchanged within 7 days of delivery at any of our Gulshan or Dhanmondi boutiques, or via courier returns.
            </p>
            <p className="text-neutral-400 italic pt-2">
              This is a computer-generated tax invoice. No signature required. Thank you for choosing AURA Bangladesh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
