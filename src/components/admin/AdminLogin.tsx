import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@technovamartbd.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Invalid admin credentials');
    }
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@technovamartbd.com');
    setPassword('admin123');
    setIsLoading(true);
    const result = await login('admin@technovamartbd.com', 'admin123');
    setIsLoading(false);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-neutral-950">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#e02424] flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-lg shadow-red-600/30">
            T
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            TechNova Admin Suite
          </h2>
          <p className="text-xs text-neutral-400">
            Restricted access for store managers, inventory control, and fulfillment.
          </p>
        </div>

        {/* Demo Fast-Login Notice */}
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Instant Demo Admin Access</span>
          </div>
          <p className="text-neutral-300 text-[11px]">
            Pre-filled credentials: <strong className="text-white">admin@technovamartbd.com</strong> / <strong className="text-white">admin123</strong>
          </p>
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition"
          >
            One-Click Sign In as Admin
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@voguebangla.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white pl-9 focus:outline-none focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white pl-9 focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-white hover:bg-amber-400 hover:text-black text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? <span>Verifying Token...</span> : <span>Authorize Access</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onBackToStore}
            className="text-xs text-neutral-400 hover:text-amber-400 transition"
          >
            &larr; Return to Public Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
