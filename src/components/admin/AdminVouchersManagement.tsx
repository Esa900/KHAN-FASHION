import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Copy, Check, AlertCircle, Percent, DollarSign, Calendar, RefreshCw, X } from 'lucide-react';
import { Voucher } from '../../types';

export const AdminVouchersManagement: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add Voucher Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(1000);

  // Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vouchers');
      if (res.ok) {
        const data = await res.json();
        setVouchers(data);
      }
    } catch (e) {
      console.error('Failed to load vouchers', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      const res = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: Number(discountValue),
          minSpend: Number(minSpend)
        })
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: `কুপন কোড "${code.toUpperCase()}" তৈরি হয়েছে!` });
        setCode('');
        setIsAddOpen(false);
        fetchVouchers();
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'ভাউচার তৈরিতে ত্রুটি' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'সার্ভার সংযোগ সমস্যা' });
    }
  };

  const handleDeleteVoucher = async (voucherId: string, voucherCode: string) => {
    if (!confirm(`আপনি কি "${voucherCode}" কুপনটি ডিলিট করতে চান?`)) return;

    try {
      const res = await fetch(`/api/vouchers/${voucherId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: `কুপন "${voucherCode}" মুছে ফেলা হয়েছে!` });
        fetchVouchers();
      }
    } catch {
      setFeedback({ type: 'error', message: 'কুপন মুছতে সমস্যা হয়েছে' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Vouchers &amp; Promo Codes</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-[#e02424] font-bold">
              {vouchers.length} Active Vouchers
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            কাস্টমারদের জন্য স্পেশাল ডিসকাউন্ট কুপন তৈরি ও পরিচালনা করুন (শতকরা % অথবা নির্দিষ্ট ৳ ছাড়)।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchVouchers}
            className="p-2 text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#e02424] hover:bg-[#c81e1e] text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ভাউচার যোগ করুন</span>
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

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs hover:shadow-xs transition relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-[#e02424] flex items-center justify-center font-bold">
                  {v.discountType === 'percentage' ? (
                    <Percent className="w-4 h-4" />
                  ) : (
                    <span className="text-sm">৳</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-base tracking-wider text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {v.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(v.code)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 transition"
                      title="কপি করুন"
                    >
                      {copiedCode === v.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    {v.isActive ? 'Active Promo' : 'Expired'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteVoucher(v.id, v.code)}
                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Middle Values */}
            <div className="my-4 space-y-1.5 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">ডিসকাউন্ট মান:</span>
                <span className="font-bold text-[#e02424]">
                  {v.discountType === 'percentage' ? `${v.discountValue}% ছাড়` : `৳${v.discountValue} ফ্ল্যাট ছাড়`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">সর্বনিম্ন কেনাকাটা:</span>
                <span className="font-semibold text-neutral-800">৳{v.minSpend}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">মোট ব্যবহার:</span>
                <span className="font-bold text-neutral-900">{v.usedCount} বার</span>
              </div>
            </div>

            {/* Bottom note */}
            <p className="text-[11px] text-neutral-400 italic">
              চেকআউটে গ্রাহক এই কুপন কোড ব্যবহার করে তাৎক্ষণিক ছাড় উপভোগ করতে পারবেন।
            </p>
          </div>
        ))}
      </div>

      {vouchers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-neutral-200 p-6">
          <p className="text-sm font-semibold text-neutral-700">কোনো ভাউচার পাওয়া যায়নি</p>
          <p className="text-xs text-neutral-400 mt-1">
            "নতুন ভাউচার যোগ করুন" বাটনে ক্লিক করে প্রথম প্রোমো কোড তৈরি করুন।
          </p>
        </div>
      )}

      {/* Modal: Add Voucher */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#e02424]" />
                <span>নতুন ভাউচার তৈরি করুন</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  কুপন কোড <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="যেমন: EID2026, SAVE10, SUMMER..."
                  className="w-full px-3 py-2 uppercase font-mono text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">ডিসকাউন্ট টাইপ</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType('percentage')}
                    className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition ${
                      discountType === 'percentage'
                        ? 'border-[#e02424] bg-red-50 text-[#e02424]'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>শতকরা (%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition ${
                      discountType === 'fixed'
                        ? 'border-[#e02424] bg-red-50 text-[#e02424]'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span>৳ নির্দিষ্ট টাকা</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    {discountType === 'percentage' ? 'ছাড়ের পরিমাণ (%)' : 'ছাড়ের পরিমাণ (৳)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    সর্বনিম্ন কেনাকাটা (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#e02424] hover:bg-[#c81e1e] rounded-lg shadow-xs"
                >
                  কুপন তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
