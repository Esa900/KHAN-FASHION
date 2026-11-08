import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, CheckCircle, RefreshCw, Plus, Search, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

export const AdminInventory: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterThreshold, setFilterThreshold] = useState<'all' | 'low' | 'out'>('low');
  const [replenishingId, setReplenishingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load inventory:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuickRestock = async (product: Product, sizeToRestock: string, amountToAdd = 10) => {
    setReplenishingId(`${product.id}-${sizeToRestock}`);
    try {
      const updatedSizes = product.sizes.map((s) =>
        s.size === sizeToRestock ? { ...s, stock: s.stock + amountToAdd } : s
      );

      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sizes: updatedSizes })
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error('Restock failed:', e);
    } finally {
      setReplenishingId(null);
    }
  };

  const variantItems: {
    product: Product;
    size: string;
    stock: number;
    status: 'ok' | 'low' | 'out';
  }[] = [];

  products.forEach((p) => {
    p.sizes.forEach((s) => {
      let status: 'ok' | 'low' | 'out' = 'ok';
      if (s.stock === 0) status = 'out';
      else if (s.stock < 5) status = 'low';

      if (filterThreshold === 'all' || (filterThreshold === 'low' && status !== 'ok') || (filterThreshold === 'out' && status === 'out')) {
        variantItems.push({
          product: p,
          size: s.size,
          stock: s.stock,
          status
        });
      }
    });
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">Inventory Health &amp; Stock Alerts</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Monitor size/color variants with stock &lt; 5 units to prevent checkout fulfillment delays.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition min-h-[44px]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Sync Stock Data</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
        <button
          onClick={() => setFilterThreshold('low')}
          className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap min-h-[38px] ${
            filterThreshold === 'low'
              ? 'bg-amber-500 text-black'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low &amp; Out of Stock Alerts ({variantItems.length})</span>
        </button>

        <button
          onClick={() => setFilterThreshold('out')}
          className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap min-h-[38px] ${
            filterThreshold === 'out'
              ? 'bg-rose-500 text-white'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Sold Out Only</span>
        </button>

        <button
          onClick={() => setFilterThreshold('all')}
          className={`px-3 py-2 rounded-lg font-bold transition whitespace-nowrap min-h-[38px] ${
            filterThreshold === 'all'
              ? 'bg-neutral-800 text-white'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All Variants
        </button>
      </div>

      {/* Mobile Card List (Visible on screens < md) */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-400 text-xs">Checking live inventory levels...</div>
        ) : variantItems.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-xs space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-semibold text-white">All garment variants are well-stocked!</p>
          </div>
        ) : (
          variantItems.map((item, idx) => {
            const key = `${item.product.id}-${item.size}`;
            const isRestocking = replenishingId === key;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-14 object-cover rounded bg-neutral-950 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-semibold text-white text-xs block truncate">{item.product.title}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{item.product.sku}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 font-bold text-[10px]">
                        Size {item.size}
                      </span>
                      <span className={`text-xs font-mono font-bold ${item.stock === 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {item.stock} left
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickRestock(item.product, item.size, 10)}
                  disabled={isRestocking}
                  className="px-3.5 py-2.5 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-black text-amber-300 font-bold text-xs flex items-center gap-1 transition min-h-[44px] flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isRestocking ? 'Updating...' : '+10 Restock'}</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table (Hidden on screens < md) */}
      <div className="hidden md:block rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-neutral-400 text-xs">Checking live inventory levels...</div>
        ) : variantItems.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 text-xs space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-semibold text-white">All garment variants are well-stocked!</p>
            <p className="text-neutral-500">No variant is below the critical threshold of 5 units.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px] bg-neutral-950/50">
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Size Variant</th>
                  <th className="py-3.5 px-4">Available Units</th>
                  <th className="py-3.5 px-4">Urgency Status</th>
                  <th className="py-3.5 px-4 text-center">Quick Replenish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                {variantItems.map((item, idx) => {
                  const key = `${item.product.id}-${item.size}`;
                  const isRestocking = replenishingId === key;

                  return (
                    <tr key={idx} className="hover:bg-neutral-850/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt=""
                            className="w-10 h-12 object-cover rounded bg-neutral-950"
                          />
                          <span className="font-semibold text-white">{item.product.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-neutral-300">{item.product.sku}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 font-bold text-amber-300">
                          Size {item.size}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={item.stock === 0 ? 'text-rose-400' : 'text-amber-400'}>
                          {item.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === 'out'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : item.status === 'low'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {item.status === 'out' ? 'Sold Out' : item.status === 'low' ? 'Low Stock (<5)' : 'Optimal'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleQuickRestock(item.product, item.size, 10)}
                          disabled={isRestocking}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-200 font-semibold text-[11px] flex items-center justify-center gap-1 mx-auto transition disabled:opacity-50 min-h-[36px]"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isRestocking ? 'Updating...' : '+10 Restock'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
