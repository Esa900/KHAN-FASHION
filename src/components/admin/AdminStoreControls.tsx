import React, { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  Phone,
  MessageSquare,
  Bell,
  Globe,
  Lock,
  Save,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { StoreSettings } from '../../types';

export const AdminStoreControls: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'KHAN FASHION',
    tagline: 'সেরা গ্যাজেট, সেরা দামে! বাংলাদেশ সবচেয়ে বড় অনলাইন শপ',
    phone: '01410732067',
    whatsapp: '01410732067',
    announcementText: '⚡ বিশেষ অফার! সারাদেশে ফ্রি ক্যাশ অন ডেলিভারি এবং দ্রুততম কুরিয়ার সার্ভিস!',
    isAnnouncementActive: true,
    metaTitle: 'KHAN FASHION - সেরা গ্যাজেট ও ফ্যাশন অনলাইন শপ বাংলাদেশ',
    metaDescription: 'বাংলাদেশ সবচেয়ে বড় গ্যাজেট ও ইলেকট্রনিক্স অনলাইন শপ। সাশ্রয়ী মূল্যে পান আসল পণ্য ও দ্রুততম হোম ডেলিভারি।'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/store-settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error('Failed to load store settings', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/store-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: 'স্টোর সেটিংস ও নোটিশ সফলভাবে আপডেট হয়েছে!' });
        // Update document title dynamically
        if (settings.metaTitle) {
          document.title = settings.metaTitle;
        }
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'সেটিংস আপডেট ব্যর্থ হয়েছে' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'সার্ভার সংযোগ সমস্যা' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!' });
      return;
    }

    try {
      const res = await fetch('/api/store-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newAdminPassword: newPassword
        })
      });

      if (res.ok) {
        setPasswordFeedback({ type: 'success', message: 'অ্যাডমিন সিকিউরিটি পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.json();
        setPasswordFeedback({ type: 'error', message: err.error || 'বর্তমান পাসওয়ার্ড ভুল!' });
      }
    } catch {
      setPasswordFeedback({ type: 'error', message: 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Store Controls &amp; Settings</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-[#e02424] font-bold">
              {settings.storeName}
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            দোকানের নাম, হটলাইন ফোন, ঘোষণা বার (Announcement), গুগল এসইও এবং অ্যাডমিন সিকিউরিটি পাসওয়ার্ড পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="p-2 text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition self-start sm:self-auto"
          title="রিফ্রেশ"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
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

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Card 1: Basic Store Identity */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Store className="w-5 h-5 text-[#e02424]" />
            <h3 className="font-bold text-sm text-neutral-900">স্টোরের মৌলিক তথ্য</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                দোকানের নাম (Store Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                placeholder="KHAN FASHION"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">ট্যাগলাইন (Tagline)</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>হটলাইন মোবাইল নম্বর</span>
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="01410732067"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp নম্বর</span>
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="01410732067"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Announcement Bar */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-neutral-900">হেডার নোটিশ বার (Announcement Banner)</h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-neutral-600">
                {settings.isAnnouncementActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Off)'}
              </span>
              <input
                type="checkbox"
                checked={settings.isAnnouncementActive}
                onChange={(e) => setSettings({ ...settings, isAnnouncementActive: e.target.checked })}
                className="w-4 h-4 accent-[#e02424] cursor-pointer"
              />
            </label>
          </div>

          <div className="text-xs space-y-2">
            <label className="block font-bold text-neutral-700">ঘোষণা টেক্সট</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              placeholder="⚡ বিশেষ অফার! সারাদেশে ফ্রি ক্যাশ অন ডেলিভারি..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#e02424]"
            />
            <p className="text-[11px] text-neutral-400">
              এই বার্তাটি ওয়েবসাইটের সর্বউপরে লাল/কালো স্ট্রিপে স্ক্রল অথবা নোটিশ হিসেবে প্রদর্শিত হবে।
            </p>
          </div>
        </div>

        {/* Card 3: SEO & Meta */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-neutral-900">গুগল সার্চ ও এসইও (Google Search &amp; SEO)</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                মেটা টাইটেল (Browser &amp; Google Title)
              </label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                মেটা ডেসক্রিপশন (Google Description)
              </label>
              <textarea
                rows={2}
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button for Settings */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#e02424] hover:bg-[#c81e1e] text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'স্টোর সেটিংস সেভ করুন'}</span>
          </button>
        </div>
      </form>

      {/* Card 4: Security Password Change */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4 pt-6 mt-8">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-neutral-800" />
            <div>
              <h3 className="font-bold text-sm text-neutral-900">
                অ্যাডমিন সিকিউরিটি পাসওয়ার্ড পরিবর্তন (Admin Password)
              </h3>
              <p className="text-[11px] text-neutral-500">
                ডিফল্ট পাসওয়ার্ড: <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono font-bold text-red-600">ESA006##</code>
              </p>
            </div>
          </div>
        </div>

        {passwordFeedback && (
          <div
            className={`p-3 rounded-lg border text-xs font-medium flex items-center justify-between ${
              passwordFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {passwordFeedback.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{passwordFeedback.message}</span>
            </div>
            <button onClick={() => setPasswordFeedback(null)} className="text-neutral-400">
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                বর্তমান পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="যেমন: ESA006##"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-800"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড দিন"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-800"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                কনফার্ম নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পুনরায় পাসওয়ার্ড দিন"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-500 hover:text-neutral-700 flex items-center gap-1 font-semibold"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded-lg shadow-xs transition"
            >
              পাসওয়ার্ড আপডেট করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
