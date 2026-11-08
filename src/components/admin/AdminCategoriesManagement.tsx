import React, { useState, useEffect } from 'react';
import { FolderPlus, Edit2, Trash2, Search, Package, AlertCircle, Check, X, ArrowRight, RefreshCw } from 'lucide-react';
import { CategoryItem } from '../../types';

export const AdminCategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Add Category Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');

  // Rename Category Modal
  const [renameTarget, setRenameTarget] = useState<CategoryItem | null>(null);
  const [updatedName, setUpdatedName] = useState('');

  // Delete Category Modal
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [fallbackCategory, setFallbackCategory] = useState<string>('Accessories');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), icon: newCatIcon || '📦' })
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: `ক্যাটাগরি "${newCatName}" সফলভাবে তৈরি হয়েছে!` });
        setNewCatName('');
        setIsAddOpen(false);
        fetchCategories();
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'ক্যাটাগরি তৈরি ব্যর্থ হয়েছে' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'সার্ভারে সংযোগ করতে ব্যর্থ হয়েছে' });
    }
  };

  const handleRenameCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !updatedName.trim()) return;

    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(renameTarget.name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: updatedName.trim() })
      });

      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `ক্যাটাগরি "${renameTarget.name}" থেকে "${updatedName}"-এ রিনেম করা হয়েছে এবং সংশ্লিষ্ট প্রোডাক্টগুলো আপডেট হয়েছে!`
        });
        setRenameTarget(null);
        setUpdatedName('');
        fetchCategories();
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'রিনেম ব্যর্থ হয়েছে' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'সার্ভারে সংযোগ ব্যর্থ হয়েছে' });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(deleteTarget.name)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fallbackCategory })
      });

      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `ক্যাটাগরি "${deleteTarget.name}" মুছে ফেলা হয়েছে এবং প্রোডাক্টগুলো "${fallbackCategory}"-এ স্থানান্তরিত হয়েছে!`
        });
        setDeleteTarget(null);
        fetchCategories();
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'ক্যাটাগরি মোছা ব্যর্থ হয়েছে' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'সার্ভার সংযোগ ব্যর্থ হয়েছে' });
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Categories Management</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-[#e02424] font-bold">
              {categories.length} Categories
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            ক্যাটাগরি যুক্ত, রিনেম ও ডিলিট করুন। রিনেম করলে স্বয়ংক্রিয়ভাবে সম্পর্কিত সব প্রোডাক্ট আপডেট হবে।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
            className="p-2 text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setNewCatName('');
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#e02424] hover:bg-[#c81e1e] text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>নতুন ক্যাটাগরি যোগ করুন</span>
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
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs flex items-center gap-2">
        <Search className="w-4 h-4 text-neutral-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ক্যাটাগরি অনুসন্ধান করুন (যেমন: Massager, Trimmer, Laptop)..."
          className="w-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="p-1 text-neutral-400 hover:text-neutral-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-xl border border-neutral-200">
                  {cat.icon || '📦'}
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold">
                  <Package className="w-3 h-3 text-neutral-500" />
                  <span>{cat.productCount} টি প্রোডাক্ট</span>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-sm text-neutral-900 truncate" title={cat.name}>
                  {cat.name}
                </h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">ID: {cat.id}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setRenameTarget(cat);
                  setUpdatedName(cat.name);
                }}
                className="px-2.5 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1 transition"
                title="রিনেম করুন"
              >
                <Edit2 className="w-3 h-3 text-neutral-600" />
                <span>Rename</span>
              </button>
              <button
                onClick={() => {
                  setDeleteTarget(cat);
                  // pick a different fallback category
                  const other = categories.find(c => c.name !== cat.name);
                  if (other) setFallbackCategory(other.name);
                }}
                className="px-2.5 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-3 h-3 text-rose-600" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-neutral-200 p-6">
          <p className="text-sm font-semibold text-neutral-700">কোনো ক্যাটাগরি পাওয়া যায়নি</p>
          <p className="text-xs text-neutral-400 mt-1">অনুসন্ধান ফিল্টার পরিবর্তন করুন অথবা নতুন ক্যাটাগরি তৈরি করুন।</p>
        </div>
      )}

      {/* Modal: Add Category */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#e02424]" />
                <span>নতুন ক্যাটাগরি যোগ করুন</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  ক্যাটাগরির নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="যেমন: Smartwatch, Soundbox, Drone..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">আইকন / ইমোজি</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    maxLength={4}
                    className="w-16 px-3 py-2 text-center text-lg border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['📱', '💻', '🎧', '⌚', '💆', '✂️', '🫖', '🔌', '📦'].map(emoji => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setNewCatIcon(emoji)}
                        className={`w-8 h-8 rounded-lg text-sm border flex items-center justify-center transition ${
                          newCatIcon === emoji ? 'border-[#e02424] bg-red-50' : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#e02424] hover:bg-[#c81e1e] rounded-lg shadow-xs transition"
                >
                  ক্যাটাগরি সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rename Category */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-500" />
                <span>ক্যাটাগরি রিনেম করুন</span>
              </h3>
              <button onClick={() => setRenameTarget(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRenameCategory} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>অটোমেটিক প্রোডাক্ট আপডেট</span>
                </p>
                <p className="mt-1 text-[11px] text-amber-800">
                  "{renameTarget.name}" ক্যাটাগরির অন্তর্ভুক্ত <strong>{renameTarget.productCount}</strong> টি প্রোডাক্ট স্বয়ংক্রিয়ভাবে নতুন নামে শিফট হবে।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  নতুন ক্যাটাগরির নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition"
                >
                  নাম পরিবর্তন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Category */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>ক্যাটাগরি মুছে ফেলা</span>
              </h3>
              <button onClick={() => setDeleteTarget(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-neutral-700">
                আপনি কি নিশ্চিত যে <strong>"{deleteTarget.name}"</strong> ক্যাটাগরিটি মুছে ফেলতে চান?
              </p>

              {(deleteTarget.productCount ?? 0) > 0 ? (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-2">
                  <p className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>প্রোডাক্ট মাইগ্রেশন আবশ্যক</span>
                  </p>
                  <p className="text-[11px] text-rose-800">
                    এই ক্যাটাগরিতে {deleteTarget.productCount} টি পণ্য রয়েছে। মুছে ফেলার আগে এই পণ্যগুলো কোন ক্যাটাগরিতে স্থানান্তর করতে চান নির্বাচন করুন:
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      ফলব্যাক ক্যাটাগরি:
                    </label>
                    <select
                      value={fallbackCategory}
                      onChange={(e) => setFallbackCategory(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none"
                    >
                      {categories
                        .filter(c => c.name !== deleteTarget.name)
                        .map(c => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500">
                  এই ক্যাটাগরিতে বর্তমানে কোনো প্রোডাক্ট নেই। নিরাপদে মুছে ফেলা যাবে।
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition"
                >
                  মুছে ফেলুন ও স্থানান্তর করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
