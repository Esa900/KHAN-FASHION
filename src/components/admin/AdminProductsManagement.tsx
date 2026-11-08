import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Zap,
  ShieldCheck,
  Truck,
  AlertCircle
} from 'lucide-react';
import { Product } from '../../types';

export const AdminProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('TechNova Mart');
  const [category, setCategory] = useState('Accessories');
  const [subCategory, setSubCategory] = useState('Gadgets');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1450);
  const [salePrice, setSalePrice] = useState<number | undefined>(950);
  const [stock, setStock] = useState(20);

  // 4 Image Slots
  const [imageSlot1, setImageSlot1] = useState('');
  const [imageSlot2, setImageSlot2] = useState('');
  const [imageSlot3, setImageSlot3] = useState('');
  const [imageSlot4, setImageSlot4] = useState('');

  // Special Toggles
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isOfficialMall, setIsOfficialMall] = useState(true);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);

  // AI Generation State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.map((c: any) => c.name));
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setTitle('');
    setSku(`TNM-${Math.floor(100 + Math.random() * 900)}`);
    setBrand('TechNova Mart');
    setCategory(categories[0] || 'Accessories');
    setSubCategory('Smart Gadgets');
    setDescription('');
    setPrice(1450);
    setSalePrice(950);
    setStock(25);
    setImageSlot1('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80');
    setImageSlot2('');
    setImageSlot3('');
    setImageSlot4('');
    setIsFlashSale(false);
    setIsOfficialMall(true);
    setIsFreeDelivery(false);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSku(p.sku);
    setBrand(p.brand || 'TechNova Mart');
    setCategory(p.category);
    setSubCategory(p.subCategory || 'General');
    setDescription(p.description);
    setPrice(p.price);
    setSalePrice(p.salePrice);
    setStock(p.sizes?.[0]?.stock ?? 10);
    setImageSlot1(p.images[0] || '');
    setImageSlot2(p.images[1] || '');
    setImageSlot3(p.images[2] || '');
    setImageSlot4(p.images[3] || '');
    setIsFlashSale(!!p.isFlashSale);
    setIsOfficialMall(p.isOfficialMall !== undefined ? p.isOfficialMall : true);
    setIsFreeDelivery(!!p.isFreeDelivery);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  // AI Description Generator
  const handleGenerateDescriptionAI = async () => {
    if (!title.trim()) {
      setErrorMsg('বিবরণ তৈরি করার পূর্বে পণ্যের নাম লিখুন');
      return;
    }
    setIsGeneratingAI(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          subCategory,
          fabric: 'High-grade components & build'
        })
      });
      const data = await res.json();
      if (data.description) {
        const fullDesc = `${data.description}\n\nবৈশিষ্ট্য:\n${(data.highlights || []).map((h: string) => `• ${h}`).join('\n')}\n\nপরামর্শ: ${data.stylingTips || ''}`;
        setDescription(fullDesc);
      }
    } catch {
      setDescription(`${title} - উচ্চ মানের টেকসই পণ্য। সম্পূর্ণ আসল গ্যারান্টি সহ দ্রুত ডেলিভারি সুবিধা।`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle Image File Upload (Converts to Data URL for instant slot view)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (slotIdx === 1) setImageSlot1(url);
      if (slotIdx === 2) setImageSlot2(url);
      if (slotIdx === 3) setImageSlot3(url);
      if (slotIdx === 4) setImageSlot4(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      setErrorMsg('Title and Price are mandatory.');
      return;
    }

    const images = [imageSlot1, imageSlot2, imageSlot3, imageSlot4].filter(Boolean);
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80');
    }

    const payload = {
      title,
      sku: sku || `TNM-${Math.floor(100 + Math.random() * 900)}`,
      brand,
      category,
      subCategory,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      sizes: [{ size: 'Standard', stock: Number(stock) }],
      colors: [{ name: 'Standard', hex: '#0f172a' }],
      images,
      isFlashSale,
      isOfficialMall,
      isFreeDelivery,
      tags: [category.toLowerCase(), brand.toLowerCase()]
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchProducts();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchProducts();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Save product error:', err);
    }
  };

  const handleDelete = async (id: string, productTitle: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত "${productTitle}" মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar with Add Product CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>পণ্য ও স্টক ম্যানেজমেন্ট</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-[#e02424] font-bold">
              মোট: {products.length} টি
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            নতুন পণ্য যোগ করুন, ৪টি ছবি স্লট, ফ্ল্যাশ সেল, অফিসিয়াল মল ও ফ্রি ডেলিভারি টগল করুন
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-lg bg-[#e02424] hover:bg-[#c81e1e] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্যের নাম বা SKU কোড দিয়ে সার্চ করুন..."
            className="w-full bg-white border border-neutral-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-500 shadow-2xs"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-xs text-neutral-800 font-medium focus:outline-none focus:border-red-500 shadow-2xs cursor-pointer"
        >
          <option value="All">সকল ক্যাটাগরি ({products.length})</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3">ছবি</th>
                <th className="px-4 py-3">পণ্যের নাম ও SKU</th>
                <th className="px-4 py-3">ক্যাটাগরি</th>
                <th className="px-4 py-3">মূল্য</th>
                <th className="px-4 py-3">স্টক</th>
                <th className="px-4 py-3">স্পেশাল ব্যাজ</th>
                <th className="px-4 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(p => {
                const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-neutral-50 transition">
                    <td className="px-4 py-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-12 h-12 object-contain bg-neutral-100 rounded-lg border border-neutral-200 p-1"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-bold text-neutral-900 truncate">{p.title}</p>
                      <p className="text-[11px] font-mono text-neutral-400">{p.sku} • {p.brand || 'TechNova'}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-baseline gap-1.5 font-mono">
                        <span className="font-bold text-[#e02424] text-sm">
                          ৳{(p.salePrice ?? p.price).toLocaleString('en-BD')}
                        </span>
                        {p.salePrice && p.salePrice < p.price && (
                          <span className="text-[11px] text-neutral-400 line-through">
                            ৳{p.price.toLocaleString('en-BD')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        totalStock === 0 ? 'bg-red-100 text-red-700' : totalStock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {totalStock} টি
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {p.isFlashSale && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-[#e02424] text-[10px] font-bold flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> Flash
                          </span>
                        )}
                        {p.isOfficialMall && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" /> Mall
                          </span>
                        )}
                        {p.isFreeDelivery && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-0.5">
                            <Truck className="w-2.5 h-2.5" /> Free
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                          title="এডিট করুন"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-600 transition"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 max-h-[92vh] overflow-y-auto my-auto">
            <div className="sticky top-0 bg-white p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between z-10">
              <h3 className="font-bold text-base text-neutral-900">
                {editingProduct ? 'পণ্য সংশোধন (Edit Product)' : 'নতুন পণ্য যোগ করুন (Add Product)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    পণ্যের নাম (Product Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Prestige Electric Kettle 2.0 Liter"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    ব্র্যান্ড (Brand)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Prestige / TechNova / VGR"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    SKU কোড
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    ক্যাটাগরি (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-red-500 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    স্টক সংখ্যা (Stock Quantity)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    পূর্বের মূল্য (Regular Price ৳)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    বিক্রয় মূল্য (Sale Price ৳)
                  </label>
                  <input
                    type="number"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="ডিসকাউন্ট দাম (যেমন ৳950)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* 4 Photo Upload Slots (Slots 1-4) */}
              <div className="space-y-2 border-t border-neutral-200 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-900">
                    ৪টি ছবি আপলোড (Photo Slots 1-4)
                  </label>
                  <span className="text-[11px] text-neutral-500">ফাইল আপলোড করুন অথবা ইমেজ লিংক দিন</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Slot 1 (Cover) */}
                  <div className="space-y-1.5 p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                    <span className="text-[10px] font-bold text-neutral-600 block">Slot 1 (Cover *)</span>
                    <div className="aspect-square bg-white rounded-lg border border-neutral-300 overflow-hidden relative flex items-center justify-center">
                      {imageSlot1 ? (
                        <img src={imageSlot1} alt="Slot 1" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-neutral-300" />
                      )}
                    </div>
                    <label className="w-full py-1 text-[10px] font-bold text-white bg-neutral-800 hover:bg-black rounded block cursor-pointer">
                      আপলোড ফাইল
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 1)} className="hidden" />
                    </label>
                    <input
                      type="text"
                      placeholder="বা URL লিংক"
                      value={imageSlot1}
                      onChange={(e) => setImageSlot1(e.target.value)}
                      className="w-full px-1.5 py-1 text-[10px] border border-neutral-200 rounded bg-white"
                    />
                  </div>

                  {/* Slot 2 */}
                  <div className="space-y-1.5 p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                    <span className="text-[10px] font-bold text-neutral-600 block">Slot 2 (গ্যালারি)</span>
                    <div className="aspect-square bg-white rounded-lg border border-neutral-300 overflow-hidden relative flex items-center justify-center">
                      {imageSlot2 ? (
                        <img src={imageSlot2} alt="Slot 2" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-neutral-300" />
                      )}
                    </div>
                    <label className="w-full py-1 text-[10px] font-bold text-white bg-neutral-800 hover:bg-black rounded block cursor-pointer">
                      আপলোড ফাইল
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 2)} className="hidden" />
                    </label>
                    <input
                      type="text"
                      placeholder="বা URL লিংক"
                      value={imageSlot2}
                      onChange={(e) => setImageSlot2(e.target.value)}
                      className="w-full px-1.5 py-1 text-[10px] border border-neutral-200 rounded bg-white"
                    />
                  </div>

                  {/* Slot 3 */}
                  <div className="space-y-1.5 p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                    <span className="text-[10px] font-bold text-neutral-600 block">Slot 3 (গ্যালারি)</span>
                    <div className="aspect-square bg-white rounded-lg border border-neutral-300 overflow-hidden relative flex items-center justify-center">
                      {imageSlot3 ? (
                        <img src={imageSlot3} alt="Slot 3" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-neutral-300" />
                      )}
                    </div>
                    <label className="w-full py-1 text-[10px] font-bold text-white bg-neutral-800 hover:bg-black rounded block cursor-pointer">
                      আপলোড ফাইল
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 3)} className="hidden" />
                    </label>
                    <input
                      type="text"
                      placeholder="বা URL লিংক"
                      value={imageSlot3}
                      onChange={(e) => setImageSlot3(e.target.value)}
                      className="w-full px-1.5 py-1 text-[10px] border border-neutral-200 rounded bg-white"
                    />
                  </div>

                  {/* Slot 4 */}
                  <div className="space-y-1.5 p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                    <span className="text-[10px] font-bold text-neutral-600 block">Slot 4 (গ্যালারি)</span>
                    <div className="aspect-square bg-white rounded-lg border border-neutral-300 overflow-hidden relative flex items-center justify-center">
                      {imageSlot4 ? (
                        <img src={imageSlot4} alt="Slot 4" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-neutral-300" />
                      )}
                    </div>
                    <label className="w-full py-1 text-[10px] font-bold text-white bg-neutral-800 hover:bg-black rounded block cursor-pointer">
                      আপলোড ফাইল
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 4)} className="hidden" />
                    </label>
                    <input
                      type="text"
                      placeholder="বা URL লিংক"
                      value={imageSlot4}
                      onChange={(e) => setImageSlot4(e.target.value)}
                      className="w-full px-1.5 py-1 text-[10px] border border-neutral-200 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Special Toggles */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <label className="text-xs font-bold text-neutral-900 block">
                  স্পেশাল স্টোর টগলসমূহ (Special Badges)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:border-red-400">
                    <input
                      type="checkbox"
                      checked={isFlashSale}
                      onChange={(e) => setIsFlashSale(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-neutral-900 block flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-red-500" /> Flash Sale
                      </span>
                      <span className="text-[10px] text-neutral-400">হট অফার সেকশনে যাবে</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:border-blue-400">
                    <input
                      type="checkbox"
                      checked={isOfficialMall}
                      onChange={(e) => setIsOfficialMall(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-neutral-900 block flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Official Mall
                      </span>
                      <span className="text-[10px] text-neutral-400">১০০% আসল প্রোডাক্ট ব্যাজ</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:border-emerald-400">
                    <input
                      type="checkbox"
                      checked={isFreeDelivery}
                      onChange={(e) => setIsFreeDelivery(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-neutral-900 block flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-emerald-500" /> Free Delivery
                      </span>
                      <span className="text-[10px] text-neutral-400">ফ্রি ডেলিভারি ট্যাগ</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description & AI Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700">
                    পণ্যের বিবরণ (Description)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescriptionAI}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-50 text-[#e02424] hover:bg-red-100 text-xs font-bold transition cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAI ? 'AI লিখছে...' : 'AI দিয়ে বিবরণ তৈরি করুন'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="পণ্যের বিস্তারিত বিবরণ, স্পেসিফিকেশন ও ওয়ারেন্টির তথ্য লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#e02424] hover:bg-[#c81e1e] text-white font-bold text-xs shadow-xs transition"
                >
                  {editingProduct ? 'আপডেট সংরক্ষণ করুন' : 'পণ্য প্রকাশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
