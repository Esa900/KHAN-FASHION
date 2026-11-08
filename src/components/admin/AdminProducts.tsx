import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Check,
  RefreshCw,
  AlertCircle,
  Star,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product, ProductVariantSize, ProductColor } from '../../types';

export const AdminProducts: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<Product['category']>('Accessories');
  const [subCategory, setSubCategory] = useState('Smart Gadgets');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1450);
  const [salePrice, setSalePrice] = useState<number | undefined>(950);
  const [fabric, setFabric] = useState('ABS Food-Grade Polymer & Stainless Steel');
  const [careInstructions, setCareInstructions] = useState('Keep dry when not in use. Do not immerse motor in water.');
  const [sizes, setSizes] = useState<ProductVariantSize[]>([
    { size: 'Standard', stock: 25 }
  ]);
  const [colors, setColors] = useState<ProductColor[]>([
    { name: 'Classic Black', hex: '#0f172a' },
    { name: 'Silver Chrome', hex: '#64748b' }
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#b45309');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // AI Generation State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedTips, setAiGeneratedTips] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
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
    setSku(`TNM-GAD-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('Accessories');
    setSubCategory('Smart Gadgets');
    setDescription('');
    setPrice(1450);
    setSalePrice(950);
    setFabric('ABS Food-Grade Polymer & Metal Alloys');
    setCareInstructions('Wipe with microfiber cloth. Keep electrical contacts dry.');
    setSizes([
      { size: 'Standard', stock: 20 }
    ]);
    setColors([
      { name: 'Onyx Black', hex: '#0f172a' },
      { name: 'Pure White', hex: '#ffffff' }
    ]);
    setImages(['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80']);
    setAiGeneratedTips(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSku(p.sku);
    setCategory(p.category);
    setSubCategory(p.subCategory || '');
    setDescription(p.description);
    setPrice(p.price);
    setSalePrice(p.salePrice);
    setFabric(p.fabric || '');
    setCareInstructions(p.careInstructions || '');
    setSizes(p.sizes);
    setColors(p.colors);
    setImages(p.images);
    setAiGeneratedTips(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleGenerateDescriptionAI = async () => {
    if (!title.trim()) {
      setErrorMsg('Please specify at least the product title before generating with AI.');
      return;
    }

    setIsGeneratingAI(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category,
          subCategory,
          fabric,
          colors: colors.map((c) => c.name)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate copy');
      }

      if (data.description) {
        let fullText = data.description;
        if (data.highlights && data.highlights.length > 0) {
          fullText += '\n\nKey Highlights:\n' + data.highlights.map((h: string) => `• ${h}`).join('\n');
        }
        setDescription(fullText);
      }

      if (data.stylingTips) {
        setAiGeneratedTips(data.stylingTips);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'AI generation failed');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category) {
      setErrorMsg('Please enter Title, Price, and Category.');
      return;
    }

    const payload = {
      title,
      sku,
      category,
      subCategory,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      fabric,
      careInstructions,
      sizes,
      colors,
      images
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this garment from the active catalog?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUpdateSizeStock = (sizeToUpdate: string, newStock: number) => {
    setSizes((prev) =>
      prev.map((s) => (s.size === sizeToUpdate ? { ...s, stock: Math.max(0, newStock) } : s))
    );
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (name: string) => {
    if (colors.length <= 1) return;
    setColors((prev) => prev.filter((c) => c.name !== name));
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.fabric ? p.fabric.toLowerCase().includes(search.toLowerCase()) : false);
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Product Catalog &amp; SKU Management</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Maintain electronics, specifications, warranty, stock quantities, and AI descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, or fabric..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 min-h-[40px]"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs pb-1 sm:pb-0">
          {['All', 'Panjabi', 'Saree', 'Western', 'Winter', 'Accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition min-h-[38px] flex items-center ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card View (Visible on screens < md) */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-400 text-xs">Loading garments...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-xs">No garments found.</div>
        ) : (
          filteredProducts.map((p) => {
            const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
            return (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3"
              >
                <div className="flex gap-3">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-16 h-20 object-cover rounded-lg bg-neutral-950 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="font-mono text-amber-300 font-semibold">{p.sku}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200">{p.category}</span>
                    </div>
                    <h3 className="font-semibold text-white text-xs truncate mt-0.5">{p.title}</h3>
                    <p className="text-[11px] text-neutral-400 italic line-clamp-1">{p.fabric}</p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="font-mono font-bold text-white text-sm">
                        ৳{(p.salePrice ?? p.price).toLocaleString('en-BD')}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        totalStock === 0 ? 'bg-rose-950 text-rose-400' : totalStock < 8 ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {totalStock} in stock
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition min-h-[44px]"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Garment</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="py-2 px-3 rounded-lg bg-neutral-800 hover:bg-rose-950 text-rose-400 font-semibold text-xs flex items-center justify-center min-h-[44px]"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Data Table (Hidden on screens < md) */}
      <div className="hidden md:block rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-neutral-400 text-xs">Loading product inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 text-xs">No garments match current criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px] bg-neutral-950/50">
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Fabric</th>
                  <th className="py-3.5 px-4 text-right">Price (BDT)</th>
                  <th className="py-3.5 px-4 text-center">Variants Stock</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                {filteredProducts.map((p) => {
                  const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
                  return (
                    <tr key={p.id} className="hover:bg-neutral-850/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-12 h-14 object-cover rounded-lg bg-neutral-950 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-white block truncate max-w-[200px]">
                              {p.title}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{p.rating} ({p.reviewsCount})</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-neutral-300">{p.sku}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 font-medium text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-300 max-w-[150px] truncate">{p.fabric}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <div>৳{(p.salePrice ?? p.price).toLocaleString('en-BD')}</div>
                        {p.salePrice && (
                          <span className="text-[10px] text-neutral-500 line-through">
                            ৳{p.price.toLocaleString('en-BD')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          totalStock === 0
                            ? 'bg-rose-950 text-rose-400'
                            : totalStock < 8
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {totalStock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                            title="Edit Garment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/50 text-neutral-400 hover:text-rose-400 transition"
                            title="Delete Garment"
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
        )}
      </div>

      {/* Responsive Create / Edit Modal (Full screen on mobile, dialog on desktop) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full sm:max-w-3xl bg-neutral-900 border sm:border-neutral-800 sm:rounded-2xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
              <h2 className="text-sm sm:text-base font-serif font-bold text-white">
                {editingProduct ? 'Edit Garment Details' : 'Create New Collection Garment'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 text-xs pb-24 sm:pb-6">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title, SKU, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Garment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Imperial Velvet Embroidered Panjabi"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 min-h-[40px]"
                  >
                    <option value="Panjabi">Panjabi (Festive)</option>
                    <option value="Saree">Saree (Handloom)</option>
                    <option value="Western">Western &amp; Linen</option>
                    <option value="Winter">Winter Outerwear</option>
                    <option value="Accessories">Accessories &amp; Shawls</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="e.g. Royal Festive, Jamdani"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Fabric &amp; Material
                  </label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. Pure Silk & Jacquard"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 min-h-[40px]"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Regular Price (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Sale / Promotional Price (Optional BDT ৳)
                  </label>
                  <input
                    type="number"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Discounted price"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 min-h-[40px]"
                  />
                </div>
              </div>

              {/* AI Auto-Copywriting Feature */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                    Product Description &amp; Highlights
                  </label>

                  <button
                    type="button"
                    onClick={handleGenerateDescriptionAI}
                    disabled={isGeneratingAI}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-500/20 disabled:opacity-50 min-h-[38px]"
                  >
                    {isGeneratingAI ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isGeneratingAI ? 'Generating with Gemini...' : 'Generate Description with AI'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description, fabric notes, and occasion suitability..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white leading-relaxed focus:outline-none focus:border-amber-500 font-light"
                />

                {aiGeneratedTips && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-neutral-300 text-[11px] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400">Gemini Styling Recommendation:</strong> {aiGeneratedTips}
                    </div>
                  </div>
                )}
              </div>

              {/* Sizes & Stock Quantity per Variant Matrix */}
              <div>
                <label className="block text-neutral-400 font-semibold uppercase tracking-wider text-[11px] mb-2">
                  Variant Stock Quantities per Size
                </label>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {sizes.map((s) => (
                    <div key={s.size} className="p-2 sm:p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-1">
                      <span className="font-bold text-white text-xs block">{s.size}</span>
                      <input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => handleUpdateSizeStock(s.size, Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-1 py-1 text-center text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[9px] text-neutral-500 block">units</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <label className="block text-neutral-400 font-semibold uppercase tracking-wider text-[11px] mb-2">
                  Colors &amp; Hex Swatches
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {colors.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-700" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(c.name)}
                        className="text-neutral-500 hover:text-rose-400 ml-1 text-sm p-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Color Name (e.g. Royal Maroon)"
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white min-h-[40px]"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 bg-transparent cursor-pointer rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium min-h-[40px]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-neutral-400 font-semibold uppercase tracking-wider text-[11px] mb-2">
                  Product Images (Cloudinary / CDN URLs)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 group">
                      <img src={imgUrl} alt="Garment" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 rounded bg-neutral-900/90 text-rose-400 hover:bg-rose-900/80 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Image URL link (https://...)"
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white min-h-[40px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium min-h-[40px]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Sticky Submit CTA on Mobile */}
              <div className="fixed sm:static bottom-0 left-0 right-0 p-4 sm:p-0 bg-neutral-950 sm:bg-transparent border-t sm:border-t-0 border-neutral-800 flex justify-end gap-3 z-30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 min-h-[44px]"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
