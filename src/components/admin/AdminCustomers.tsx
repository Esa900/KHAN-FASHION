import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, ShoppingBag, DollarSign, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CustomerUser } from '../../types';

export const AdminCustomers: React.FC = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error('Failed to load customers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">Registered Customer Directory</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Accounts, order histories, and lifetime patron expenditure in Bangladeshi Taka.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition min-h-[44px]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 min-h-[40px]"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Mobile Customer Cards (Visible on screens < md) */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-400 text-xs">Loading customer directory...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-xs">No registered accounts found.</div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-300 text-sm flex-shrink-0">
                  {c.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs truncate">{c.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      c.role === 'admin' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {c.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 block truncate">{c.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 text-[10px] block">Orders Placed</span>
                  <span className="font-bold font-mono text-white">{c.totalOrders || 0} orders</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 text-[10px] block">Lifetime Spend</span>
                  <span className="font-bold font-mono text-amber-400">৳{(c.totalSpent || 0).toLocaleString('en-BD')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Customers Table (Hidden on screens < md) */}
      <div className="hidden md:block rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-neutral-400 text-xs">Loading customer directory...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 text-xs">No registered accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px] bg-neutral-950/50">
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Default Region</th>
                  <th className="py-3.5 px-4">Account Role</th>
                  <th className="py-3.5 px-4 text-center">Orders Count</th>
                  <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-850/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-300">
                          {c.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{c.name}</span>
                          <span className="text-[10px] text-neutral-500">
                            Member since {new Date(c.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-300">{c.email}</div>
                      <span className="text-[10px] text-neutral-400">{c.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.address ? (
                        <div className="flex items-center gap-1 text-neutral-300">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                          <span>{c.address.thana}, {c.address.division}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500">Dhaka Central</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.role === 'admin'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-white font-mono">
                      {c.totalOrders || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                      ৳{(c.totalSpent || 0).toLocaleString('en-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
